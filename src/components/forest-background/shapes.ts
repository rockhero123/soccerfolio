/**
 * Small, deterministic path helpers for the hand-coded forest SVG art.
 * Everything is seeded so server and client render the exact same markup.
 */

/** Seeded PRNG (mulberry32). Returns numbers in [0, 1). */
export function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to one decimal to keep the markup small. */
function n(value: number): number {
  return Math.round(value * 10) / 10;
}

type Point = readonly [number, number];

/**
 * A bumpy "cloud" outline — the classic rubber-hose foliage clump.
 * Points sit on a slightly wobbly ellipse and are joined by scallops that bulge outward.
 */
export function blobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  bumps: number,
  seed: number,
): string {
  const rand = seededRandom(seed);
  const points: Point[] = [];
  for (let i = 0; i < bumps; i++) {
    const angle =
      (i / bumps) * Math.PI * 2 + (rand() - 0.5) * (Math.PI / bumps) * 0.6;
    const k = 0.9 + rand() * 0.14;
    points.push([cx + Math.cos(angle) * rx * k, cy + Math.sin(angle) * ry * k]);
  }
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < bumps; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % bumps];
    const bulge = 1.28 + rand() * 0.18;
    const qx = cx + ((x1 + x2) / 2 - cx) * bulge;
    const qy = cy + ((y1 + y2) / 2 - cy) * bulge;
    d += `Q${n(qx)} ${n(qy)} ${n(x2)} ${n(y2)}`;
  }
  return `${d}Z`;
}

/**
 * A wavy vertical trunk from `top` to `bottom`, centred on `x`.
 * The trunk keeps the same centre at both ends so it tiles vertically,
 * and bulges in the middle for the rubbery look.
 */
export function trunkPath(
  x: number,
  top: number,
  bottom: number,
  width: number,
  sway: number,
): string {
  const half = width / 2;
  const h = bottom - top;
  const y1 = top + h / 3;
  const y2 = top + (2 * h) / 3;
  return [
    `M${n(x - half)} ${n(top)}`,
    `C${n(x - half + sway)} ${n(y1)} ${n(x - half * 1.15 - sway)} ${n(y2)} ${n(x - half)} ${n(bottom)}`,
    `L${n(x + half)} ${n(bottom)}`,
    `C${n(x + half * 1.15 - sway)} ${n(y2)} ${n(x + half + sway)} ${n(y1)} ${n(x + half)} ${n(top)}`,
    "Z",
  ].join("");
}

/** A pointed leaf whose base sits at the origin and tip points up (negative y). */
export function leafPath(length: number, width: number): string {
  const w = width / 2;
  return `M0 0C${n(w * 1.4)} ${n(-length * 0.3)} ${n(w)} ${n(-length * 0.8)} 0 ${n(-length)}C${n(-w * 0.6)} ${n(-length * 0.75)} ${n(-w * 1.5)} ${n(-length * 0.35)} 0 0Z`;
}
