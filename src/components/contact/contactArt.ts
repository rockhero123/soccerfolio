import type { ContactKind } from "@/content/social";
import { PixelCanvas, fromRows, rng, sprite, type Clump } from "../pixel/canvas";
import { LEAF } from "../pixel/nature";

/**
 * Pixel art of the contact board (spec 007 US-1): four small hand-drawn icons
 * in `ink` (9 × 9) and a tileable garland of leaves for the board's foot.
 */

const INK = { k: "ink", w: "paper-100" };

const ROWS: Record<ContactKind, readonly string[]> = {
  // A phone handset, earpiece at the top left.
  phone: [
    ".kk......",
    "kkkk.....",
    "kkk......",
    ".kk......",
    "..kk.....",
    "...kk..k.",
    "....kkkkk",
    ".....kkkk",
    "......kk.",
  ],
  // An envelope with its flap folded down.
  email: [
    ".........",
    "kkkkkkkkk",
    "kk.....kk",
    "k.k...k.k",
    "k..k.k..k",
    "k...k...k",
    "k.......k",
    "kkkkkkkkk",
    ".........",
  ],
  // A rounded "in" badge.
  linkedin: [
    ".kkkkkkk.",
    "kwkkkkkkk",
    "kkkkkkkkk",
    "kwkwwwkkk",
    "kwkwkkwkk",
    "kwkwkkwkk",
    "kwkwkkwkk",
    "kwkwkkwkk",
    ".kkkkkkk.",
  ],
  // A round cat head with ears and eyes, for GitHub.
  github: [
    ".k.....k.",
    ".kk...kk.",
    ".kkkkkkk.",
    "kkkkkkkkk",
    "kkwkkkwkk",
    "kkkkkkkkk",
    ".kkkkkkk.",
    "..kk.kk..",
    "..k...k..",
  ],
};

export const CONTACT_ICONS = Object.fromEntries(
  (Object.keys(ROWS) as ContactKind[]).map((kind) => [
    kind,
    sprite(fromRows(ROWS[kind], INK)),
  ]),
) as Record<ContactKind, ReturnType<typeof sprite>>;

/** One repeating tile of the leaf garland, in art pixels. */
export const GARLAND = { width: 48, height: 12 } as const;

/**
 * Shaded leaf clumps in a row, with a few leaves hanging lower and tiny pink
 * and gold flowers, outlined in the darkest green. Tiles horizontally.
 */
function garland() {
  const { width, height } = GARLAND;
  const rand = rng(71);
  const c = new PixelCanvas(width, height, { wrapX: true });
  const clumps: Clump[] = [];
  for (let x = 2; x < width; x += 7 + Math.floor(rand() * 3))
    clumps.push({ x, y: 4 + rand() * 1.5, r: 3 + rand() * 1.2 });
  // Hanging leaves between the clumps.
  for (let x = 6; x < width; x += 11 + Math.floor(rand() * 4))
    clumps.push({ x, y: 8, r: 1.8 + rand() * 0.6 });
  c.clumps(clumps, LEAF, 72);
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(rand() * width);
    const y = 2 + Math.floor(rand() * 4);
    if (!c.get(x, y)) continue;
    const petal = i % 2 ? "pink-300" : "gold-400";
    c.set(x, y, petal).set(x + 1, y, petal).set(x, y + 1, petal).set(x + 1, y + 1, "paper-100");
  }
  c.outline("leaf-900");
  return sprite(c);
}

export const LEAF_GARLAND = garland();
