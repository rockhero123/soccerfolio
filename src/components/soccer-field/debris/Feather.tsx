import { debrisOutline, place } from "./style";

type FeatherProps = {
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  /** Colour of the feather tip, like a cartoon bird's plumage. */
  tip: "red" | "yellow";
};

/** A feather vane whose quill sits at the origin and tip points up. */
function vane(length: number, width: number): string {
  const w = width / 2;
  return `M0 0C${w * 1.3} ${-length * 0.2} ${w * 1.1} ${-length * 0.75} 0 ${-length}C${-w * 1.1} ${-length * 0.75} ${-w * 1.3} ${-length * 0.2} 0 0Z`;
}

/** A parchment feather with a coloured tip, an ink outline, a quill and a few barb notches. */
export default function Feather({
  x,
  y,
  angle,
  length,
  width,
  tip,
}: FeatherProps) {
  const l = length;
  const w = width / 2;
  const notches = [0.35, 0.55, 0.72]
    .map(
      (t) =>
        `M${w * 0.95} ${-l * t}L${w * 0.35} ${-l * (t + 0.05)}M${-w * 0.95} ${-l * (t + 0.04)}L${-w * 0.35} ${-l * (t + 0.09)}`,
    )
    .join("");
  return (
    <g
      data-debris="feather"
      transform={place(x, y, angle)}
      strokeLinecap="round"
    >
      <path d={vane(l, width)} className="fill-parchment" />
      <path
        d={vane(l * 0.34, width * 0.82)}
        transform={`translate(0 ${-l * 0.66})`}
        className={tip === "red" ? "fill-cartoon-red" : "fill-cartoon-yellow"}
      />
      <path
        d={vane(l, width)}
        className={`fill-none ${debrisOutline}`}
        strokeLinejoin="round"
      />
      <path d={notches} className={`fill-none ${debrisOutline}`} />
      <path
        d={`M0 ${l * 0.14}L0 ${-l * 0.9}`}
        className={`fill-none ${debrisOutline}`}
      />
    </g>
  );
}
