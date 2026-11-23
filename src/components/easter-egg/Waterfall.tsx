import PixelPaths from "../pixel/PixelPaths";
import PixelPattern from "../pixel/PixelPattern";
import {
  CLIFF_TILE,
  FALLS,
  FALLS_ROCKS,
  FALL_TILE,
  FLAT_TILE,
  FLOATING,
  FOAM_TILE,
  SCENE_H,
} from "./waterfallArt";

/** A pixel-pattern definition (a tile repeated in art pixels). */
function TilePattern({ id, tile }: { id: string; tile: typeof FALL_TILE }) {
  return (
    <pattern
      id={id}
      width={tile.canvas.width}
      height={tile.canvas.height}
      patternUnits="userSpaceOnUse"
    >
      <PixelPaths paths={tile.paths} />
    </pattern>
  );
}

/** Where the floating leaves and the stick drift: [sprite, x, y, delay (s)]. */
const FLOATERS = [
  [FLOATING.leaf, 30, 20, 0],
  [FLOATING.stick, 72, 36, 0.8],
  [FLOATING.greenLeaf, 46, 51, 0.4],
  [FLOATING.leaf, 88, 53, 1.3],
] as const;

/**
 * The easter egg's waterfall (spec 900 US-1), in detailed pixel art: a cascade
 * of three tiers pouring down a mossy stone cliff into a pool at the top of the
 * field, with jungle hanging over the cliff, boulders on the ledges, foam at the
 * foot of every fall and leaves and a stick drifting on the water.
 *
 * - The water moves with pixel-stepped CSS animations (falling streaks, sideways
 *   ripples, flickering foam, drifting leaves): no JavaScript loop. With
 *   `prefers-reduced-motion` it is drawn but stands still (`motion-safe:`).
 * - The cliffs repeat sideways to fill the field's width; the cascade stays centred.
 * - It spans the top of the field, from its top edge down to just above the
 *   Introduction banner, and never takes clicks.
 * - `MusicWaterfall` places the music video (US-2) invisibly behind the falls:
 *   only its music is heard.
 */
export default function Waterfall() {
  const { width, sheets, flats } = FALLS;
  return (
    <div
      aria-hidden="true"
      data-waterfall="root"
      className="pointer-events-none absolute inset-x-0 top-0 z-[3] select-none"
      style={{ height: `calc(${SCENE_H} * var(--px))` }}
    >
      <PixelPattern
        id="waterfall-cliffs"
        tile={CLIFF_TILE}
        className="absolute inset-0 size-full"
        data={{ "data-waterfall": "cliffs" }}
      />
      <svg
        viewBox={`0 0 ${width} ${SCENE_H}`}
        shapeRendering="crispEdges"
        focusable="false"
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: `calc(${width} * var(--px))`,
          height: `calc(${SCENE_H} * var(--px))`,
        }}
      >
        <defs>
          <TilePattern id="waterfall-fall" tile={FALL_TILE} />
          <TilePattern id="waterfall-flat" tile={FLAT_TILE} />
          <TilePattern id="waterfall-foam" tile={FOAM_TILE} />
          <clipPath id="waterfall-sheets">
            {sheets.map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
            ))}
          </clipPath>
          <clipPath id="waterfall-flats">
            {flats.map(([x, y, w, h]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} />
            ))}
          </clipPath>
        </defs>

        {/* Flat water: terraces between the tiers and the pool, rippling sideways. */}
        <g clipPath="url(#waterfall-flats)" data-waterfall="pool">
          <rect
            x={-16}
            y={0}
            width={width + 32}
            height={SCENE_H}
            fill="url(#waterfall-flat)"
            className="motion-safe:animate-water-flow"
          />
        </g>
        {/* Falling sheets: streaks running down. */}
        <g clipPath="url(#waterfall-sheets)" data-waterfall="fall">
          <rect
            x={0}
            y={-16}
            width={width}
            height={SCENE_H + 16}
            fill="url(#waterfall-fall)"
            className="motion-safe:animate-water-fall"
          />
        </g>
        {/* Foam at the foot of every fall. */}
        <g data-waterfall="spray">
          {sheets.map(([x, y, w, h]) => (
            <rect
              key={`${x}-${y}`}
              x={x - 2}
              y={y + h - 1}
              width={w + 4}
              height={3}
              fill="url(#waterfall-foam)"
              className="motion-safe:animate-foam"
            />
          ))}
        </g>

        <g data-waterfall="rock">
          <PixelPaths paths={FALLS_ROCKS.paths} />
        </g>

        {/* Leaves and a stick drifting on the water. */}
        <g data-waterfall="leaves">
          {FLOATERS.map(([art, x, y, delay], i) => (
            <g
              key={i}
              transform={`translate(${x} ${y})`}
            >
              <g
                className="motion-safe:animate-float"
                style={{ animationDelay: `${delay}s` }}
              >
                <PixelPaths paths={art.paths} />
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
