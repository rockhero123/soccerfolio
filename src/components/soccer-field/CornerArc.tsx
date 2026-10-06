import { lineClass, markingAttrs, type LineLayer } from "./lines";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

/** Places and mirrors the top-left arc into each corner of the boundary. */
const placement: Record<Corner, string> = {
  "top-left": "top-0 left-0",
  "top-right": "top-0 right-0 -scale-x-100",
  "bottom-left": "bottom-0 left-0 -scale-y-100",
  "bottom-right": "bottom-0 right-0 -scale-100",
};

type CornerArcProps = { corner: Corner; layer: LineLayer };

/** A quarter-circle arc in one corner of the field boundary. */
export default function CornerArc({ corner, layer }: CornerArcProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      {...markingAttrs(layer, "corner-arc")}
      className={`absolute size-5 overflow-visible md:size-6 ${placement[corner]}`}
      focusable="false"
    >
      <path
        d="M0 20A20 20 0 0 0 20 0"
        className={lineClass[layer]}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
