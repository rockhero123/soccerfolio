import {
  detailWidth,
  INK_WEIGHT_OFFSET,
  layerStyles,
  type ForestDepth,
} from "./layers";
import { leafPath, leafShadePath } from "./shapes";

type LeafProps = {
  x: number;
  y: number;
  length: number;
  width: number;
  /** Rotation in degrees; 0 points straight up. */
  angle: number;
  depth: ForestDepth;
};

/** A big pointed leaf with a shaded half and a centre vein, anchored at its base. */
export default function Leaf({ x, y, length, width, angle, depth }: LeafProps) {
  const style = layerStyles[depth];
  const shape = leafPath(length, width);
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {style.inkWeight && (
        <path
          d={shape}
          className={style.inkWeight}
          transform={INK_WEIGHT_OFFSET}
        />
      )}
      <path d={shape} className={style.leaf} />
      <path d={leafShadePath(length, width)} className={style.leafShade} />
      <path
        d={shape}
        data-ink="outline"
        className={`fill-none ${style.line} ${style.outline}`}
        strokeLinejoin="round"
      />
      <path
        d={`M0 -4Q${Math.round(width * 0.12)} ${Math.round(-length * 0.5)} 0 ${Math.round(-length * 0.82)}`}
        className={`fill-none ${style.detail} ${detailWidth}`}
        strokeLinecap="round"
      />
    </g>
  );
}
