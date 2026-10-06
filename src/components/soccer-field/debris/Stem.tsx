import { leafPath } from "../../forest-background/shapes";
import { debrisOutline, place, woodCasing, woodCore } from "./style";

type StemProps = {
  x: number;
  y: number;
  angle: number;
  length: number;
  /** Stroke class of the stalk and fill class of the leaflets, from the zone palette. */
  stalk: string;
  leaflet: string;
};

/** A thin, curling stem with three little leaflets. */
export default function Stem({
  x,
  y,
  angle,
  length,
  stalk,
  leaflet,
}: StemProps) {
  const l = length;
  const d = `M0 0C${l * 0.25} ${-l * 0.3} ${-l * 0.2} ${-l * 0.65} ${l * 0.08} ${-l}`;
  const leaflets: [number, number, number][] = [
    [l * 0.06, -l * 0.3, 55],
    [-l * 0.02, -l * 0.58, -60],
    [l * 0.08, -l, 10],
  ];
  return (
    <g data-debris="stem" transform={place(x, y, angle)} strokeLinecap="round">
      <path d={d} className={woodCasing} />
      <path d={d} className={`${stalk} ${woodCore}`} />
      {leaflets.map(([lx, ly, la]) => (
        <path
          key={la}
          d={leafPath(l * 0.32, l * 0.2)}
          transform={place(lx, ly, la)}
          className={`${leaflet} ${debrisOutline}`}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}
