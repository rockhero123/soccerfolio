import { useId } from "react";
import PixelPattern from "../pixel/PixelPattern";
import { LAWN_ART, type Zone } from "./lawnArt";

/**
 * The pixel lawn of one field zone: mown grass with two-tone mowing stripes
 * and speckled blades, one small tile repeated by the browser, so it stays
 * cheap at any field size. Decorative.
 */
export default function FieldPaint({ zone }: { zone: Zone }) {
  const id = `field-lawn-${useId().replace(/[^\w-]/g, "")}`;
  return (
    <PixelPattern
      id={id}
      tile={LAWN_ART[zone]}
      className="absolute inset-0 size-full"
      data={{ "data-field-paint": zone }}
    />
  );
}
