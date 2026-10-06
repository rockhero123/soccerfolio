import { useId } from "react";
import { between, seededRandom } from "../forest-background/shapes";
import DebrisPiece from "./debris/DebrisPiece";
import { ZONE_PALETTE, type Zone } from "./debris/palette";
import type { Piece } from "./debris/pieces";

type Kind = Piece["kind"];

/** How many of each piece one tile holds. */
type Counts = Partial<Record<Kind, number>>;

/**
 * Two overlapping pattern layers with unrelated tile sizes, both wider than a
 * desktop field: nothing repeats across the field, and together they only repeat
 * every few thousand pixels, so the scatter looks random, not tiled.
 */
const LAYERS: {
  width: number;
  height: number;
  seed: number;
  /**
   * How deep the layer sits in the grass: a softer blur and lower opacity for
   * pieces settled into the lawn. Opacity blends a piece with the grass beneath,
   * and both keep the zone's text readable, so the blend does too.
   */
  depth: { blur: number; opacity: number };
  counts: Record<Zone, Counts>;
}[] = [
  {
    width: 1100,
    height: 760,
    seed: 3,
    depth: { blur: 0.8, opacity: 0.85 },
    counts: {
      play: { leaf: 8, twig: 2, stem: 2, feather: 2, clover: 3, tuft: 9 },
      contact: { leaf: 7, twig: 3, stem: 2, tuft: 9 },
    },
  },
  {
    width: 760,
    height: 1000,
    seed: 29,
    depth: { blur: 1.6, opacity: 0.55 },
    counts: {
      play: { leaf: 5, twig: 2, stem: 1, clover: 2, tuft: 5 },
      contact: { leaf: 4, twig: 2, tuft: 6 },
    },
  },
];

/**
 * Seeded jittered-grid placement: the tile is split into about one cell per piece
 * and each piece lands at a random spot in a random cell, so pieces are spread
 * evenly but never line up. Pieces may cross the tile edges (they wrap).
 */
function scatter(
  zone: Zone,
  layer: (typeof LAYERS)[number],
  seed: number,
): Piece[] {
  const rand = seededRandom(seed);
  const palette = ZONE_PALETTE[zone];
  const kinds = Object.entries(layer.counts[zone]).flatMap(([kind, count]) =>
    Array.from({ length: count }, () => kind as Kind),
  );
  const cols = Math.ceil(
    Math.sqrt(kinds.length * (layer.width / layer.height)),
  );
  const rows = Math.ceil(kinds.length / cols);
  const cells = Array.from({ length: cols * rows }, (_, i) => i)
    .map((i) => ({ i, order: rand() }))
    .sort((a, b) => a.order - b.order)
    .map(({ i }) => i);
  const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

  return kinds.map((kind, n): Piece => {
    const cell = cells[n];
    const w = layer.width / cols;
    const h = layer.height / rows;
    const at = {
      x: between(rand, (cell % cols) * w, ((cell % cols) + 1) * w),
      y: between(
        rand,
        Math.floor(cell / cols) * h,
        (Math.floor(cell / cols) + 1) * h,
      ),
      angle: kind === "tuft" ? between(rand, -15, 15) : between(rand, 0, 360),
    };
    switch (kind) {
      case "leaf":
        return {
          kind,
          ...at,
          length: between(rand, 26, 44),
          width: between(rand, 15, 24),
          fill: pick(palette.leaves),
        };
      case "twig":
        return {
          kind,
          ...at,
          length: between(rand, 34, 50),
          wood: palette.twig,
        };
      case "stem":
        return {
          kind,
          ...at,
          length: between(rand, 32, 46),
          stalk: palette.stalk,
          leaflet: palette.leaflet,
        };
      case "feather":
        return {
          kind,
          ...at,
          length: between(rand, 32, 44),
          width: between(rand, 11, 15),
          ...palette.feather!,
        };
      case "clover":
        return {
          kind,
          ...at,
          size: between(rand, 14, 20),
          fill: palette.clover!,
        };
      case "tuft":
        return { kind, ...at, size: between(rand, 18, 28), fill: palette.tuft };
    }
  });
}

