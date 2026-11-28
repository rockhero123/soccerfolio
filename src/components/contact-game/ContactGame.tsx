"use client";

import { useEffect, useRef, useState } from "react";
import { contactGame } from "@/content/contactGame";
import { track } from "@/lib/analytics";
import PixelArt from "../pixel/PixelArt";
import { CLOSE_ICON } from "../sprites/icons";
import { GameEngine, type Phase } from "./engine";
import { ART } from "./gameArt";
import type { Team } from "./physics";
import { CANVAS, bakeArt, drawGame, makePalette, toPitch } from "./render";
import { blowWhistle } from "./whistle";

/** How long the Winner sign stays before the contact signs are revealed. */
export const WINNER_MS = 2600;
/** How long the pitch takes to grow out of the grass before the countdown. */
export const GROW_MS = 900;

type ContactGameProps = {
  /** Created in the click that opened the game, so the whistle may sound. */
  audio: AudioContext | null;
  /** 3 goals scored: reveal the contact signs. */
  onWin: () => void;
  /** Close button or Escape: back to the CONTACT button. */
  onClose: () => void;
};

type Ui = { phase: Phase; score: Record<Team, number>; count: number; turn: Team };

const HINTS: Partial<Record<Phase, string>> = {
  countdown: "Get ready! The machine kicks off.",
  "machine-aim": "The machine is shooting…",
  visitor: "Your turn: drag back from a green player and let go to shoot.",
};

const signText = "font-heading leading-none tracking-wide uppercase text-ink";
const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600";

/**
 * The contact game (spec 900 US-3): a turn-based air-soccer match on a
 * vertical pixel-art pitch, played right in the contact section of the page.
 * The pitch grows out of the grass first, then the countdown starts. Score 3
 * goals to unlock Ricardo's contact details.
 */
