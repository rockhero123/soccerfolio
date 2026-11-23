import { useId } from "react";
import PixelArt from "../pixel/PixelArt";
import PixelPattern from "../pixel/PixelPattern";
import { CREST, CURTAIN, HEM, VALANCE } from "./theaterArt";

const shade = (alpha: number) =>
  `color-mix(in oklab, var(--color-ink) ${alpha}%, transparent)`;

/** Hard-edged bands of shadow at both sides of the stage. */
const WINGS = `linear-gradient(to right, ${shade(45)} 0 3%, ${shade(28)} 3% 7%, ${shade(12)} 7% 12%, transparent 12% 88%, ${shade(12)} 88% 93%, ${shade(28)} 93% 97%, ${shade(45)} 97%)`;

/**
 * The closed theater curtain (spec 900 US-2): velvet folds meeting in the
 * middle, a gold-fringed hem (7 art pixels), and a
 * swagged valance (30 art pixels) with the match crest. Server-rendered
 * and decorative; it fills its positioned parent.
 */
export default function TheaterDrapes() {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <div aria-hidden="true" data-theater-art="drapes" className="absolute inset-0">
      <PixelPattern
        id={`curtain-${id}`}
        tile={CURTAIN}
        className="absolute inset-0 h-full w-full"
      />
      {/* Where the two curtains meet. */}
      <div className="absolute inset-y-0 left-1/2 w-[calc(2*var(--px))] -translate-x-1/2 bg-red-800" />
      {/* The wings: the curtain falls into shadow towards the sides. */}
      <div className="absolute inset-0" style={{ backgroundImage: WINGS }} />
      <PixelPattern
        id={`hem-${id}`}
        tile={HEM}
        className="absolute inset-x-0 -bottom-[calc(4*var(--px))] h-[calc(7*var(--px))] w-full"
      />
      <PixelPattern
        id={`valance-${id}`}
        tile={VALANCE}
        className="absolute inset-x-0 top-0 h-[calc(30*var(--px))] w-full"
      />
      <PixelArt
        art={CREST}
        className="absolute top-[calc(4*var(--px))] left-1/2 -translate-x-1/2"
      />
    </div>
  );
}
