import { useId } from "react";
import { detail, noStroke } from "./ink";

type PieEyeProps = {
  cx: number;
  cy: number;
  /** Radii of the eye white. */
  rx: number;
  ry: number;
  /** Where the pupil looks, as an offset in SVG units. */
  look?: [number, number];
  /** Pupil size as a share of the eye: small values give a manic, pinprick stare. */
  pupil?: number;
  /**
   * A heavy lid across the top of the eye, tilted by `angle` degrees
   * (negative tilts down towards the nose on the left eye: a scowl).
   * `drop` is how far down the eye it reaches, as a share of the eye height.
   */
  lid?: { angle: number; drop?: number; fill?: string };
  /** Bloodshot veins creeping in from the rim. */
  veins?: boolean;
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const n = (v: number) => Math.round(v * 10) / 10;

/**
 * A classic 1930s "pie-cut" eye: a big parchment eye white and a black oval
 * pupil with a wedge cut out of it, which reads as the shine. Tiny pupils,
 * scowling lids and bloodshot veins push it towards a Cuphead-boss stare.
 */
export default function PieEye({
  cx,
  cy,
  rx,
  ry,
  look = [0, 0],
  pupil = 0.58,
  lid,
  veins = false,
}: PieEyeProps) {
  const clipId = `eye-${useId().replace(/[^\w-]/g, "")}`;
  const px = cx + look[0];
  const py = cy + look[1];
  const prx = rx * pupil;
  const pry = ry * pupil * 1.14;
  const at = (deg: number) =>
    `${n(px + prx * Math.cos(rad(deg)))} ${n(py + pry * Math.sin(rad(deg)))}`;
  const vein = (deg: number, len: number) => {
    const x = cx + rx * Math.cos(rad(deg));
    const y = cy + ry * Math.sin(rad(deg));
    const ix = cx + rx * (1 - len) * Math.cos(rad(deg + 8));
    const iy = cy + ry * (1 - len) * Math.sin(rad(deg + 8));
    return `M${n(x)} ${n(y)}Q${n((x + ix) / 2 + 1.5)} ${n((y + iy) / 2 - 1.5)} ${n(ix)} ${n(iy)}`;
  };
  return (
    <g data-part="pie-eye">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
        </clipPath>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} className="fill-parchment" />
      <g clipPath={`url(#${clipId})`}>
        {veins && (
          <path
            data-part="veins"
            d={[
              vein(150, 0.45),
              vein(200, 0.38),
              vein(-20, 0.42),
              vein(30, 0.35),
            ].join("")}
            className="fill-none stroke-cartoon-red [stroke-width:calc(var(--stroke-width-outline)*0.4)]"
          />
        )}
        <path
          d={`M${n(px)} ${n(py)}L${at(-25)}A${n(prx)} ${n(pry)} 0 1 1 ${at(-70)}Z`}
          className={`fill-ink ${noStroke}`}
        />
        {lid && (
          <rect
            data-part="lid"
            x={cx - rx * 1.6}
            y={cy - ry * 2.2}
            width={rx * 3.2}
            height={ry * (1.2 + (lid.drop ?? 0.45) * 2)}
            transform={`rotate(${lid.angle} ${cx} ${cy})`}
            className={`${lid.fill ?? "fill-ink"} ${detail}`}
          />
        )}
      </g>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        className={`fill-none ${detail}`}
      />
    </g>
  );
}
