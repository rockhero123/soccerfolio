import type { ReactNode } from "react";
import PixelArt from "./pixel/PixelArt";
import { KNOT, NAIL } from "./sprites/props";

/**
 * Text burned into the light wood: dark `ink` letters (ink on light wood is
 * ≥ 6:1) with a crisp one-pixel highlight below, like a branded sign.
 */
export const engraved =
  "text-ink [text-shadow:0_calc(var(--px)*0.5)_0_var(--color-wood-200)]";

/** The same lettering for running text (no highlight, for small sizes). */
export const engravedText = "text-ink";

/**
 * Running text on a large plank: `ink` letters with a thin light-wood
 * (`wood-200`) halo all around, so the darker board seams stop at the letter
 * edges instead of running through the strokes. Written out in full so
 * Tailwind generates it.
 */
export const engravedReadable =
  "text-ink [text-shadow:calc(var(--px)*0.5)_0_0_var(--color-wood-200),calc(var(--px)*-0.5)_0_0_var(--color-wood-200),0_calc(var(--px)*0.5)_0_var(--color-wood-200),0_calc(var(--px)*-0.5)_0_var(--color-wood-200),calc(var(--px)*0.5)_calc(var(--px)*0.5)_0_var(--color-wood-200),calc(var(--px)*-0.5)_calc(var(--px)*-0.5)_0_var(--color-wood-200),calc(var(--px)*0.5)_calc(var(--px)*-0.5)_0_var(--color-wood-200),calc(var(--px)*-0.5)_calc(var(--px)*0.5)_0_var(--color-wood-200)]";

type WoodPlankProps = {
  /** Extra decoration drawn with the wood, e.g. grass at its foot. */
  children?: ReactNode;
};

/**
 * The pixel-art wooden plank behind every sign on the site: light, warm boards
 * with seams every few pixels, a highlight along the top, a shaded bottom
 * edge, a notched dark outline, a knot and two nails. It fills its positioned
 * parent and stretches to fit; the pixels stay the same size. Decorative.
 */
export default function WoodPlank({ children }: WoodPlankProps) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div data-wood="plank" className="absolute inset-0 pixel-frame-wood" />
      <PixelArt
        art={KNOT}
        className="absolute bottom-[calc(4*var(--px))] left-[18%]"
        data={{ "data-wood": "knot" }}
      />
      <PixelArt
        art={NAIL}
        className="absolute top-1/2 left-[calc(3*var(--px))] -translate-y-1/2"
        data={{ "data-wood": "nail" }}
      />
      <PixelArt
        art={NAIL}
        className="absolute top-1/2 right-[calc(3*var(--px))] -translate-y-1/2"
        data={{ "data-wood": "nail" }}
      />
      {children}
    </div>
  );
}
