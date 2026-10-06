import { lineClass, markingAttrs, spotClass, type LineLayer } from "./lines";

type CenterCircleProps = { layer: LineLayer; className?: string };

/**
 * The centre circle and centre spot. The viewBox is square, so the circle
 * stays round at any size; the halfway line itself is drawn by `SoccerField`.
 */
export default function CenterCircle({
  layer,
  className = "",
}: CenterCircleProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      {...markingAttrs(layer, "center-circle")}
      className={`overflow-visible ${className}`}
      focusable="false"
    >
      <circle
        cx="100"
        cy="100"
        r="96"
        className={lineClass[layer]}
        vectorEffect="non-scaling-stroke"
      />
      <circle
        {...markingAttrs(layer, "center-spot")}
        cx="100"
        cy="100"
        r={layer === "ink" ? 9 : 6}
        className={spotClass[layer]}
      />
    </svg>
  );
}
