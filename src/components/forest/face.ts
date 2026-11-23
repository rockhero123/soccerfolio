import type { PixelCanvas, Token } from "../pixel/canvas";

/**
 * Pixel-art face parts for the forest characters (spec 001 US-4): big, round
 * eyes with a "pie-cut" notch in the pupil (a nod to the rubber-hose eyes of
 * the first design), brows, toothy grins and blushing cheeks.
 */

type EyeOptions = {
  /** Size of the white of the eye. */
  w?: number;
  h?: number;
  /** Where the pupil looks: -1 left, 0 centre, 1 right. */
  look?: -1 | 0 | 1;
  /** A brow over the eye: angry (slanting in), worried (slanting out) or none. */
  brow?: "angry" | "worried" | "none";
  /** Which side of the face (mirrors the brow). */
  side?: "left" | "right";
  /** Eye outline colour. */
  rim?: Token;
};

/** A big eye at (x, y) (its top-left corner), with a pie-cut pupil and a glint. */
export function eye(
  c: PixelCanvas,
  x: number,
  y: number,
  { w = 4, h = 5, look = 0, brow = "none", side = "left", rim = "ink" }: EyeOptions = {},
) {
  // White with a rim, corners cut so it reads round.
  c.rect(x, y, w, h, "paper-100");
  c.rect(x + 1, y - 1, w - 2, 1, rim).rect(x + 1, y + h, w - 2, 1, rim);
  c.rect(x - 1, y + 1, 1, h - 2, rim).rect(x + w, y + 1, 1, h - 2, rim);
  c.set(x, y, rim).set(x + w - 1, y, rim).set(x, y + h - 1, rim).set(x + w - 1, y + h - 1, rim);
  // Pupil (2 wide, most of the height), shifted by `look`.
  const px = x + Math.floor((w - 2) / 2) + (look > 0 ? 1 : look < 0 ? -1 : 0) * Math.max(0, Math.floor((w - 2) / 2));
  const py = y + Math.max(1, Math.floor(h / 2) - 1);
  const ph = Math.max(2, h - 2);
  c.rect(px, py, 2, ph, "ink");
  // The pie-cut: a wedge of white bitten out of the pupil, and a glint.
  c.set(px + 1, py, "paper-100");
  if (brow === "angry") {
    // Brow slants down towards the nose.
    const inner = side === "left" ? x + w - 1 : x;
    const outer = side === "left" ? x : x + w - 1;
    c.line(outer, y - 2, inner, y, rim);
    c.line(outer, y - 3, inner, y - 1, rim);
  } else if (brow === "worried") {
    const inner = side === "left" ? x + w - 1 : x;
    const outer = side === "left" ? x : x + w - 1;
    c.line(inner, y - 3, outer, y - 1, rim);
  }
}

/** A pair of eyes, `gap` pixels apart, mirrored brows. */
export function eyes(
  c: PixelCanvas,
  x: number,
  y: number,
  gap: number,
  options: EyeOptions = {},
) {
  const w = options.w ?? 4;
  eye(c, x, y, { ...options, side: "left" });
  eye(c, x + w + gap, y, { ...options, side: "right" });
}

/** A wide, toothy rubber-hose grin, `w` pixels wide, top-left at (x, y). */
export function grin(c: PixelCanvas, x: number, y: number, w: number, lip: Token = "ink") {
  c.rect(x + 1, y, w - 2, 1, lip);
  c.rect(x, y + 1, w, 2, "paper-100");
  for (let i = 2; i < w - 1; i += 2) c.set(x + i, y + 1, "stone-400");
  c.rect(x + 1, y + 3, w - 2, 1, lip);
  c.set(x - 1, y, lip).set(x + w, y, lip).set(x, y + 1, lip).set(x + w - 1, y + 1, lip);
  c.set(x, y + 2, lip).set(x + w - 1, y + 2, lip);
}

/** A small open smile: a dark mouth with a red tongue. */
export function smile(c: PixelCanvas, x: number, y: number, w: number) {
  c.set(x, y, "ink").set(x + w - 1, y, "ink");
  c.rect(x + 1, y + 1, w - 2, 1, "ink");
  if (w > 3) c.rect(x + 1, y + 1, w - 2, 1, "red-800").rect(x + 2, y + 2, w - 4, 1, "ink");
  if (w > 4) c.set(x + Math.floor(w / 2), y + 1, "red-500");
}

/** Two blushing cheek pixels. */
export function cheeks(c: PixelCanvas, x1: number, x2: number, y: number) {
  c.rect(x1, y, 2, 1, "pink-500").rect(x2, y, 2, 1, "pink-500");
}
