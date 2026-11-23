/**
 * Strength of the vignette, exported so the contrast test checks the real
 * value: ink opacity of the darkest (outermost) band. At this value every text
 * pair in manifest §6 stays ≥ 4.5:1, even under the darkest band.
 */
export const VIGNETTE = 0.12;

/** The bands of the vignette: [where the band starts (% of the radius), ink opacity]. */
export const BANDS: readonly (readonly [number, number])[] = [
  [64, VIGNETTE / 3],
  [76, (VIGNETTE * 2) / 3],
  [88, VIGNETTE],
];

const stops = BANDS.map(
  ([at, alpha], i) =>
    `color-mix(in oklab, var(--color-ink) ${Math.round(alpha * 1000) / 10}%, transparent) ${at}% ${BANDS[i + 1]?.[0] ?? 100}%`,
).join(", ");

/**
 * The scene light (spec 001 US-5, pixel-art redesign): a fixed, full-screen
 * vignette over the whole page, in hard-edged bands like the light falloff of
 * a pixel-art game scene, instead of film grain.
 *
 * - Purely visual: `pointer-events: none`, hidden from assistive tech.
 * - Static CSS gradient: no JavaScript, no animation, so scrolling stays smooth.
 * - Not rendered (`display: none`) when the visitor prefers reduced motion.
 */
export default function FilmOverlay() {
  return (
    <div
      aria-hidden="true"
      data-testid="film-overlay"
      className="pointer-events-none fixed inset-0 z-50 select-none motion-reduce:hidden"
    >
      <div
        data-film="vignette"
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(ellipse at center, transparent 0 ${BANDS[0][0]}%, ${stops})`,
        }}
      />
    </div>
  );
}
