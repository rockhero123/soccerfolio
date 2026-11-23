import type { Sprite } from "./canvas";
import PixelPaths from "./PixelPaths";

type PixelPatternProps = {
  /** Unique id of the pattern in the document. */
  id: string;
  /** The tile, repeated in both directions. */
  tile: Sprite;
  className?: string;
  /** Extra data attributes for tests and styling hooks. */
  data?: Record<`data-${string}`, string>;
  /** Shift of the tile grid, in art pixels (to vary repeats). */
  offsetX?: number;
  offsetY?: number;
};

/** Area covered by the pattern, in art pixels: far larger than any page. */
const COVER = 20000;

/**
 * Fills its box with a repeating pixel tile, drawn at the site's pixel size
 * (`--px-scale`) whatever the box size, so the pixels stay square and crisp.
 * The tile is defined once and repeated by the browser, so a whole forest or
 * field costs one tile of markup. Decorative.
 */
export default function PixelPattern({
  id,
  tile,
  className = "",
  data,
  offsetX = 0,
  offsetY = 0,
}: PixelPatternProps) {
  const { canvas, paths } = tile;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={`block ${className}`}
      {...data}
    >
      <defs>
        <pattern
          id={id}
          width={canvas.width}
          height={canvas.height}
          x={offsetX}
          y={offsetY}
          patternUnits="userSpaceOnUse"
        >
          <PixelPaths paths={paths} />
        </pattern>
      </defs>
      <g style={{ transform: "scale(var(--px-scale))" }}>
        <rect width={COVER} height={COVER} fill={`url(#${id})`} />
      </g>
    </svg>
  );
}
