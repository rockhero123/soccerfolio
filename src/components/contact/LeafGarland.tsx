import { useId } from "react";
import PixelPattern from "../pixel/PixelPattern";
import { LEAF_GARLAND } from "./contactArt";

/**
 * A strip of shaded pixel leaves with tiny flowers, growing along the foot of
 * the contact board (spec 007 US-1). It repeats horizontally, so it fits any
 * width. Decorative.
 */
export default function LeafGarland({ className = "" }: { className?: string }) {
  const id = `leaf-garland-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <PixelPattern
      id={id}
      tile={LEAF_GARLAND}
      className={`w-full ${className}`}
      data={{ "data-leaf-garland": "" }}
    />
  );
}

