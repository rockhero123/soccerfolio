import { debrisOutline, place } from "./style";

type CloverProps = { x: number; y: number; angle: number; size: number };

/** A little three-leaf clover with heart-shaped leaflets and an ink outline. */
export default function Clover({ x, y, angle, size }: CloverProps) {
  const s = size / 2;
  const heart = `M0 0C${-s * 0.9} ${-s * 0.3} ${-s * 0.8} ${-s * 1.2} ${-s * 0.25} ${-s * 1.05}Q0 ${-s * 0.95} 0 ${-s * 0.7}Q0 ${-s * 0.95} ${s * 0.25} ${-s * 1.05}C${s * 0.8} ${-s * 1.2} ${s * 0.9} ${-s * 0.3} 0 0Z`;
  return (
    <g
      data-debris="clover"
      transform={place(x, y, angle)}
      strokeLinejoin="round"
    >
      <path
        d={`M0 0Q${s * 0.3} ${s * 0.6} ${s * 0.1} ${s * 1.2}`}
        className={`fill-none ${debrisOutline}`}
        strokeLinecap="round"
      />
      {[0, 120, 240].map((turn) => (
        <path
          key={turn}
          d={heart}
          transform={`rotate(${turn})`}
          className={`fill-moss ${debrisOutline}`}
        />
      ))}
    </g>
  );
}
