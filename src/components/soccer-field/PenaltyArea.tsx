import type { CSSProperties } from "react";
import PixelArt from "../pixel/PixelArt";
import { markingAttrs } from "./lines";
import { PENALTY_ART } from "./markingArt";

type PenaltyAreaProps = {
  /** Which end of the field: the bottom end is the top one mirrored. */
  end: "top" | "bottom";
  /** Draw the goal (posts and net) behind the goal line. */
  goal?: boolean;
  className?: string;
  style?: CSSProperties;
};

/**
 * Field markings at one end, in pixel art: the penalty box, the goal area, the
 * penalty spot and the penalty arc, plus an optional goal behind the line.
 * Drawn at the site's pixel size.
 */
export default function PenaltyArea({
  end,
  goal = false,
  className = "",
  style,
}: PenaltyAreaProps) {
  return (
    <PixelArt
      art={goal ? PENALTY_ART.goal : PENALTY_ART.plain}
      className={`${end === "bottom" ? "-scale-y-100" : ""} ${className}`}
      data={markingAttrs(`penalty-area-${end}`)}
      style={style}
    />
  );
}
