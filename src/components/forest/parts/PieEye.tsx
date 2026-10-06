import { detail, noStroke } from "./ink";

type PieEyeProps = {
  cx: number;
  cy: number;
  /** Radii of the eye white. */
  rx: number;
  ry: number;
  /** Where the pupil looks, as an offset in SVG units. */
  look?: [number, number];
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const n = (v: number) => Math.round(v * 10) / 10;

/**
 * A classic 1930s "pie-cut" eye: a big parchment eye white and a black oval
 * pupil with a wedge cut out of it, which reads as the shine.
 */
export default function PieEye({ cx, cy, rx, ry, look = [0, 0] }: PieEyeProps) {
  const px = cx + look[0];
  const py = cy + look[1];
  const prx = rx * 0.58;
  const pry = ry * 0.66;
  const at = (deg: number) =>
    `${n(px + prx * Math.cos(rad(deg)))} ${n(py + pry * Math.sin(rad(deg)))}`;
  return (
    <g data-part="pie-eye">
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className={`fill-parchment ${detail}`}
      />
      <path
        d={`M${n(px)} ${n(py)}L${at(-25)}A${n(prx)} ${n(pry)} 0 1 1 ${at(-70)}Z`}
        className={`fill-ink ${noStroke}`}
      />
    </g>
  );
}
