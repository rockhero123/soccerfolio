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
        className="fill-silver-light stroke-ink stroke-outline"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The hero profile card (spec 002 US-2): an enchanted mirror with an ornate polished
 * silver frame, magic sparkles, painted shine on the glass and
 * tall grass growing along its bottom edge.
 *
 * Under the portrait it shows the nickname as the page's only `<h1>`: "Richi" on
 * screen, "Ricardo Martinez (Richi)" for screen readers and search engines, so
 * the visible text stays part of the name (WCAG 2.5.3) — and the role below it.
 * The glass is `mint` with `ink` text, an allowed pair in manifest §6.
 */
export default function EnchantedMirror({ portrait }: { portrait: ReactNode }) {
  return (
    <div data-mirror="frame" className="relative mx-auto w-full max-w-[19rem]">
      <Sparkle className="-top-1 -left-4" />
      <Sparkle className="top-1/3 -right-5 size-4" />
      <Sparkle className="bottom-14 -left-5 size-3" />

      <div className="rounded-[2.25rem] border-outline-lg border-ink bg-silver bg-linear-135 from-silver-light via-silver to-silver-shade p-3 shadow-[5px_5px_0_var(--color-ink)]">
        {/* Silver rim: an inner ink line around the glass. */}
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
            {/* The role is engraved on a small, shiny metal nameplate. Only the two
                lighter silvers sit behind the text, so ink stays ≥ 7.9:1. */}
            <p
              data-mirror="role"
              className="relative mt-3 rounded-[0.6rem] border-outline border-ink bg-silver-light bg-linear-to-b from-silver-light to-silver px-6 py-1 font-body text-lg whitespace-nowrap max-[359px]:px-5 max-[359px]:text-base md:px-7 font-normal text-ink shadow-[3px_3px_0_var(--color-ink)] [text-shadow:0_1px_0_var(--color-chalk)] md:text-xl"
            >
              <span
                aria-hidden="true"
                data-mirror="rivet"
                className="absolute top-1/2 left-2 size-2 -translate-y-1/2 rounded-full border border-ink bg-silver-shade"
              />
              {hero.role}
              <span
                aria-hidden="true"
                data-mirror="rivet"
                className="absolute top-1/2 right-2 size-2 -translate-y-1/2 rounded-full border border-ink bg-silver-shade"
              />
              {/* Polished metal: a bright highlight along the top edge, clear of the text. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-[3px] h-[2px] rounded-full bg-chalk/80"
              />
            </p>
          </div>
        </div>
      </div>

      {/* Tall grass growing in front of the bottom of the frame. */}
      <GrassStrip className="absolute inset-x-1 bottom-0 h-8 fill-pitch-dark" />
    </div>
  );
}
