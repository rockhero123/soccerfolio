import { place, woodCasing, woodCore } from "./style";

type TwigProps = {
  x: number;
  y: number;
  angle: number;
  length: number;
  /** Stroke class for the wood, from the zone palette. */
  wood: string;
};

/** A small forked branch, rubbery, with an ink casing around the wood. */
export default function Twig({ x, y, angle, length, wood }: TwigProps) {
  const l = length;
  const d = `M0 0Q${l * 0.12} ${-l * 0.5} 0 ${-l}M${l * 0.04} ${-l * 0.45}Q${l * 0.22} ${-l * 0.58} ${l * 0.34} ${-l * 0.78}M${l * 0.02} ${-l * 0.72}Q${-l * 0.12} ${-l * 0.8} ${-l * 0.2} ${-l * 0.92}`;
  return (
    <g data-debris="twig" transform={place(x, y, angle)} strokeLinecap="round">
      <path d={d} className={woodCasing} />
      <path d={d} className={`${wood} ${woodCore}`} />
    </g>
  );
}
