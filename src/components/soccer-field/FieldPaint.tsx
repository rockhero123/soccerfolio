import { useId } from "react";

/** Size of the repeating paint tile, in CSS px. */
const TILE = 360;

/**
 * Opacities of the paint, exported so the contrast test checks the real values:
 * - `SHADE_TINT`: an even forest-deep tint that mutes the bright grass towards the
 *   forest palette (the only paint that darkens the bright grass)
 * - `BLOTCH`: peak opacity of the watercolour blotches for each tone
 */
export const SHADE_TINT = 0.12;
export const BLOTCH = { lighten: 0.26, darken: 0.3 } as const;

type FieldPaintProps = {
  /**
   * `lighten` paints soft parchment blotches (bright grass with ink text);
   * `darken` paints soft ink blotches (dark grass with chalk text).
   * The blotches only ever raise the text contrast of their zone; the bright grass
   * also gets an even `SHADE_TINT` so it sits in the muted forest palette.
   */
  tone: "lighten" | "darken";
};

/**
 * A static watercolour wash over the grass, like the painted backgrounds of the
 * forest: soft noise blotches computed once on one seamless tile (`stitchTiles`)
 * and repeated as a pattern, so it stays cheap at any field size.
 */
export default function FieldPaint({ tone }: FieldPaintProps) {
  const id = useId().replace(/[^\w-]/g, "");
  const filterId = `field-paint-filter-${id}`;
  const patternId = `field-paint-${id}`;
  const lighten = tone === "lighten";
  return (
    <svg
      data-field-paint={tone}
      className="absolute inset-0 size-full"
      focusable="false"
    >
      <defs>
        <filter
          id={filterId}
          filterUnits="userSpaceOnUse"
          primitiveUnits="userSpaceOnUse"
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
            baseFrequency="0.011 0.018"
            numOctaves={4}
            seed={lighten ? 5 : 17}
            stitchTiles="stitch"
            result="wash"
          />
          <feColorMatrix
            in="wash"
            type="matrix"
            values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${lighten ? "0 2.2 0 0 -0.95" : "2.2 0 0 0 -0.95"}`}
            result="mask"
          />
          <feFlood
            className={
              lighten
                ? "[flood-color:var(--color-parchment)]"
                : "[flood-color:var(--color-ink)]"
            }
            floodOpacity={BLOTCH[tone]}
          />
          <feComposite in2="mask" operator="in" />
        </filter>
        <pattern
          id={patternId}
          width={TILE}
          height={TILE}
          patternUnits="userSpaceOnUse"
        >
          <rect width={TILE} height={TILE} filter={`url(#${filterId})`} />
        </pattern>
      </defs>
      {lighten && (
        <rect
          width="100%"
          height="100%"
          className="fill-forest-deep"
          fillOpacity={SHADE_TINT}
        />
      )}
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
