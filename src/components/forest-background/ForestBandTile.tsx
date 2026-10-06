import Branch from "./Branch";
import Foliage from "./Foliage";
import Leaf from "./Leaf";
import TileWrap from "./TileWrap";

/** Size of one repeating band tile, in SVG user units (CSS px). */
export const BAND_TILE = { width: 480, height: 160 } as const;

const W = BAND_TILE.width;

/** Foliage clumps: [cx, cy, rx, ry]. y = 0 is the outer page edge. */
const distantFoliage: [number, number, number, number][] = [
  [0, 104, 54, 34],
  [92, 112, 50, 30],
  [176, 100, 56, 36],
  [262, 110, 50, 32],
  [348, 102, 56, 34],
  [420, 114, 46, 28],
];

const midFoliage: [number, number, number, number][] = [
  [40, 68, 74, 46],
  [170, 74, 70, 44],
  [300, 66, 76, 48],
  [420, 74, 66, 42],
];

const nearFoliage: [number, number, number, number][] = [
  [0, 8, 86, 54],
  [124, 0, 80, 50],
  [246, 10, 84, 56],
  [368, 2, 80, 50],
];

/** Hanging leaves: [x, y, length, width, angle]. */
const nearLeaves: [number, number, number, number, number][] = [
  [84, 40, 70, 30, 200],
  [196, 44, 62, 28, 160],
  [318, 46, 74, 32, 192],
  [440, 40, 60, 26, 150],
];

/**
 * The horizontal forest band above and below the field, as a repeating SVG pattern.
 * Drawn as a canopy (y = 0 is the outer edge); the bottom band reuses it rotated 180°.
 */
export default function ForestBandTile({ id }: { id: string }) {
  return (
    <pattern
      id={id}
      width={W}
      height={BAND_TILE.height}
      patternUnits="userSpaceOnUse"
    >
      <TileWrap dx={W} id={`${id}-distant`}>
        {distantFoliage.map(([cx, cy, rx, ry], i) => (
          <Foliage
            key={cx}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            depth="distant"
            seed={101 + i}
            bumps={8}
          />
        ))}
      </TileWrap>

      <TileWrap dx={W} id={`${id}-mid`}>
        <Branch d="M110 30C104 60 118 90 108 128" thickness={5} depth="mid" />
        <Branch d="M372 30C380 56 366 84 374 116" thickness={5} depth="mid" />
        {midFoliage.map(([cx, cy, rx, ry], i) => (
          <Foliage
            key={cx}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            depth="mid"
            seed={121 + i}
          />
        ))}
      </TileWrap>

      <TileWrap dx={W} id={`${id}-near`}>
        {nearLeaves.map(([x, y, length, width, angle]) => (
          <Leaf
            key={x}
            x={x}
            y={y}
            length={length}
            width={width}
            angle={angle}
            depth="near"
          />
        ))}
        {nearFoliage.map(([cx, cy, rx, ry], i) => (
          <Foliage
            key={cx}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            depth="near"
            seed={141 + i}
            bumps={8}
          />
        ))}
      </TileWrap>
    </pattern>
  );
}
