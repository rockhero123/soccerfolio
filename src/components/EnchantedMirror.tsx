import type { ReactNode } from "react";
import { hero } from "@/content/hero";
import GrassStrip from "./GrassStrip";

/** A four-point magic sparkle, drawn around the mirror. */
function Sparkle({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
      data-mirror="sparkle"
      className={`absolute size-5 overflow-visible ${className}`}
    >
      <path
        d="M10 0Q11 9 20 10Q11 11 10 20Q9 11 0 10Q9 9 10 0Z"
        className="fill-cartoon-yellow stroke-ink stroke-outline"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The scrolled crest on top of the frame, with a red gem in the middle. */
function Crest() {
  return (
    <svg
      viewBox="0 0 120 44"
      aria-hidden="true"
      focusable="false"
      data-mirror="crest"
      className="absolute -top-7 left-1/2 h-11 w-30 -translate-x-1/2 overflow-visible"
    >
      <g
        className="stroke-ink stroke-outline"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path
          d="M4 40C10 26 24 22 36 28C42 14 52 6 60 6C68 6 78 14 84 28C96 22 110 26 116 40Z"
          className="fill-cartoon-yellow"
        />
        <path d="M18 36Q22 28 30 31M102 36Q98 28 90 31" className="fill-none" />
        <path d="M60 10L70 24L60 38L50 24Z" className="fill-cartoon-red" />
        <path
          d="M57 18L60 14L63 18"
          className="fill-none stroke-parchment"
          strokeOpacity={0.8}
        />
      </g>
    </svg>
  );
}

/**
 * The hero profile card (spec 002 US-2): an enchanted mirror with an ornate gold
 * frame, a crest and gem on top, magic sparkles, painted shine on the glass and
 * tall grass growing along its bottom edge.
 *
 * Under the portrait it shows the nickname as the page's only `<h1>`: "Richi" on
 * screen, "Ricardo Martinez (Richi)" for screen readers and search engines, so
 * the visible text stays part of the name (WCAG 2.5.3) — and the role below it.
 * The glass is `mint` with `ink` text, an allowed pair in manifest §6.
 */
export default function EnchantedMirror({ portrait }: { portrait: ReactNode }) {
  return (
    <div
      data-mirror="frame"
      className="relative mx-auto w-full max-w-[19rem] pt-5"
    >
      <Crest />
      <Sparkle className="-top-1 -left-4" />
      <Sparkle className="top-1/3 -right-5 size-4" />
      <Sparkle className="bottom-14 -left-5 size-3" />

      <div className="rounded-[2.25rem] border-outline-lg border-ink bg-cartoon-yellow p-3 shadow-[5px_5px_0_var(--color-ink)]">
        {/* Gold rim: an inner ink line and rivets around the glass. */}
        <div className="relative rounded-[1.75rem] border-outline border-ink bg-mint">
          <div
            aria-hidden="true"
            data-mirror="shine"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="size-full"
              focusable="false"
            >
              <path
                d="M8 34L34 6H46L8 46Z"
                className="fill-chalk"
                fillOpacity={0.6}
              />
              <path
                d="M8 56L56 6H62L8 62Z"
                className="fill-chalk"
                fillOpacity={0.45}
              />
            </svg>
          </div>

          <div className="relative flex flex-col items-center px-6 pt-8 pb-12 text-center text-ink">
            {portrait}
            <h1
              data-mirror="name"
              className="mt-3 font-heading text-4xl leading-none tracking-wide md:text-5xl"
            >
              <span className="sr-only">{`${hero.name} (${hero.nickname})`}</span>
              <span aria-hidden="true">{hero.nickname}</span>
            </h1>
            <p
              data-mirror="role"
              className="mt-2 font-body text-lg font-normal md:text-xl"
            >
              {hero.role}
            </p>
          </div>
        </div>
      </div>

      {/* Tall grass growing in front of the bottom of the frame. */}
      <GrassStrip className="absolute inset-x-1 bottom-0 h-8 fill-pitch-dark" />
    </div>
  );
}
