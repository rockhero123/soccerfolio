import { useId } from "react";
import { seededRandom } from "./forest-background/shapes";

/** One repeating tile of grass, in SVG user units. */
const TILE = { width: 260, height: 40, base: 7 } as const;

/** Rounds to one decimal to keep the markup small. */
const r = (value: number) => Math.round(value * 10) / 10;

/**
 * One fat, rubber-hose grass blade: a wide base, curvy sides and a tip that
 * leans and curls over, standing on y = `TILE.height`.
 */
function blade(x: number, w: number, h: number, lean: number): string {
  const { height } = TILE;
  const tip = x + w / 2 + lean;
  const curl = lean * 0.35;
  return `M${r(x)} ${height}C${r(x + w * 0.05)} ${r(height - h * 0.55)} ${r(tip - curl - w * 0.3)} ${r(height - h * 0.85)} ${r(tip)} ${r(height - h)}C${r(tip - curl * 0.3)} ${r(height - h * 0.7)} ${r(x + w * 0.95)} ${r(height - h * 0.45)} ${r(x + w)} ${height}Z`;
}

/**
 * Seeded rows of cartoon grass, like the grass silhouette in
 * `design/design_2.ai.pdf` redrawn in the Cuphead style: a back row of shorter,
 * shaded blades and a front row of tall, curling ones. Blades stay inside the
 * tile so the pattern repeats without seams.
 */
function grassRows() {
  const { width, height } = TILE;
  const rand = seededRandom(9);
  const row = (minH: number, maxH: number, step: number) => {
    const blades: string[] = [];
    for (let x = 2 + rand() * 4; x < width - 8; x += step + rand() * step) {
      // The last blade is trimmed to end inside the tile, so there is no gap at the seam.
      const w = Math.min(9 + rand() * 7, width - 2 - x);
      const h = minH + rand() * (maxH - minH);
      const lean = (rand() - 0.5) * 14;
      const clamped = Math.min(
        Math.max(lean, 4 - x - w / 2),
        width - 4 - x - w / 2,
      );
      blades.push(blade(x, w, h, clamped));
    }
    return blades.join("");
  };
  return {
    back: row(height * 0.35, height * 0.6, 7),
    front: row(height * 0.5, height - 3, 10),
  };
}

const ROWS = grassRows();

type GrassStripProps = {
  /** Size and colour of the strip, e.g. `h-6 fill-pitch-dark`. */
  className?: string;
};

/**
 * A decorative strip of cartoon grass for section title banners and the edge of
 * the contact zone: fat, curling blades with bold ink outlines and painted
 * highlights. It repeats horizontally at a fixed blade width, so it fits any
 * width, and stretches to the height set by `className`; outlines keep their
 * width when it stretches.
 */
export default function GrassStrip({
  className = "h-6 fill-pitch-dark",
}: GrassStripProps) {
  const patternId = `grass-strip-${useId().replace(/[^\w-]/g, "")}`;
  const { width, height, base } = TILE;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-grass-strip=""
      className={`block w-full ${className}`}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height="100%"
          patternUnits="userSpaceOnUse"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <g strokeLinejoin="round">
            {/* Back row: shaded blades behind. */}
            <path
              data-grass-row="back"
              d={ROWS.back}
              className="stroke-ink stroke-outline"
              vectorEffect="non-scaling-stroke"
            />
            <path d={ROWS.back} className="fill-ink" fillOpacity={0.25} />
            {/* Front row: tall, curling blades. */}
            <path
              data-grass-row="front"
              d={ROWS.front}
              className="stroke-ink stroke-outline"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d={ROWS.front}
              className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*0.5)]"
              strokeOpacity={0.3}
              transform="translate(-2 3)"
              vectorEffect="non-scaling-stroke"
            />
            {/* Solid ground under the blades hides their bottom outlines. */}
            <rect y={height - base} width={width} height={base} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
