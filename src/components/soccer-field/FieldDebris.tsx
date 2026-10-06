import { useId } from "react";
import { between, seededRandom } from "../forest-background/shapes";
import DebrisPiece from "./debris/DebrisPiece";
import type { LeafTone } from "./debris/FallenLeaf";
import type { Piece } from "./debris/pieces";

/**
 * One repeating tile of edge debris, in CSS px. Piece origins stay in
 * `x ∈ [10, 58]` and no piece reaches further than 48px from its origin, so
 * nothing touches the inner edge of the 120px strip (no straight cuts).
 * Vertically, pieces crossing the tile edge continue in the next tile.
 */
const TILE = { width: 120, height: 640 } as const;
const KINDS = [
  "leaf",
  "twig",
  "leaf",
  "feather",
  "leaf",
  "stem",
  "leaf",
  "twig",
  "leaf",
  "leaf",
  "stem",
  "leaf",
  "feather",
] as const;
const LEAF_TONES: LeafTone[] = ["moss", "autumn", "green", "dry", "red"];

/** A seeded, evenly spread scatter of leaves, twigs, stems and feathers. */
function scatter(seed: number): Piece[] {
  const rand = seededRandom(seed);
  const step = TILE.height / KINDS.length;
  return KINDS.map((kind, i): Piece => {
    const at = {
      x: between(rand, 10, 58),
      y: between(rand, i * step + step * 0.15, i * step + step * 0.85),
      angle: between(rand, 0, 360),
    };
    switch (kind) {
      case "leaf":
        return {
          kind,
          ...at,
          length: between(rand, 30, 48),
          width: between(rand, 17, 26),
          tone: LEAF_TONES[(seed + i) % LEAF_TONES.length],
        };
      case "feather":
        return {
          kind,
          ...at,
          length: between(rand, 36, 48),
          width: between(rand, 12, 16),
          tip: (seed + i) % 2 ? "red" : "yellow",
        };
      default:
        return { kind, ...at, length: between(rand, 34, 48) };
    }
  });
}

/** Below 768px the debris is drawn at this scale, so it stays near the edges of the narrow field. */
const MOBILE_SCALE = 0.65;

type FieldDebrisProps = {
  /** Which edge of the field; the right side is mirrored and uses its own scatter. */
  side: "left" | "right";
};

/**
 * Fallen forest debris along one edge of the field: leaves, stems, twigs and
 * feathers that drifted in from the trees, in the vintage token palette.
 * A repeating pattern tile, so it covers any field height with fixed markup.
 * The tile is defined once; the mobile strip reuses it through a scaled pattern.
 */
export default function FieldDebris({ side }: FieldDebrisProps) {
  const id = useId().replace(/[^\w-]/g, "");
  const patternId = `field-debris-${id}`;
  const mobilePatternId = `${patternId}-mobile`;
  const groupId = `${patternId}-pieces`;
  const pieces = scatter(side === "left" ? 4 : 11);
  return (
    <div
      data-field-debris={side}
      className={`absolute inset-y-0 w-[4.875rem] md:w-[7.5rem] ${side === "left" ? "left-0" : "right-0 -scale-x-100"}`}
    >
      <svg width="0" height="0" className="absolute" focusable="false">
        <defs>
          <pattern
            id={patternId}
            width={TILE.width}
            height={TILE.height}
            patternUnits="userSpaceOnUse"
          >
            <g id={groupId}>
              {pieces.map((piece, i) => (
                <DebrisPiece key={i} piece={piece} />
              ))}
            </g>
            <use href={`#${groupId}`} y={-TILE.height} />
            <use href={`#${groupId}`} y={TILE.height} />
          </pattern>
          <pattern
            id={mobilePatternId}
            href={`#${patternId}`}
            patternTransform={`scale(${MOBILE_SCALE})`}
          />
        </defs>
      </svg>
      <svg className="hidden size-full md:block" focusable="false">
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <svg className="size-full md:hidden" focusable="false">
        <rect width="100%" height="100%" fill={`url(#${mobilePatternId})`} />
      </svg>
    </div>
  );
}
