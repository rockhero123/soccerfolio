"use client";

import { useEffect, useRef } from "react";
import WoodPlank, { engraved } from "../WoodPlank";
import PixelArt from "../pixel/PixelArt";
import { fromRows, sprite } from "../pixel/canvas";

type KickOffProps = {
  onKickOff: () => void;
  onSkip: () => void;
};

/** A pixel soccer ball (11 × 11), shaded on its lower right. */
const BALL = sprite(
  fromRows(
    [
      "...kkkkk...",
      ".kkwwkwwkk.",
      ".kwwkkkwwk.",
      "kwwwkkkwwsk",
      "kwwwwkwwwsk",
      "kkwwwwwwskk",
      "kkkwwwwskkk",
      "kwwwwkwsssk",
      ".kwwkkkssk.",
      ".kkwssssk..",
      "...kkkkk...",
    ],
    { k: "ink", w: "paper-100", s: "stone-300" },
  ),
);

/**
 * The "Kick off!" overlay (spec 900 US-2 AC6): shown on the first page load of
 * a browser session. Its click is a real user action, which lets the music
 * start with sound straight away. "Enter without music" (or Escape) enters
 * silently. It is server-rendered open, so first-time visitors see it at once,
 * then becomes a true modal dialog on the client (focus inside, page inert).
 * On later loads of the session a CSS rule hides it before it paints.
 */
export default function KickOff({ onKickOff, onSkip }: KickOffProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const kickRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.close();
    dialog.showModal();
    kickRef.current?.focus();
  }, []);

  const finish = (choose: () => void) => {
    dialogRef.current?.close();
    choose();
  };

  return (
    <dialog
      ref={dialogRef}
      open
      data-kickoff=""
      aria-labelledby="kickoff-title"
      onCancel={(event) => {
        event.preventDefault();
        finish(onSkip);
      }}
      className="pointer-events-auto fixed inset-0 z-[70] m-0 grid h-dvh max-h-none w-screen max-w-none place-items-center bg-ink/75 p-4 backdrop:bg-transparent"
    >
      <div className="relative flex w-full max-w-md flex-col items-center gap-5 px-8 pt-8 pb-10 text-center">
        <WoodPlank />
        <h2
          id="kickoff-title"
          className={`relative font-heading text-4xl leading-none tracking-wide uppercase md:text-5xl ${engraved}`}
        >
          Ready for kick off?
        </h2>
        <p className="relative font-body text-lg text-ink">
          The waterfall has a song for you.
        </p>
        <button
          ref={kickRef}
          type="button"
          onClick={() => finish(onKickOff)}
          className="relative flex items-center gap-3 pixel-button bg-gold-500 px-6 py-2 font-heading text-4xl leading-none tracking-wide uppercase text-ink hover:-translate-y-[var(--px)] hover:bg-gold-400 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:hover:translate-y-0"
        >
          <PixelArt art={BALL} />
          Kick off!
        </button>
        <button
          type="button"
          onClick={() => finish(onSkip)}
          className="relative px-3 py-1 font-body text-base text-ink underline underline-offset-4 hover:text-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          Enter without music
        </button>
      </div>
    </dialog>
  );
}