/**
 * Peak opacity of the soft ink shadow under each piece, which seats it on the
 * grass. It is the only part of the debris that darkens the bright grass, so the
 * contrast test includes it in the worst case.
 */
export const SCATTER_SHADOW = 0.08;

/**
 * How much each piece takes on the colour of the grass it lies on. Like opacity,
 * this mixes two colours that both keep the zone's text readable.
 */
export const GRASS_TINT = 0.25;

/** The grass colour each zone's debris is tinted towards. */
const grassFlood: Record<Zone, string> = {
  play: "[flood-color:var(--color-pitch)]",
  contact: "[flood-color:var(--color-pitch-dark)]",
};

/** Every neighbouring tile offset, so pieces crossing an edge continue in the next tile. */
const WRAP = [-1, 0, 1]
  .flatMap((dx) => [-1, 0, 1].map((dy) => [dx, dy] as const))
  .filter(([dx, dy]) => dx !== 0 || dy !== 0);

/** Room around the tile so blur and shadow are not cut where pieces wrap. */
const PAD = 12;

type FieldScatterProps = { zone: Zone };

/**
 * Fallen forest debris scattered at random over a whole field zone, so the
 * lawn never looks freshly swept: leaves, twigs, stems and cartoon grass tufts,
 * plus clover and feathers on the bright grass, in the zone's readable palette.
 *
 * The pieces melt into the pitch: each sits on a soft contact shadow, takes on a
 * little of the grass colour, and the layers are softly blurred and faded by depth. The filter runs inside the
 * pattern tile, so each tile is computed once, not across the whole zone.
 */
export default function FieldScatter({ zone }: FieldScatterProps) {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <svg
      data-field-scatter={zone}
      className="absolute inset-0 size-full"
      focusable="false"
    >
      <defs>
        {LAYERS.map((layer, l) => {
          const patternId = `field-scatter-${id}-${l}`;
          const groupId = `${patternId}-pieces`;
          const seed = layer.seed + (zone === "play" ? 0 : 100);
          return (
            <pattern
              key={patternId}
              id={patternId}
              width={layer.width}
              height={layer.height}
              patternUnits="userSpaceOnUse"
            >
              <filter
                id={`${patternId}-melt`}
                filterUnits="userSpaceOnUse"
                x={-PAD}
                y={-PAD}
                width={layer.width + PAD * 2}
                height={layer.height + PAD * 2}
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur in="SourceAlpha" stdDeviation={3} />
                <feOffset dx={2} dy={4} result="shadow-shape" />
                <feFlood
                  className="[flood-color:var(--color-ink)]"
                  floodOpacity={SCATTER_SHADOW}
                />
                <feComposite in2="shadow-shape" operator="in" result="shadow" />
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation={layer.depth.blur}
                  result="blurred"
                />
                <feFlood
                  className={grassFlood[zone]}
                  floodOpacity={GRASS_TINT}
                />
                <feComposite in2="blurred" operator="atop" result="soft" />
                <feMerge>
                  <feMergeNode in="shadow" />
                  <feMergeNode in="soft" />
                </feMerge>
              </filter>
              <g
                filter={`url(#${patternId}-melt)`}
                opacity={layer.depth.opacity}
              >
                <g id={groupId}>
                  {scatter(zone, layer, seed).map((piece, i) => (
                    <DebrisPiece key={i} piece={piece} />
                  ))}
                </g>
                {WRAP.map(([dx, dy]) => (
                  <use
                    key={`${dx}${dy}`}
                    href={`#${groupId}`}
                    x={dx * layer.width}
                    y={dy * layer.height}
                  />
                ))}
              </g>
            </pattern>
          );
        })}
      </defs>
      {/* The deeper, softer layer goes underneath. */}
      {LAYERS.map((_, l) => (
        <rect
          key={l}
          width="100%"
          height="100%"
          fill={`url(#field-scatter-${id}-${l})`}
        />
      )).reverse()}
    </svg>
  );
}
