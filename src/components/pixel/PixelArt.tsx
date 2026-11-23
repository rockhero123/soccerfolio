import type { CSSProperties } from "react";
import type { Sprite } from "./canvas";
import PixelPaths from "./PixelPaths";

type PixelArtProps = {
  /** The finished sprite. Build it once at module level, not per render. */
  art: Sprite;
  /** Size, position, etc. Without a width or height class the sprite is drawn
   *  at its natural size: one art pixel = `--px`. */
  className?: string;
  /** Draw at natural size (width and height from `--px`). Default true. */
  natural?: boolean;
  /** Extra data attributes for tests and styling hooks. */
  data?: Record<`data-${string}`, string>;
  style?: CSSProperties;
};

/**
 * Renders a pixel sprite as a crisp, decorative inline SVG.
 * `shape-rendering: crispEdges` keeps every pixel square when it is scaled.
 */
export default function PixelArt({
  art,
  className = "",
  natural = true,
  data,
  style,
}: PixelArtProps) {
  const { canvas, paths } = art;
  const size: CSSProperties = natural
    ? {
        width: `calc(${canvas.width} * var(--px))`,
        height: `calc(${canvas.height} * var(--px))`,
      }
    : {};
  return (
    <svg
      viewBox={`0 0 ${canvas.width} ${canvas.height}`}
      aria-hidden="true"
      focusable="false"
      shapeRendering="crispEdges"
      className={`block ${className}`}
      style={{ ...size, ...style }}
      {...data}
    >
      <PixelPaths paths={paths} />
    </svg>
  );
}
