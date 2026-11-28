"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import ContactGame from "./ContactGame";
import { track } from "@/lib/analytics";
import { contactUnlocked } from "./unlock";
import { createAudio } from "./whistle";

/** The unlocked flag only changes through this component. */
const subscribeNever = () => () => {};

/** How long the gold ingot takes to split in two before the pitch grows. */
export const SPLIT_MS = 650;

type State = "locked" | "splitting" | "playing" | "unlocked";

type ContactGateProps = {
  /** The gold ingot artwork (server-rendered `GoldIngot`). */
  ingot: ReactNode;
  /** The contact signs, revealed once the game is won or skipped. */
  children: ReactNode;
};

/** One half of the ingot (and its label), cut down the middle. */
function Half({ side, ingot, split }: { side: "left" | "right"; ingot: ReactNode; split: boolean }) {
  const left = side === "left";
  return (
    <span
      aria-hidden={left ? undefined : true}
      data-ingot-half={side}
      className={`${left ? "relative block" : "absolute inset-0"} transition-[translate,rotate,opacity] duration-[650ms] ease-[cubic-bezier(0.5,-0.4,0.6,1)] motion-reduce:transition-none ${
        // The halves overlap by a pixel, so no seam shows between them.
        left ? "[clip-path:inset(0_calc(50%-1px)_0_0)]" : "[clip-path:inset(0_0_0_calc(50%-1px))]"
      } ${split ? (left ? "-translate-x-[45%] -rotate-12 opacity-0" : "translate-x-[45%] rotate-12 opacity-0") : ""}`}
    >
      {ingot}
      <span className="absolute inset-x-0 top-[calc(6*var(--px))] grid h-[calc(16*var(--px))] place-items-center font-heading text-[calc(12*var(--px))] leading-none tracking-widest text-ink uppercase">
        Contact
      </span>
    </span>
  );
}

/**
 * The contact easter egg (spec 900 US-3): the contact signs are hidden behind
 * a CONTACT button shaped like a gold ingot with leaves. Clicking it splits
 * the ingot in two, then the game's pitch grows out of the grass right here
 * in the page; winning it reveals the signs. Nothing is
 * remembered: every reload shows the CONTACT button again. The signs are
 * always in the HTML, only hidden.
 */
export default function ContactGate({ ingot, children }: ContactGateProps) {
  const stored = useSyncExternalStore(subscribeNever, contactUnlocked, () => false);
  const [state, setState] = useState<State>("locked");
  const unlocked = stored || state === "unlocked";
  const buttonRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [audio, setAudio] = useState<AudioContext | null>(null);

  // After the split, the game takes the ingot's place.
  useEffect(() => {
    if (state !== "splitting") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(() => setState("playing"), reduce ? 0 : SPLIT_MS);
    return () => clearTimeout(timer);
  }, [state]);

  const reveal = () => {
    setState("unlocked");
    // Move focus to the first contact sign once it is shown.
    requestAnimationFrame(() => contentRef.current?.querySelector<HTMLElement>("a")?.focus());
  };

  const close = () => {
    setState("locked");
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const showButton = !unlocked && (state === "locked" || state === "splitting");

  return (
    <div data-contact-gate={unlocked ? "unlocked" : state === "locked" ? "locked" : state}>
      {showButton && (
        // Drawn at 4 px per art pixel on every screen, so the ingot is the size
        // of a section title banner (it takes the banner's place).
        <div data-contact-gate-button="" className="flex justify-center pb-[calc(8*var(--px))] [--px:4px]">
          <button
            ref={buttonRef}
            type="button"
            aria-controls="contact-game"
            aria-expanded={state !== "locked"}
            disabled={state === "splitting"}
            onClick={() => {
              track("contact_click");
              setAudio(audio ?? createAudio());
              setState("splitting");
            }}
            className="group relative block hover:-translate-y-[var(--px)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600 disabled:hover:translate-y-0 motion-reduce:hover:translate-y-0"
          >
            <Half side="left" ingot={ingot} split={state === "splitting"} />
            <Half side="right" ingot={ingot} split={state === "splitting"} />
          </button>
        </div>
      )}
      <div ref={contentRef} data-contact-gate-content="" className={unlocked ? undefined : "hidden"}>
        {children}
      </div>
      {state === "playing" && (
        <div id="contact-game" className="pb-[calc(8*var(--px))]">
          <ContactGame audio={audio} onWin={reveal} onClose={close} />
        </div>
      )}
    </div>
  );
}
