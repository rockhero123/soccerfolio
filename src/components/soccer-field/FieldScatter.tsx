import { useId } from "react";
import PixelPattern from "../pixel/PixelPattern";
import { SCATTER_ART, type Zone } from "./lawnArt";

/**
 * Fallen forest debris on the field (spec 001 US-3): pixel leaves, twigs,
 * clovers, little flowers and pebbles, on two overlapping tiles of unrelated
 * sizes, so the scatter looks random rather than tiled. Decorative and static.
 */
export default function FieldScatter({ zone }: { zone: Zone }) {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <>
      {SCATTER_ART[zone].map((tile, i) => (
        <PixelPattern
          key={i}
          id={`field-scatter-${id}-${i}`}
          tile={tile}
          offsetX={i * 37}
          className="absolute inset-0 size-full"
          data={{ "data-field-scatter": zone }}
        />
      ))}
    </>
  );
}
