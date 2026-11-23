import { useId } from "react";
import PixelArt from "../pixel/PixelArt";
import PixelPattern from "../pixel/PixelPattern";
import { FLOOR, LIP, SEATS } from "./theaterArt";

/**
 * The front of the theater (spec 900 US-2): the brown wooden stage floor
 * with its seams running back towards the curtain (up to 40 art pixels), the
 * stage lip and skirt (9), and the audience's dark blue seats (up to 60). On
 * short screens the floor and seats are cropped (at most 17vh and 21vh), so
 * the curtain keeps room for the poster. The floor sprite is centred, and the
 * floor colour continues past its edges.
 * Server-rendered and decorative.
 */
export default function TheaterStalls() {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <div aria-hidden="true" data-theater-art="stalls" className="flex flex-col">
      <div className="relative h-[min(calc(40*var(--px)),17vh)] overflow-hidden bg-wood-500">
        <PixelArt art={FLOOR} className="absolute top-0 left-1/2 -translate-x-1/2" />
      </div>
      <PixelPattern id={`lip-${id}`} tile={LIP} className="h-[calc(9*var(--px))] w-full bg-stone-900" />
      <PixelPattern id={`seats-${id}`} tile={SEATS} className="h-[min(calc(60*var(--px)),21vh)] w-full" />
    </div>
  );
}
