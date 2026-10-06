import { lineClass, markingAttrs, spotClass, type LineLayer } from "./lines";

type PenaltyAreaProps = {
  /** Which end of the field: the bottom end is the top one mirrored. */
  end: "top" | "bottom";
  layer: LineLayer;
  /** Draw the goal (posts and net) behind the goal line. */
  goal?: boolean;
  className?: string;
};

/** Width / height of the drawing; the SVG keeps this ratio at every size. */
export const PENALTY_AREA_VIEWBOX = { width: 400, height: 170 } as const;

/**
 * Field markings at one end, drawn from the goal line (y = 0): the penalty box,
 * the goal area, the penalty spot and the penalty arc, plus an optional goal
 * sticking out behind the line.
 */
export default function PenaltyArea({
  end,
  layer,
  goal = false,
  className = "",
}: PenaltyAreaProps) {
  const { width, height } = PENALTY_AREA_VIEWBOX;
  const line = lineClass[layer];
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      {...markingAttrs(layer, `penalty-area-${end}`)}
      className={`overflow-visible ${end === "bottom" ? "-scale-y-100" : ""} ${className}`}
      focusable="false"
    >
      {/* Butt caps: line ends tuck under the boundary line instead of poking past it. */}
      <g strokeLinecap="butt" strokeLinejoin="round">
        {goal && (
          <g {...markingAttrs(layer, "goal")}>
            {layer === "ink" && (
              <path
                d="M182 -22V0M194 -22V0M206 -22V0M218 -22V0M170 -11H230"
                className="fill-none stroke-ink stroke-outline"
                vectorEffect="non-scaling-stroke"
              />
            )}
            <path
              d="M170 0V-22H230V0"
              className={line}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
        <path
          {...markingAttrs(layer, "penalty-box")}
          d="M60 0V120H340V0"
          className={line}
          vectorEffect="non-scaling-stroke"
        />
        <path
          {...markingAttrs(layer, "goal-area")}
          d="M135 0V45H265V0"
          className={line}
          vectorEffect="non-scaling-stroke"
        />
        <path
          {...markingAttrs(layer, "penalty-arc")}
          d="M149.2 120A60 60 0 0 0 250.8 120"
          className={line}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          {...markingAttrs(layer, "penalty-spot")}
          cx="200"
          cy="88"
          r={layer === "ink" ? 8 : 5}
          className={spotClass[layer]}
        />
      </g>
    </svg>
  );
}
