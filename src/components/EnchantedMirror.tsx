import type { ReactNode } from "react";
import { hero } from "@/content/hero";
import GrassStrip from "./GrassStrip";
import PixelArt from "./pixel/PixelArt";
import {
  CREST,
  RIVET,
  SHINE,
  SPARKLE,
  SPARKLE_SMALL,
  STUD,
} from "./hero/mirrorArt";

/**
 * The hero profile card (spec 002 US-2): an enchanted mirror in pixel art — a
 * bevelled stone-silver frame with a gold crest and studs, magic sparkles, a
 * stepped shine painted on the glass and pixel grass growing along its bottom
 * edge.
 *
 * Under the portrait it shows the nickname as the page's only `<h1>`: "Richi" on
 * screen, "Ricardo Martinez (Richi)" for screen readers and search engines, so
 * the visible text stays part of the name (WCAG 2.5.3) — and the role below it,
 * on a small metal nameplate. The glass is `mint` with `ink` text, an allowed
 * pair in manifest §6.
 */
export default function EnchantedMirror({ portrait }: { portrait: ReactNode }) {
  return (
    <div data-mirror="frame" className="relative mx-auto w-full max-w-[19rem] pt-[calc(4*var(--px))]">
      <PixelArt art={SPARKLE} className="absolute top-2 -left-6" data={{ "data-mirror": "sparkle" }} />
      <PixelArt art={SPARKLE_SMALL} className="absolute top-1/3 -right-6" data={{ "data-mirror": "sparkle" }} />
      <PixelArt art={SPARKLE_SMALL} className="absolute bottom-16 -left-6" data={{ "data-mirror": "sparkle" }} />

      <div className="relative pixel-frame-stone px-[calc(7*var(--px))] pt-[calc(8*var(--px))] pb-[calc(12*var(--px))]">
        <PixelArt
          art={SHINE}
          className="pointer-events-none absolute top-[calc(6*var(--px))] left-[calc(6*var(--px))] opacity-60"
          data={{ "data-mirror": "shine" }}
        />
        {(["top-left", "top-right", "bottom-left", "bottom-right"] as const).map(
          (corner) => (
            <PixelArt
              key={corner}
              art={STUD}
              className={`absolute ${corner.startsWith("top") ? "top-0" : "bottom-0"} ${corner.endsWith("left") ? "left-0" : "right-0"}`}
            />
          ),
        )}
        <div className="relative flex flex-col items-center text-center text-ink">
          {portrait}
          <h1
            data-mirror="name"
            className="mt-2 font-heading text-6xl leading-none tracking-wide pixel-text-shadow"
          >
            <span className="sr-only">{`${hero.name} (${hero.nickname})`}</span>
            <span aria-hidden="true">{hero.nickname}</span>
          </h1>
          {/* The role on a small metal nameplate: ink on light stone is ≥ 12:1. */}
          <p
            data-mirror="role"
            className="relative mt-3 pixel-button bg-stone-200 px-7 py-0.5 font-body text-lg font-normal whitespace-nowrap text-ink max-[359px]:px-5 max-[359px]:text-base md:text-xl"
          >
            <PixelArt
              art={RIVET}
              className="absolute top-1/2 left-[calc(2*var(--px))] -translate-y-1/2"
              data={{ "data-mirror": "rivet" }}
            />
            {hero.role}
            <PixelArt
              art={RIVET}
              className="absolute top-1/2 right-[calc(2*var(--px))] -translate-y-1/2"
              data={{ "data-mirror": "rivet" }}
            />
          </p>
        </div>
      </div>
      <PixelArt
        art={CREST}
        className="absolute top-0 left-1/2 -translate-x-1/2"
        data={{ "data-mirror": "crest" }}
      />

      {/* Pixel grass growing in front of the bottom of the frame. */}
      <GrassStrip className="absolute inset-x-0 -bottom-[calc(2*var(--px))]" />
    </div>
  );
}
