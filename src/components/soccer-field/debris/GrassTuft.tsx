import { debrisOutline, place } from "./style";

type GrassTuftProps = {
  x: number;
  y: number;
  angle: number;
  size: number;
  /** Fill class from the zone palette. */
  fill: string;
};

/**
 * A rubber-hose clump of tall grass: four fat, curvy blades with curled tips,
 * an ink outline and a painted highlight, standing on its base at the origin.
 */
export default function GrassTuft({ x, y, angle, size, fill }: GrassTuftProps) {
  const s = size;
  // [base x, base half-width, height, tip lean, curl]
  const blades: [number, number, number, number, number][] = [
    [-0.45, 0.16, 0.75, -0.5, -0.12],
    [0.4, 0.15, 0.7, 0.45, 0.12],
    [-0.15, 0.18, 1.15, -0.2, 0.18],
    [0.15, 0.17, 0.95, 0.3, -0.15],
  ];
  const r = (v: number) => Math.round(v * s * 10) / 10;
  return (
    <g data-debris="tuft" transform={place(x, y, angle)} strokeLinejoin="round">
      {blades.map(([bx, hw, h, lean, curl]) => {
        const tipX = bx + lean;
        const d = `M${r(bx - hw)} 0C${r(bx - hw)} ${r(-h * 0.5)} ${r(tipX - curl)} ${r(-h * 0.8)} ${r(tipX)} ${r(-h)}C${r(tipX + curl * 0.4)} ${r(-h * 0.7)} ${r(bx + hw)} ${r(-h * 0.45)} ${r(bx + hw)} 0Z`;
        return (
          <g key={bx}>
            <path d={d} className={`${fill} ${debrisOutline}`} />
            <path
              d={`M${r(bx - hw * 0.2)} ${r(-h * 0.15)}Q${r(bx - hw * 0.3)} ${r(-h * 0.45)} ${r(tipX - curl * 0.6)} ${r(-h * 0.7)}`}
              className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*0.5)]"
              strokeOpacity={0.45}
              strokeLinecap="round"
            />
          </g>
        );
      })}
    </g>
  );
}
