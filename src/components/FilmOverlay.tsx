/**
 * Strengths of the film effect, exported so the contrast test checks the real values:
 * - `VIGNETTE`: ink opacity at the very corners of the screen (0 in the centre)
 * - `GRAIN`: peak opacity of the dark (ink) and light (parchment) grain specks
 * At these values every text pair in manifest §6 stays ≥ 4.5:1, even under the
 * darkest point of the overlay.
 */
export const VIGNETTE = 0.12;
export const GRAIN = 0.04;

/** Size of the repeating grain tile, in CSS px. */
const TILE = 240;

/**
 * The vintage film look (spec 001 US-5): a fixed, full-screen layer of fine film
 * grain and a soft vignette over the whole page, like a 1930s cartoon print.
 *
 * - Purely visual: `pointer-events: none`, hidden from assistive tech.
 * - Static: the grain is one SVG noise tile computed once and repeated; the
 *   vignette is a CSS gradient. No JavaScript, no animation, so scrolling stays smooth.
 * - Not rendered (`display: none`) when the visitor prefers reduced motion.
 */
export default function FilmOverlay() {
  return (
    <div
      aria-hidden="true"
      data-testid="film-overlay"
      className="pointer-events-none fixed inset-0 z-50 select-none motion-reduce:hidden"
    >
      <svg
        data-film="grain"
        className="absolute inset-0 size-full"
        focusable="false"
      >
        <defs>
          <filter
            id="film-grain"
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={TILE}
            height={TILE}
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              x="0"
              y="0"
              width={TILE}
              height={TILE}
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={1}
              seed={13}
              stitchTiles="stitch"
              result="noise"
            />
            {/* Dark specks where the red noise channel peaks. */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  6 0 0 0 -3.6"
              result="dark-mask"
            />
            <feFlood
              className="[flood-color:var(--color-ink)]"
              floodOpacity={GRAIN}
            />
            <feComposite in2="dark-mask" operator="in" result="dark" />
            {/* Light specks where the green noise channel peaks. */}
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 6 0 0 -3.6"
              result="light-mask"
            />
            <feFlood
              className="[flood-color:var(--color-parchment)]"
              floodOpacity={GRAIN}
            />
            <feComposite in2="light-mask" operator="in" result="light" />
            <feMerge>
              <feMergeNode in="dark" />
              <feMergeNode in="light" />
            </feMerge>
          </filter>
          <pattern
            id="film-grain-tile"
            width={TILE}
            height={TILE}
            patternUnits="userSpaceOnUse"
          >
            <rect width={TILE} height={TILE} filter="url(#film-grain)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#film-grain-tile)" />
      </svg>
      <div
        data-film="vignette"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,color-mix(in_oklab,var(--color-ink)_12%,transparent)_100%)]"
      />
    </div>
  );
}
