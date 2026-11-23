import PixelArt from "../pixel/PixelArt";
import { markingAttrs } from "./lines";
import { CORNER_ARC } from "./markingArt";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/** Places and mirrors the top-left arc into each corner of the boundary. */
const placement: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-100",
};

/** A quarter-circle pixel arc in one corner of the field boundary. */
export default function CornerArc({ corner }: { corner: Corner }) {
  return (
    <PixelArt
      art={CORNER_ARC}
      className={`absolute ${placement[corner]}`}
      data={markingAttrs("corner-arc")}
    />
  );
}