export default function ContactGame({ audio, onWin, onClose }: ContactGameProps) {
  const regionRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  /** The pitch is still growing out of the grass: the match waits. */
  const [grown, setGrown] = useState(false);
  const grownRef = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onWinRef = useRef(onWin);
  const [ui, setUi] = useState<Ui>({
    phase: "countdown",
    score: { visitor: 0, machine: 0 },
    count: 3,
    turn: "machine",
  });
  const [engine] = useState(
    () =>
      new GameEngine({
        goalsToWin: contactGame.goalsToWin,
        onEvent: (event) => {
          if (event.type === "whistle") blowWhistle(audio);
          if (event.type === "won" || event.type === "lost")
            track(event.type === "won" ? "game_win" : "game_lose", {
              visitor_goals: engine.score.visitor,
              machine_goals: engine.score.machine,
            });
          if (event.type === "phase" || event.type === "goal") {
            setUi((ui) => ({
              ...ui,
              phase: engine.phase,
              score: { ...engine.score },
              turn: engine.turn,
            }));
          }
        },
      }),
  );

  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

  // Grow the pitch out of the grass (at once with reduced motion), bring it
  // into view and focus the close button; then the match starts.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    regionRef.current?.scrollIntoView?.({ block: "start", behavior: reduce ? "auto" : "smooth" });
    closeRef.current?.focus({ preventScroll: true });
    const timer = setTimeout(
      () => {
        grownRef.current = true;
        setGrown(true);
      },
      reduce ? 0 : GROW_MS,
    );
    return () => clearTimeout(timer);
  }, []);

  // After the Winner sign, reveal the contact signs.
  useEffect(() => {
    if (ui.phase !== "won") return;
    const timer = setTimeout(() => onWinRef.current(), WINNER_MS);
    return () => clearTimeout(timer);
  }, [ui.phase]);

  // Fit the vertical pitch inside its box, keeping its proportions.
  useEffect(() => {
    const box = boxRef.current;
    const canvas = canvasRef.current;
    if (!box || !canvas || typeof ResizeObserver === "undefined") return;
    const fit = () => {
      const scale = Math.min(box.clientWidth / ART.w, box.clientHeight / ART.h);
      canvas.style.width = `${Math.floor(ART.w * scale)}px`;
      canvas.style.height = `${Math.floor(ART.h * scale)}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // The game loop: advance the rules and physics, draw a frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!canvas || !ctx) return;
    const color = makePalette(document.documentElement);
    const art = bakeArt(color);
    const font = getComputedStyle(document.body).fontFamily;
    let raf = 0;
    let last = performance.now();
    let shownCount = engine.count;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (grownRef.current) engine.update(dt);
      if (engine.count !== shownCount) {
        shownCount = engine.count;
        setUi((ui) => ({ ...ui, count: engine.count }));
      }
      drawGame(ctx, engine, art, color, font, now / 1000);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [engine]);

  const pointer = (event: React.PointerEvent<HTMLCanvasElement>) =>
    toPitch(event.currentTarget, event.clientX, event.clientY);

  return (
    <section
      ref={regionRef}
      data-contact-game=""
      data-phase={ui.phase}
      data-grown={grown ? "" : undefined}
      aria-labelledby="contact-game-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
      className={`mx-auto h-[min(calc(100svh-var(--header-offset)-0.5rem),58rem)] w-full max-w-md origin-top transition-[scale,opacity] duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.3,1.15)] scale-y-100 opacity-100 motion-reduce:transition-none starting:scale-y-0 starting:opacity-0`}
    >
      <div className="flex h-full w-full flex-col items-center gap-3 pixel-frame-board p-3">
        <div className="flex w-full items-center justify-between gap-3">
          <h2 id="contact-game-title" className="sr-only">
            Contact game: score {contactGame.goalsToWin} goals to unlock the contact details
          </h2>
          <div
            data-scoreboard=""
            className="flex items-center gap-3 pixel-button bg-paper-200 px-3 py-1 font-heading text-2xl leading-none tracking-wide uppercase text-ink"
          >
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-3 bg-grass-500 shadow-[0_0_0_2px_var(--color-ink)]" />
              You
            </span>
            <span aria-live="polite" data-score="">
              {ui.score.visitor} – {ui.score.machine}
            </span>
            <span className="flex items-center gap-1.5">
              Machine
              <span aria-hidden="true" className="size-3 bg-red-600 shadow-[0_0_0_2px_var(--color-ink)]" />
            </span>
          </div>
          <span data-goal-target="" className="hidden font-heading text-xl tracking-wide text-paper-100 uppercase sm:block">
            First to {contactGame.goalsToWin} wins
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close the game"
            className={`grid size-10 shrink-0 place-items-center pixel-button bg-red-400 hover:bg-red-500 ${focusRing}`}
          >
            <PixelArt art={CLOSE_ICON} />
          </button>
        </div>

        <div ref={boxRef} className="relative grid min-h-0 w-full flex-1 place-items-center">
          <canvas
            ref={canvasRef}
            width={CANVAS.w}
            height={CANVAS.h}
            role="img"
            aria-label="A vertical soccer pitch: your green team at the bottom, the machine's red team at the top."
            className="block cursor-crosshair touch-none shadow-[0_0_0_4px_var(--color-wood-900)] [image-rendering:pixelated]"
            style={{ aspectRatio: `${ART.w} / ${ART.h}` }}
            onPointerDown={(event) => {
              const { x, y } = pointer(event);
              if (engine.pointerDown(x, y)) event.currentTarget.setPointerCapture?.(event.pointerId);
            }}
            onPointerMove={(event) => {
              const { x, y } = pointer(event);
              engine.pointerMove(x, y);
            }}
            onPointerUp={() => engine.pointerUp()}
            onPointerCancel={() => engine.pointerUp()}
          />

          {ui.phase === "countdown" && (
            <div
              aria-live="assertive"
              data-countdown=""
              className="pointer-events-none absolute inset-0 grid place-items-center font-heading text-[9rem] leading-none text-paper-100 [text-shadow:4px_4px_0_var(--color-ink),-4px_-4px_0_var(--color-ink),4px_-4px_0_var(--color-ink),-4px_4px_0_var(--color-ink)]"
            >
              {ui.count}
            </div>
          )}

          {ui.phase === "goal" && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <p data-goal-sign="" role="status" className={`pixel-button bg-gold-500 px-6 py-3 text-6xl ${signText}`}>
                Goal!
              </p>
            </div>
          )}

          {ui.phase === "won" && (
            <div className="absolute inset-0 grid place-items-center p-4">
              <div data-winner-sign="" role="status" className="flex flex-col items-center gap-3 pixel-frame-paper px-8 pt-6 pb-7 text-center">
                <p className={`text-7xl ${signText}`}>Winner!</p>
                <p className="font-body text-lg text-ink">You unlocked the contact details.</p>
              </div>
            </div>
          )}

          {ui.phase === "lost" && (
            <div className="absolute inset-0 grid place-items-center p-4">
              <div data-lost-sign="" role="status" className="flex flex-col items-center gap-4 pixel-frame-paper px-8 pt-6 pb-7 text-center">
                <p className={`text-5xl ${signText}`}>The machine wins</p>
                <button
                  type="button"
                  onClick={() => engine.restart()}
                  className={`pixel-button bg-gold-500 px-5 py-1 text-3xl hover:bg-gold-400 ${signText} ${focusRing}`}
                >
                  Try again
                </button>
              </div>
            </div>
          )}
        </div>

        <p data-hint="" aria-live="polite" className="min-h-6 text-center font-body text-base text-paper-100">
          {HINTS[ui.phase] ?? ""}
        </p>
      </div>
    </section>
  );
}
