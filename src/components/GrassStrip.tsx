import { useId } from "react";
import PixelPattern from "./pixel/PixelPattern";
import { DARK_GRASS, FIELD_GRASS, grassTufts } from "./pixel/textures";

/** One repeating tile of grass, in art pixels. */
const TILE = { width: 64, height: 9 } as const;

const TUFTS = {
  dark: grassTufts(TILE.width, TILE.height, 9, DARK_GRASS),
  field: grassTufts(TILE.width, TILE.height, 21, FIELD_GRASS),
} as const;

type GrassStripProps = {
  /** Position of the strip, e.g. `absolute inset-x-3 -bottom-1`. */
  className?: string;
  /** Dark grass (default, as in the contact zone) or bright field grass. */
  tone?: keyof typeof TUFTS;
};

/**
 * A decorative strip of pixel-art grass for title banners, cards and the edge
 * of the contact zone: V-shaped tufts of 1-pixel blades, shaded from a dark root
 * to a light tip, on a band of ground (the grass of `design_2.ai.pdf`, redrawn
 * as pixel art). It repeats horizontally, so it fits any width, and is drawn at
 * the site's pixel size, so it is always 9 art pixels tall.
 */
export default function GrassStrip({
  className = "",
  tone = "dark",
}: GrassStripProps) {
  const id = `grass-strip-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <PixelPattern
      id={id}
      tile={TUFTS[tone]}
      className={`w-full h-[calc(9*var(--px))] ${className}`}
      data={{ "data-grass-strip": tone }}
    />
  );
}
