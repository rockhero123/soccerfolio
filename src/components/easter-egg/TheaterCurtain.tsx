"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import PixelArt from "../pixel/PixelArt";
import { BALL } from "./theaterArt";

const ink = (alpha: number) =>
  `color-mix(in oklab, var(--color-ink) ${alpha}%, transparent)`;
const glow = (alpha: number) =>
  `color-mix(in oklab, var(--color-gold-400) ${alpha}%, transparent)`;

/**
 * The stage light (owner decision): a soft, blurred circle of shadow that
 * darkens the corners of the theater, and a warm pool of light on the lower
 * curtain and the wooden floor. Smooth gradients, unlike the pixel art.
 */
export const STAGE_LIGHT = {
  shadow: `radial-gradient(ellipse 72% 68% at 50% 56%, transparent 0%, transparent 30%, ${ink(40)} 56%, ${ink(72)} 80%, ${ink(88)} 100%)`,
  light: `radial-gradient(ellipse 55% 42% at 50% 66%, ${glow(30)} 0%, ${glow(16)} 45%, transparent 100%)`,
};

/** How long the curtain takes to rise, in ms. */
export const LIFT_MS = 1800;

type TheaterCurtainProps = {
  /** The curtain artwork (server-rendered `TheaterDrapes`). */
  drapes: ReactNode;
  /** The stage and seats artwork (server-rendered `TheaterStalls`). */
  stalls: ReactNode;
  /** "Start" was pressed: start the music (a real click unlocks sound). */
  onBegin: () => void;
  /** Escape was pressed: enter without music. */
  onSkip: () => void;
  /** The curtain is up; remove the theater. */
  onDone: () => void;
};

/**
 * The theater before the match (spec 900 US-2 AC6): on every page load a
 * pixel-art theater with its curtain closed covers the page while the music
 * video loads behind it. A poster asks "Ready to start the match?"; "Start"
 * starts the music and the curtain rises smoothly, from the bottom hem up,
 * revealing the portfolio; the stage and seats sink away.
 * Escape enters without music. It is server-rendered open, so the theater is
 * there from the first paint, then becomes a true modal dialog on the client.
 * With reduced motion the curtain is simply removed.
 */
export default function TheaterCurtain({
  drapes,
  stalls,
  onBegin,
  onSkip,
  onDone,
}: TheaterCurtainProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const beginRef = useRef<HTMLButtonElement>(null);
  const [lifting, setLifting] = useState(false);

  useEffect(() => {
    // Skipped (tests): hidden by CSS and about to be removed. Do not open it,
    // take focus or lock scrolling during that brief mount.
    if (document.documentElement.hasAttribute("data-skip-theater")) return;
    const dialog = dialogRef.current;
    if (dialog?.showModal) {
      dialog.close();
      dialog.showModal();
    }
    beginRef.current?.focus();
    // The page waits behind the curtain: no scrolling until it rises.
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (!lifting) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => {
      dialogRef.current?.close?.();
      onDone();
    }, reduce ? 0 : LIFT_MS);
    return () => clearTimeout(timer);
  }, [lifting, onDone]);

  const rise = (choose: () => void) => {
    if (lifting) return;
    choose();
    setLifting(true);
  };

  const motion = "motion-reduce:transition-none";

  return (
    <dialog
      ref={dialogRef}
      open
      data-theater=""
      data-lifting={lifting ? "" : undefined}
      aria-labelledby="theater-title"
      onCancel={(event) => {
        event.preventDefault();
        rise(onSkip);
      }}
      className="pointer-events-auto fixed inset-0 z-[70] m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
    >
      {/* The dark hall around the stage. */}
      <div
        className={`absolute inset-0 bg-ink transition-opacity duration-[1400ms] ease-in ${motion} ${lifting ? "opacity-0" : ""}`}
      />
      <div className="relative flex h-full flex-col">
        <div
          data-theater-drapes=""
          className={`relative z-10 min-h-0 flex-1 transition-[translate] duration-[1800ms] ease-[cubic-bezier(0.7,0,0.3,1)] ${motion} ${lifting ? "-translate-y-[calc(100%+12*var(--px))]" : ""}`}
        >
          {drapes}
          <div
            className={`absolute inset-x-0 top-[calc(30*var(--px))] bottom-0 flex flex-col items-center justify-center gap-[calc(6*var(--px))] p-4 transition-opacity duration-300 ${motion} ${lifting ? "opacity-0" : ""}`}
          >
            {/* The poster, hanging from two gold cords. */}
            <div
              data-theater-poster=""
              className="relative w-full max-w-md pixel-frame-paper px-8 pt-7 pb-8 text-center"
            >
              <span
                aria-hidden="true"
                className="absolute bottom-full left-[18%] h-[calc(8*var(--px))] w-[var(--px)] bg-gold-700"
              />
              <span
                aria-hidden="true"
                className="absolute right-[18%] bottom-full h-[calc(8*var(--px))] w-[var(--px)] bg-gold-700"
              />
              <h2
                id="theater-title"
                className="font-heading text-4xl leading-none tracking-wide text-ink uppercase md:text-5xl"
              >
                Ready to start the match?
              </h2>
            </div>
            <button
              ref={beginRef}
              type="button"
              disabled={lifting}
              onClick={() => rise(onBegin)}
              className="flex items-center gap-3 pixel-button bg-gold-500 px-7 py-2 font-heading text-4xl leading-none tracking-wide uppercase text-ink hover:-translate-y-[var(--px)] hover:bg-gold-400 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:hover:translate-y-0"
            >
              <PixelArt art={BALL} />
              Start
            </button>
          </div>
        </div>
        <div
          data-theater-stalls=""
          className={`relative shrink-0 transition-[translate,opacity] duration-[1200ms] ease-in ${motion} ${lifting ? "translate-y-full opacity-0" : ""}`}
        >
          {stalls}
        </div>
      </div>
      {/* The stage light over the whole theater; it fades as the curtain rises. */}
      <div
        aria-hidden="true"
        data-theater-light=""
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-700 ease-out ${motion} ${lifting ? "opacity-0" : ""}`}
      >
        <div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: STAGE_LIGHT.light }} />
        <div className="absolute inset-0" style={{ backgroundImage: STAGE_LIGHT.shadow }} />
      </div>
    </dialog>
  );
}
