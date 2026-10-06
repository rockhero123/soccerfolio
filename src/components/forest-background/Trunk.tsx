import { layerStyles, type ForestDepth } from "./layers";
import { seededRandom, trunkPath } from "./shapes";

type TrunkProps = {
  x: number;
  top: number;
  bottom: number;
  width: number;
  depth: ForestDepth;
  seed: number;
  /** Horizontal wobble of the rubbery trunk. */
  sway?: number;
  /** Draw a dark knot hole somewhere along the trunk. */
  knot?: boolean;
};

/** A wavy, ink-outlined tree trunk with hand-drawn bark lines. */
export default function Trunk({
  x,
  top,
  bottom,
  width,
  depth,
  seed,
  sway = 8,
  knot = false,
}: TrunkProps) {
  const style = layerStyles[depth];
  const rand = seededRandom(seed);
  const height = bottom - top;
  const lines = depth === "distant" ? 1 : 3;
  const barkLines = Array.from({ length: lines }, () => {
    const lx = x + (rand() - 0.5) * width * 0.5;
    const ly = top + rand() * height * 0.7;
    const len = height * (0.12 + rand() * 0.15);
    return `M${Math.round(lx)} ${Math.round(ly)}q${Math.round(sway * 0.6)} ${Math.round(len / 2)} 0 ${Math.round(len)}`;
  });
  const knotY = top + height * (0.3 + rand() * 0.4);

  return (
    <g>
      <path
        d={trunkPath(x, top, bottom, width, sway)}
        className={`${style.wood} ${style.line}`}
        strokeWidth={style.outline}
        strokeLinejoin="round"
      />
      <path
        d={barkLines.join("")}
        className={`fill-none ${style.line}`}
        strokeWidth={style.outline * 0.6}
        strokeLinecap="round"
      />
      {knot && (
        <ellipse
          cx={x}
          cy={Math.round(knotY)}
          rx={Math.round(width * 0.18)}
          ry={Math.round(width * 0.3)}
          className={`fill-ink ${style.line}`}
          strokeWidth={style.outline}
        />
      )}
    </g>
  );
}
