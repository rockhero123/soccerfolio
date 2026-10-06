import { place } from "./style";

type GrassTuftProps = {
  x: number;
  y: number;
  angle: number;
  size: number;
  /** `light`: dark-green tufts on the bright grass; `dark`: ink tufts on the dark grass. */
  tone: "light" | "dark";
};

/** A small clump of taller grass blades, painted a shade darker than the lawn. */
export default function GrassTuft({ x, y, angle, size, tone }: GrassTuftProps) {
  const s = size;
  const d = `M${-s * 0.5} 0Q${-s * 0.45} ${-s * 0.5} ${-s * 0.7} ${-s * 0.9}Q${-s * 0.25} ${-s * 0.55} ${-s * 0.15} 0ZM${-s * 0.2} 0Q${-s * 0.1} ${-s * 0.7} 0 ${-s * 1.2}Q${s * 0.12} ${-s * 0.6} ${s * 0.18} 0ZM${s * 0.1} 0Q${s * 0.35} ${-s * 0.55} ${s * 0.65} ${-s * 0.85}Q${s * 0.4} ${-s * 0.4} ${s * 0.45} 0Z`;
  return (
    <path
      data-debris="tuft"
      d={d}
      transform={place(x, y, angle)}
      className={tone === "light" ? "fill-pitch-dark" : "fill-ink"}
      fillOpacity={tone === "light" ? 0.4 : 0.3}
    />
  );
}
