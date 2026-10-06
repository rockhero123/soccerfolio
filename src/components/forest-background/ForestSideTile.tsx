import Branch from "./Branch";
import Foliage from "./Foliage";
import Leaf from "./Leaf";
import TileWrap from "./TileWrap";
import Trunk from "./Trunk";

/** Size of one repeating side tile, in SVG user units (CSS px). */
export const SIDE_TILE = { width: 360, height: 960 } as const;

const W = SIDE_TILE.width;
const H = SIDE_TILE.height;

/** Pale distant trunks: [x, width]. */
const distantTrunks: [number, number][] = [
  [22, 16],
  [128, 18],
  [184, 14],
  [244, 22],
  [318, 16],
];

/** Foliage clumps: [cx, cy, rx, ry]. */
const distantFoliage: [number, number, number, number][] = [
  [140, 80, 56, 42],
  [214, 300, 64, 46],
  [118, 470, 54, 40],
  [300, 520, 60, 44],
  [170, 700, 62, 46],
  [96, 860, 50, 38],
  [330, 860, 56, 42],
];

const midFoliage: [number, number, number, number][] = [
  [130, 196, 52, 40],
  [282, 120, 66, 48],
  [120, 620, 50, 38],
  [214, 436, 58, 42],
  [292, 760, 62, 46],
];

const nearFoliage: [number, number, number, number][] = [
  [0, 40, 50, 80],
  [14, 270, 40, 62],
  [0, 450, 52, 84],
  [16, 640, 38, 58],
  [0, 810, 50, 78],
];

/** Big foreground leaves reaching in from the outer edge: [x, y, length, width, angle]. */
const nearLeaves: [number, number, number, number, number][] = [
  [26, 160, 86, 36, 66],
  [36, 360, 70, 30, 104],
  [30, 540, 96, 40, 72],
  [26, 730, 76, 32, 114],
  [30, 920, 84, 36, 60],
];

/**
 * The vertical forest strip used on the left and right of the field, as a repeating
 * SVG pattern. x = 0 is the outer page edge; the dark foreground hugs that edge and
 * the paler layers show through towards the field. The shared ink filter gives
 * every layer hand-inked outlines and a watercolour wash.
 */
export default function ForestSideTile({
  id,
  filterId,
}: {
  id: string;
  filterId: string;
}) {
  return (
    <pattern id={id} width={W} height={H} patternUnits="userSpaceOnUse">
      <g filter={`url(#${filterId})`}>
        <TileWrap dy={H} id={`${id}-distant`}>
          {distantTrunks.map(([x, width], i) => (
            <Trunk
              key={x}
              x={x}
              top={-20}
              bottom={H + 20}
              width={width}
              depth="distant"
              seed={11 + i}
              sway={i % 2 === 0 ? 5 : -5}
            />
          ))}
          {distantFoliage.map(([cx, cy, rx, ry], i) => (
            <Foliage
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              depth="distant"
              seed={31 + i}
            />
          ))}
        </TileWrap>

        <TileWrap dy={H} id={`${id}-mid`}>
          <Branch
            d="M76 260C96 240 110 220 124 192"
            thickness={12}
            depth="mid"
          />
          <Branch
            d="M76 680C92 664 104 648 116 622"
            thickness={10}
            depth="mid"
          />
          <Branch
            d="M252 480C240 466 228 456 218 438"
            thickness={12}
            depth="mid"
          />
          <Branch
            d="M252 170C264 154 272 140 278 124"
            thickness={14}
            depth="mid"
          />
          <Trunk
            x={76}
            top={-30}
            bottom={H + 30}
            width={40}
            depth="mid"
            seed={51}
            sway={10}
            knot
          />
          <Trunk
            x={252}
            top={-30}
            bottom={H + 30}
            width={52}
            depth="mid"
            seed={52}
            sway={-12}
            knot
          />
          {midFoliage.map(([cx, cy, rx, ry], i) => (
            <Foliage
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              depth="mid"
              seed={61 + i}
            />
          ))}
        </TileWrap>

        <TileWrap dy={H} id={`${id}-near`}>
          <Trunk
            x={4}
            top={-30}
            bottom={H + 30}
            width={22}
            depth="near"
            seed={71}
            sway={6}
          />
          {nearLeaves.map(([x, y, length, width, angle]) => (
            <Leaf
              key={`${x}-${y}`}
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
              key={`${cx}-${cy}`}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              depth="near"
              seed={81 + i}
              bumps={8}
            />
          ))}
        </TileWrap>
      </g>
    </pattern>
  );
}
