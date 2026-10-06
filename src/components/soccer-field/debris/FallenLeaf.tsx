import { leafPath, leafShadePath } from "../../forest-background/shapes";
import { LEAF_SHADE } from "./palette";
import { debrisOutline, place } from "./style";

type FallenLeafProps = {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  /** Fill class from the zone palette. */
  fill: string;
};

/** A fallen leaf with a painted shady half, an ink outline and a vein. */
export default function FallenLeaf({
  x,
  y,
  angle,
  length,
  width,
  fill,
}: FallenLeafProps) {
  const shape = leafPath(length, width);
  return (
    <g data-debris="leaf" transform={place(x, y, angle)}>
      <path d={shape} className={fill} />
      <path
        d={leafShadePath(length, width)}
        className="fill-ink"
        fillOpacity={LEAF_SHADE}
      />
      <path
        d={shape}
        className={`fill-none ${debrisOutline}`}
        strokeLinejoin="round"
      />
      <path
        d={`M0 2Q${Math.round(width * 0.1)} ${Math.round(-length * 0.5)} 0 ${Math.round(-length * 0.85)}`}
        className={`fill-none ${debrisOutline}`}
        strokeLinecap="round"
        strokeOpacity={0.7}
      />
    </g>
  );
}
