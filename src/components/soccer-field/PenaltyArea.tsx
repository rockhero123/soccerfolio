type PenaltyAreaProps = {
  /** Which end of the field: the bottom end is the top one mirrored. */
  end: "top" | "bottom";
  /** Draw the goal (posts and net) behind the goal line. */
  goal?: boolean;
  className?: string;
};

/** Width / height of the drawing; the SVG keeps this ratio at every size. */
export const PENALTY_AREA_VIEWBOX = { width: 400, height: 170 } as const;

const chalkLine = "fill-none stroke-chalk stroke-outline";

/**
 * Chalk markings at one end of the field, drawn from the goal line (y = 0):
 * the penalty box, the goal area, the penalty spot and the penalty arc,
 * plus an optional goal sticking out behind the line.
 * Strokes do not scale, so the lines keep the outline width at any size.
 */
export default function PenaltyArea({
  end,
  goal = false,
  className = "",
}: PenaltyAreaProps) {
  const { width, height } = PENALTY_AREA_VIEWBOX;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      data-marking={`penalty-area-${end}`}
      className={`overflow-visible ${end === "bottom" ? "-scale-y-100" : ""} ${className}`}
      focusable="false"
    >
      <g strokeLinecap="round">
        <path
          data-marking="penalty-box"
          d="M60 0V120H340V0"
          className={chalkLine}
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-marking="goal-area"
          d="M135 0V45H265V0"
          className={chalkLine}
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-marking="penalty-arc"
          d="M149.2 120A60 60 0 0 0 250.8 120"
          className={chalkLine}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          data-marking="penalty-spot"
          cx="200"
          cy="88"
          r="5"
          className="fill-chalk"
        />
        {goal && (
          <g data-marking="goal">
            <path
              d="M180 -20V0M190 -20V0M200 -20V0M210 -20V0M220 -20V0M170 -10H230"
              className="fill-none stroke-chalk [stroke-width:calc(var(--stroke-width-outline)*0.5)]"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M170 0V-20H230V0"
              className={chalkLine}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
