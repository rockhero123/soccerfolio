import { layerStyles, type ForestDepth } from "./layers";
import { leafPath } from "./shapes";

type LeafProps = {
  x: number;
  y: number;
  length: number;
  width: number;
  /** Rotation in degrees; 0 points straight up. */
  angle: number;
  depth: ForestDepth;
};

/** A big pointed leaf with a centre vein, anchored at its base. */
export default function Leaf({ x, y, length, width, angle, depth }: LeafProps) {
  const style = layerStyles[depth];
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path
        d={leafPath(length, width)}
        className={`${style.leaf} ${style.line}`}
        strokeWidth={style.outline}
        strokeLinejoin="round"
      />
      <path
        d={`M0 -4Q${Math.round(width * 0.12)} ${Math.round(-length * 0.5)} 0 ${Math.round(-length * 0.82)}`}
        className={`fill-none ${style.detail}`}
        strokeWidth={style.outline * 0.6}
        strokeLinecap="round"
      />
    </g>
  );
}
