import { fromRows, sprite } from "../pixel/canvas";

/** A round nail head with a light glint (4 × 4). */
export const NAIL = sprite(
  fromRows([".kk.", "kwsk", "kssk", ".kk."], {
    k: "wood-900",
    w: "stone-200",
    s: "stone-500",
  }),
);

/** A dark knot in the wood grain (6 × 3). */
export const KNOT = sprite(
  fromRows([".aaaa.", "abkkba", ".aaaa."], {
    a: "wood-400",
    b: "wood-500",
    k: "wood-700",
  }),
);
