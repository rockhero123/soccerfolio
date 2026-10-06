import { useId } from "react";
import { between, seededRandom } from "../forest-background/shapes";
import DebrisPiece from "./debris/DebrisPiece";
import type { LeafTone } from "./debris/FallenLeaf";
import type { Piece } from "./debris/pieces";

/**
 * One repeating tile of the lawn scatter, in CSS px. Pieces keep a 40px margin
 * from the tile edges and reach at most 34px, so the pattern repeats without cuts.
 */
const TILE = { width: 460, height: 520 } as const;
const MARGIN = 40;

/**
 * Leaves drifting across the bright grass only use colours that `ink` text stays
 * readable on (manifest §6: moss and cartoon-yellow ≥ 6:1), since content can sit
 * on top of them. The contact zone (chalk text) only gets darker grass tufts.
 */
export const LAWN_LEAF_TONES: LeafTone[] = ["moss", "autumn"];

function scatter(zone: "play" | "contact", seed: number): Piece[] {
  const rand = seededRandom(seed);
  const at = () => ({
    x: between(rand, MARGIN, TILE.width - MARGIN),
    y: between(rand, MARGIN, TILE.height - MARGIN),
    angle: between(rand, -25, 25),
  });
  const tone = zone === "play" ? "light" : "dark";
  const tufts: Piece[] = Array.from({ length: 8 }, () => ({
    kind: "tuft",
    ...at(),
    size: between(rand, 14, 22),
    tone,
  }));
  if (zone === "contact") return tufts;
  const spin = () => between(rand, 0, 360);
  return [
    ...tufts,
    {
      kind: "clover",
      ...at(),
      angle: spin(),
      size: between(rand, 14, 18),
      tone,
    },
    {
      kind: "clover",
      ...at(),
      angle: spin(),
      size: between(rand, 12, 16),
      tone,
    },
    ...LAWN_LEAF_TONES.map((leafTone): Piece => ({
      kind: "leaf",
      ...at(),
      angle: spin(),
      length: between(rand, 24, 32),
      width: between(rand, 14, 19),
      tone: leafTone,
    })),
    {
      kind: "feather",
      ...at(),
      angle: spin(),
      length: between(rand, 26, 32),
      width: between(rand, 10, 12),
      tip: "yellow",
    },
  ];
}

type FieldScatterProps = { zone: "play" | "contact" };

/**
 * A sparse, repeating scatter over a whole field zone, so the lawn never looks
 * freshly swept: darker grass tufts everywhere, plus clover and a few drifting
 * leaves and feathers on the bright grass.
 */
export default function FieldScatter({ zone }: FieldScatterProps) {
  const id = useId().replace(/[^\w-]/g, "");
  const patternId = `field-scatter-${id}`;
  const pieces = scatter(zone, zone === "play" ? 21 : 33);
  return (
    <svg
      data-field-scatter={zone}
      className="absolute inset-0 size-full"
      focusable="false"
    >
      <defs>
        <pattern
          id={patternId}
          width={TILE.width}
          height={TILE.height}
          patternUnits="userSpaceOnUse"
        >
          {pieces.map((piece, i) => (
            <DebrisPiece key={i} piece={piece} />
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
