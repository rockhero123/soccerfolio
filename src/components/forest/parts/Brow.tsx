import { noStroke } from "./ink";

type BrowProps = {
  /** Inner end (towards the nose) and outer end of the brow. */
  from: [number, number];
  to: [number, number];
  /** Thickness at the inner end; it tapers to a point at the outer end. */
  thick?: number;
};

const n = (v: number) => Math.round(v * 10) / 10;

/** A thick, tapered ink brow: slant it down to the nose for rage, up for terror. */
export default function Brow({ from, to, thick = 5 }: BrowProps) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const len = Math.hypot(x2 - x1, y2 - y1);
  const [nx, ny] = [-(y2 - y1) / len, (x2 - x1) / len];
  const h = thick / 2;
  const mx = (x1 + x2) / 2 + nx * h * 1.4;
  const my = (y1 + y2) / 2 + ny * h * 1.4 - 2;
  return (
    <path
      data-part="brow"
      d={`M${n(x1 + nx * h)} ${n(y1 + ny * h)}Q${n(mx)} ${n(my)} ${n(x2)} ${n(y2)}Q${n(mx - nx * thick)} ${n(my - ny * thick)} ${n(x1 - nx * h)} ${n(y1 - ny * h)}Z`}
      className={`fill-ink ${noStroke}`}
    />
  );
}
