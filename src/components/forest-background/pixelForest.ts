import { PixelCanvas, rng, sprite } from "../pixel/canvas";
import {
  AUTUMN,
  LEAF,
  bush,
  forestFloor,
  oak,
  pine,
  rock,
  scatter,
} from "../pixel/nature";

/**
 * The pixel-art enchanted forest (spec 001 US-2), as repeating tiles in art
 * pixels. Three depth layers, back to front: dark understory and far pines,
 * the main row of oaks and pines, and bushes, rocks and flowers in front.
 */

const FLOOR = forestFloor(64, 5);

/** Covers a tile with the forest floor. */
function floorUnder(c: PixelCanvas) {
  for (let y = 0; y < c.height; y += FLOOR.height)
    for (let x = 0; x < c.width; x += FLOOR.width) c.draw(FLOOR, x, y);
}

const FLOWERS = ["pink-300", "paper-100", "red-500", "violet-400"] as const;

/** A random tree of the forest, mostly oaks, some pines, a few autumn oaks. */
function anyTree(rand: () => number, seed: number, size: number) {
  const pick = rand();
  if (pick < 0.3) return pine(seed, Math.round(size * 0.85));
  if (pick < 0.4) return oak(seed, size, AUTUMN);
  return oak(seed, size, LEAF);
}

/** Size of the side tile, in art pixels. x = 0 is the outer page edge. */
export const SIDE_TILE = { width: 96, height: 168 } as const;

function sideTile() {
  const { width, height } = SIDE_TILE;
  const rand = rng(41);
  const c = new PixelCanvas(width, height, { wrapY: true });
  floorUnder(c);
  // Far layer: a dark wall of shade along the outer edge.
  c.rect(0, 0, 10, height, "leaf-900");
  for (let y = 0; y < height; y++)
    for (let x = 10; x < 18; x++)
      if (rand() < (18 - x) / 9) c.set(x, y, "leaf-900");

  const pieces: Parameters<typeof scatter>[1] = [];
  // Main layer: a thick row of trees along the outer edge…
  for (let y = -10, i = 0; y < height - 10; y += 24 + rand() * 8, i++) {
    const tree = anyTree(rand, 100 + i, 11 + Math.floor(rand() * 5));
    pieces.push({ art: tree, x: -8 + rand() * 12, y, flip: rand() > 0.5 });
  }
  // …and a looser second row further in.
  for (let y = 4, i = 0; y < height - 10; y += 38 + rand() * 14, i++) {
    const tree = anyTree(rand, 200 + i, 9 + Math.floor(rand() * 4));
    pieces.push({ art: tree, x: 26 + rand() * 18, y, flip: rand() > 0.5 });
  }
  // Near layer: bushes, flowering bushes and mossy rocks by the field.
  for (let y = 0, i = 0; y < height; y += 22 + rand() * 18, i++) {
    const kind = rand();
    const art =
      kind < 0.55
        ? bush(300 + i, 6 + Math.floor(rand() * 3), rand() > 0.4 ? [FLOWERS[i % 4]] : [])
        : rock(300 + i, 4 + Math.floor(rand() * 3));
    pieces.push({ art, x: 56 + rand() * 30, y });
  }
  scatter(c, pieces);
  return sprite(c);
}

/** Size of the top and bottom band tiles, in art pixels. */
export const BAND_TILE = { width: 176, height: 72 } as const;

/**
 * A band of forest along the top or bottom of the page: a row of trees at the
 * outer edge, then a strip of forest floor with bushes and rocks toward the field.
 */
function bandTile(edge: "top" | "bottom", seed: number) {
  const { width, height } = BAND_TILE;
  const rand = rng(seed);
  const c = new PixelCanvas(width, height, { wrapX: true });
  floorUnder(c);
  const pieces: Parameters<typeof scatter>[1] = [];
  const treeY = (art: PixelCanvas) =>
    edge === "top" ? -art.height * 0.45 + rand() * 4 : height - art.height * 0.62 + rand() * 4;
  if (edge === "top") c.rect(0, 0, width, 6, "leaf-900");
  else c.rect(0, height - 8, width, 8, "leaf-900");
  for (let x = -6, i = 0; x < width; x += 15 + rand() * 9, i++) {
    const art = anyTree(rand, seed * 10 + i, 10 + Math.floor(rand() * 5));
    pieces.push({ art, x, y: treeY(art), flip: rand() > 0.5 });
  }
  for (let x = 4, i = 0; x < width - 8; x += 26 + rand() * 22, i++) {
    // Every third piece is a mossy rock; the others are (flowering) bushes.
    const art =
      i % 3 === 2
        ? rock(seed * 20 + i, 4)
        : bush(seed * 20 + i, 5 + Math.floor(rand() * 3), rand() > 0.5 ? [FLOWERS[i % 4]] : []);
    const y = edge === "top" ? 26 + rand() * 6 : 8 + rand() * 6;
    pieces.push({ art, x, y });
  }
  scatter(c, pieces);
  return sprite(c);
}

export const FOREST = {
  side: sideTile(),
  top: bandTile("top", 3),
  bottom: bandTile("bottom", 58),
} as const;
