import { useId } from "react";
import { detail, noStroke } from "./ink";

type MawProps = {
  /** Centre of the mouth corners' line. */
  cx: number;
  cy: number;
  /** Width between the mouth corners. */
  width: number;
  /** How far the upper lip dips (positive) or arches (negative) at the middle. */
  curve: number;
  /** How wide the jaw hangs open below the upper lip, at the middle. */
  open: number;
  /** Number of sharp teeth on the upper and lower jaw. */
  teeth?: [number, number];
  /** Tooth length, in SVG units. */
  fang?: number;
  /** A lolling red tongue at the bottom of the mouth. */
  tongue?: boolean;
};

type Pt = [number, number];

/** Teeth get a hairline outline, so small teeth stay parchment instead of all ink. */
const toothLine = "[stroke-width:calc(var(--stroke-width-outline)*0.3)]";
const n = (v: number) => Math.round(v * 10) / 10;
/** A point on a quadratic Bézier curve at `t`. */
const bez = (a: Pt, c: Pt, b: Pt, t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t ** 2 * b[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t ** 2 * b[1],
];

/**
 * A gaping, fanged cartoon mouth: an ink-dark maw with rows of sharp parchment
 * teeth along both lips and an optional tongue. From a toothy sneer (small
 * `open`) to a horrified scream (large `open`, no teeth).
 */
export default function Maw({
  cx,
  cy,
  width,
  curve,
  open,
  teeth = [0, 0],
  fang = 6,
  tongue = false,
}: MawProps) {
  const clipId = `maw-${useId().replace(/[^\w-]/g, "")}`;
  const left: Pt = [cx - width / 2, cy];
  const right: Pt = [cx + width / 2, cy];
  const upper: Pt = [cx, cy + curve];
  const lower: Pt = [cx, cy + curve + open * 2];
  const shape = `M${n(left[0])} ${n(left[1])}Q${n(upper[0])} ${n(upper[1])} ${n(right[0])} ${n(right[1])}Q${n(lower[0])} ${n(lower[1])} ${n(left[0])} ${n(left[1])}Z`;

  /** Triangular teeth along a lip, pointing into the mouth. */
  const row = (count: number, control: Pt, dir: 1 | -1) =>
    Array.from({ length: count }, (_, i) => {
      const t0 = 0.08 + (0.84 * i) / count;
      const t1 = 0.08 + (0.84 * (i + 1)) / count;
      const a = bez(left, control, right, t0);
      const b = bez(left, control, right, t1);
      const tip = bez(left, control, right, (t0 + t1) / 2);
      // Teeth near the middle are longest, like fangs.
      const len = fang * (0.65 + 0.35 * Math.sin(((t0 + t1) / 2) * Math.PI));
      return `M${n(a[0])} ${n(a[1] - dir)}L${n(tip[0])} ${n(tip[1] + dir * len)}L${n(b[0])} ${n(b[1] - dir)}Z`;
    }).join("");

  return (
    <g data-part="maw">
      <defs>
        <clipPath id={clipId}>
          <path d={shape} />
        </clipPath>
      </defs>
      <path d={shape} className={`fill-ink ${noStroke}`} />
      <g clipPath={`url(#${clipId})`}>
        {tongue && (
          <ellipse
            data-part="tongue"
            cx={cx + width * 0.08}
            cy={cy + curve + open * 1.15}
            rx={width * 0.24}
            ry={open * 0.55 + 2}
            className={`fill-cartoon-red ${detail}`}
          />
        )}
        {teeth[0] > 0 && (
          <path
            data-part="teeth"
            d={row(teeth[0], upper, 1)}
            className={`fill-parchment ${toothLine}`}
          />
        )}
        {teeth[1] > 0 && (
          <path
            data-part="teeth"
            d={row(teeth[1], lower, -1)}
            className={`fill-parchment ${toothLine}`}
          />
        )}
      </g>
      <path d={shape} className="fill-none" />
    </g>
  );
}
