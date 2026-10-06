import Branch from "./Branch";
import Foliage from "./Foliage";
import Leaf from "./Leaf";
import TileWrap from "./TileWrap";
import { between, seededRandom } from "./shapes";

/**
 * Size of one repeating band tile, in SVG user units (CSS px).
 * The tile is wider than a 1280px screen, so the band does not visibly repeat there.
 * It is taller than the 160px band, with an empty strip at the far side, so the
 * next row of the pattern can never bleed in as a seam on fractional pixel ratios.
 */
export const BAND_TILE = { width: 1320, height: 240, art: 160 } as const;

const W = BAND_TILE.width;
const ART = BAND_TILE.art;

type Clump = { cx: number; cy: number; rx: number; ry: number };
type LeafSpec = {
  x: number;
  y: number;
  length: number;
  width: number;
  angle: number;
};

/**
 * Spreads `count` items across the tile width with seeded jitter, so neighbours
 * never line up at a regular rhythm but the tile is still evenly covered.
 */
function spread(rand: () => number, count: number): number[] {
  const step = W / count;
  return Array.from({ length: count }, (_, i) =>
    between(rand, i * step + step * 0.1, i * step + step * 0.9),
  );
}

/**
 * Seeded layout of the band, drawn as a canopy: y = 0 is the outer page edge.
 * Varying sizes, gaps and depths make every stretch of the band look different.
 */
function bandLayout(seed: number) {
  const rand = seededRandom(seed);
  const distant: Clump[] = spread(rand, 16).map((cx) => ({
    cx,
    cy: between(rand, 96, 118),
    rx: between(rand, 36, 60),
    ry: between(rand, 24, 36),
  }));
  const mid: Clump[] = spread(rand, 11).map((cx) => ({
    cx,
    cy: between(rand, 56, 82),
    rx: between(rand, 52, 84),
    ry: between(rand, 34, 52),
  }));
  const near: Clump[] = spread(rand, 12).map((cx) => {
    const big = rand() > 0.72;
    return {
      cx,
      cy: between(rand, -6, big ? 22 : 12),
      rx: big ? between(rand, 92, 112) : between(rand, 62, 86),
      ry: big ? between(rand, 56, 66) : between(rand, 40, 54),
    };
  });
  const leaves: LeafSpec[] = spread(rand, 10).map((x) => ({
    x,
    y: between(rand, 32, 50),
    length: between(rand, 50, 80),
    width: between(rand, 22, 32),
    angle: between(rand, 145, 215),
  }));
  const branches = spread(rand, 4).map((x) => {
    const end = between(rand, 104, 132);
    const bend = between(rand, -12, 12);
    return { x, end, bend };
  });
  return { distant, mid, near, leaves, branches };
}

type ForestBandTileProps = {
  id: string;
  /** Which page edge the band hugs: a hanging canopy on top, ground bushes at the bottom. */
  edge: "top" | "bottom";
  /** Layout seed, so the top and bottom bands are different variants. */
  seed: number;
  /** Id of the shared ink filter for band tiles. */
  filterId: string;
};

/**
 * A horizontal forest band above or below the field, as a repeating SVG pattern.
 * The bottom band is laid out from the bottom edge (not just the top band rotated),
 * so light and shading still come from above.
 */
export default function ForestBandTile({
  id,
  edge,
  seed,
  filterId,
}: ForestBandTileProps) {
  const { distant, mid, near, leaves, branches } = bandLayout(seed);
  // Canopy coordinates → screen coordinates for this edge.
  const y = (value: number) => (edge === "top" ? value : ART - value);
  const angle = (value: number) => (edge === "top" ? value : 180 - value);
  const clump = (c: Clump) => ({ cx: c.cx, cy: y(c.cy), rx: c.rx, ry: c.ry });

  return (
    <pattern
      id={id}
      width={W}
      height={BAND_TILE.height}
      patternUnits="userSpaceOnUse"
    >
      <g filter={`url(#${filterId})`}>
        <TileWrap dx={W} id={`${id}-distant`}>
          {distant.map((c, i) => (
            <Foliage
              key={i}
              {...clump(c)}
              depth="distant"
              seed={seed + 101 + i}
              bumps={8}
            />
          ))}
        </TileWrap>

        <TileWrap dx={W} id={`${id}-mid`}>
          {branches.map((b, i) => (
            <Branch
              key={i}
              d={`M${b.x} ${y(30)}C${b.x - b.bend} ${y(60)} ${b.x + b.bend} ${y(90)} ${b.x - b.bend / 2} ${y(b.end)}`}
              thickness={5}
              depth="mid"
            />
          ))}
          {mid.map((c, i) => (
            <Foliage key={i} {...clump(c)} depth="mid" seed={seed + 121 + i} />
          ))}
        </TileWrap>

        <TileWrap dx={W} id={`${id}-near`}>
          {leaves.map((l, i) => (
            <Leaf
              key={i}
              x={l.x}
              y={y(l.y)}
              length={l.length}
              width={l.width}
              angle={angle(l.angle)}
              depth="near"
            />
          ))}
          {near.map((c, i) => (
            <Foliage
              key={i}
              {...clump(c)}
              depth="near"
              seed={seed + 141 + i}
              bumps={8}
            />
          ))}
        </TileWrap>
      </g>
    </pattern>
  );
}
