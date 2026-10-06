import { useId } from "react";
import { seededRandom } from "./forest-background/shapes";

/** One repeating tile of grass, in SVG user units. */
const TILE = { width: 240, height: 32 } as const;

/** Rounds to one decimal to keep the markup small. */
const r = (value: number) => Math.round(value * 10) / 10;

/**
 * A seeded row of pointed, slightly leaning grass blades on a solid base,
 * like the grass silhouette in `design/design_2.ai.pdf`. Blades stay inside
 * the tile so the pattern repeats without seams.
 */
function bladesPath(): string {
  const { width, height } = TILE;
  const rand = seededRandom(9);
  const blades: string[] = [`M0 ${height}V${height - 6}H${width}V${height}Z`];
  for (let x = 2; x < width - 12; x += 4 + rand() * 5) {
    const w = 5 + rand() * 5;
    const h = 10 + rand() * (height - 12);
    const lean = (rand() - 0.5) * 8;
    const tip = Math.min(Math.max(x + w / 2 + lean, 1), width - 1);
    blades.push(
      `M${r(x)} ${height}Q${r(x + w * 0.2)} ${r(height - h * 0.6)} ${r(tip)} ${r(height - h)}Q${r(x + w * 0.8)} ${r(height - h * 0.5)} ${r(x + w)} ${height}Z`,
    );
  }
  return blades.join("");
}

const BLADES = bladesPath();

type GrassStripProps = {
  /** Size and colour of the strip, e.g. `h-6 fill-pitch-dark`. */
  className?: string;
};

/**
 * A decorative strip of grass for section title banners and the edge of the
 * contact zone. It repeats horizontally at a fixed blade size, so it fits any width,
 * and stretches to the height set by `className`.
 */
export default function GrassStrip({
  className = "h-6 fill-pitch-dark",
}: GrassStripProps) {
  const patternId = `grass-strip-${useId().replace(/[^\w-]/g, "")}`;
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
          width={TILE.width}
          height="100%"
          patternUnits="userSpaceOnUse"
          viewBox={`0 0 ${TILE.width} ${TILE.height}`}
          preserveAspectRatio="none"
        >
          <path d={BLADES} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
