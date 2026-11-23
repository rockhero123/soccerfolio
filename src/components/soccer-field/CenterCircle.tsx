import PixelArt from "../pixel/PixelArt";
import { markingAttrs } from "./lines";
import { CENTER_CIRCLE } from "./markingArt";

/**
 * The centre circle and centre spot, in pixel art; the halfway line itself is
 * drawn by `SoccerField`.
 */
export default function CenterCircle({ className = "" }: { className?: string }) {
  return (
    <PixelArt
      art={CENTER_CIRCLE}
      className={className}
      data={markingAttrs("center-circle")}
    />
  );
}
