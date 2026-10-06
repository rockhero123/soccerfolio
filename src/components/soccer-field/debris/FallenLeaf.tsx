import { leafPath, leafShadePath } from "../../forest-background/shapes";
import { debrisOutline, place } from "./style";

export type LeafTone = "moss" | "green" | "autumn" | "red" | "dry";

/** Vintage leaf colours, from fresh moss to dry autumn leaves (tokens only). */
const toneFill: Record<LeafTone, string> = {
  moss: "fill-moss",
  green: "fill-forest-mid-leaf",
  autumn: "fill-cartoon-yellow",
  red: "fill-cartoon-red",
  dry: "fill-forest-bark-light",
};

type FallenLeafProps = {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  tone: LeafTone;
};

/** A fallen leaf with a painted shady half, an ink outline and a vein. */
export default function FallenLeaf({
  x,
  y,
  angle,
  length,
  width,
  tone,
}: FallenLeafProps) {
  const shape = leafPath(length, width);
  return (
    <g data-debris="leaf" transform={place(x, y, angle)}>
      <path d={shape} className={toneFill[tone]} />
      <path
        d={leafShadePath(length, width)}
        className="fill-ink"
        fillOpacity={0.18}
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
