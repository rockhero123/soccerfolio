import { PixelCanvas, sprite, type Token } from "../pixel/canvas";

/**
 * The field markings as pixel art (spec 001 US-3): chalk lines two art pixels
 * wide, in `parchment`. Their crisp drop shadow is added in CSS, so the lines
 * look painted onto the grass.
 */
const CHALK: Token = "paper-100";
const LINE = 2;

/** A ring of 2-pixel thickness, keeping only the pixels `keep` accepts. */
function ring(
  c: PixelCanvas,
  cx: number,
  cy: number,
  r: number,
  keep: (x: number, y: number) => boolean = () => true,
) {
  for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++)
    for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d <= r && d > r - LINE && keep(x, y)) c.set(x, y, CHALK);
    }
}

/** Width and height of a penalty-area drawing, in art pixels. */
export const PENALTY = { width: 96, height: 54, goalDepth: 6 } as const;

/**
 * One end of the field, from the goal line down (the bottom end is mirrored in
 * CSS): the penalty box, goal area, penalty spot and penalty arc, plus the goal
 * — posts and a net — behind the line when `goal` is set.
 */
function penaltyArea(goal: boolean) {
  const { width, height, goalDepth } = PENALTY;
  const c = new PixelCanvas(width, height);
  const top = goalDepth; // y of the goal line
  const boxDepth = 39;
  // The box sides start on the goal line; the boundary line covers its top.
  c.rect(0, top, LINE, boxDepth, CHALK)
    .rect(width - LINE, top, LINE, boxDepth, CHALK)
    .rect(0, top + boxDepth - LINE, width, LINE, CHALK);
  const goalAreaW = 44;
  const gx = (width - goalAreaW) / 2;
  c.rect(gx, top, LINE, 13, CHALK)
    .rect(gx + goalAreaW - LINE, top, LINE, 13, CHALK)
    .rect(gx, top + 11, goalAreaW, LINE, CHALK);
  // Penalty spot (2 × 2) and the arc outside the box.
  const spotY = top + 26;
  c.rect(width / 2 - 1, spotY, 2, 2, CHALK);
  ring(c, width / 2, spotY + 1, 21, (_x, y) => y >= top + boxDepth);
  if (goal) {
    const goalW = 24;
    const x0 = (width - goalW) / 2;
    // Net: a light grid behind the posts.
    for (let y = 0; y < top; y++)
      for (let x = x0; x < x0 + goalW; x++)
        if ((x - x0) % 3 === 0 || y % 3 === 0) c.set(x, y, "stone-300");
    c.rect(x0 - 1, 0, LINE, top, CHALK)
      .rect(x0 + goalW - 1, 0, LINE, top, CHALK)
      .rect(x0 - 1, 0, goalW + LINE, 1, CHALK);
  }
  return sprite(c);
}

export const PENALTY_ART = {
  plain: penaltyArea(false),
  goal: penaltyArea(true),
} as const;

/** The centre circle with its spot (the halfway line is a CSS box). */
export const CENTER_CIRCLE = (() => {
  const size = 48;
  const c = new PixelCanvas(size, size);
  ring(c, size / 2, size / 2, size / 2);
  c.rect(size / 2 - 2, size / 2 - 2, 4, 4, CHALK);
  return sprite(c);
})();

/** A quarter-circle corner arc (top-left; mirrored in CSS for the others). */
export const CORNER_ARC = (() => {
  const c = new PixelCanvas(7, 7);
  ring(c, 0, 0, 7);
  return sprite(c);
})();
