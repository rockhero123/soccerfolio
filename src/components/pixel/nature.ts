import { PixelCanvas, rng, type Clump, type Token } from "./canvas";

/**
 * Procedural pixel-art nature for the enchanted forest (spec 001 US-2):
 * Stardew-like oaks, pines, bushes, flowers, rocks and the forest floor.
 * Light always comes from the top left. Every piece is seeded, so it is the
 * same on every render.
 */

/** Leaf ramp of broad-leaved trees and bushes, dark → light. */
export const LEAF: readonly Token[] = [
  "leaf-800",
  "leaf-700",
  "leaf-600",
  "leaf-500",
  "leaf-400",
  "leaf-300",
];
/** A darker, bluer ramp for pines and far trees. */
export const PINE: readonly Token[] = [
  "leaf-900",
  "leaf-800",
  "leaf-700",
  "leaf-600",
  "leaf-500",
];
/** Autumn-touched ramp, for a few warm accents in the canopy. */
export const AUTUMN: readonly Token[] = [
  "wood-700",
  "wood-500",
  "wood-400",
  "gold-600",
  "gold-500",
  "gold-400",
];

/** A trunk with bark shading, roots and grooves. */
function trunk(
  c: PixelCanvas,
  x: number,
  top: number,
  bottom: number,
  w: number,
  rand: () => number,
) {
  for (let y = top; y <= bottom; y++) {
    for (let i = 0; i < w; i++) {
      const share = i / (w - 1);
      const token =
        share < 0.25 ? "wood-500" : share < 0.6 ? "wood-600" : "wood-700";
      c.set(x + i, y, token);
    }
    // Bark grooves.
    if (rand() > 0.55) c.set(x + 1 + Math.floor(rand() * (w - 2)), y, "wood-800");
  }
  // Roots spreading at the base.
  c.rect(x - 1, bottom - 1, 1, 2, "wood-600").set(x - 2, bottom, "wood-700");
  c.rect(x + w, bottom - 1, 1, 2, "wood-700").set(x + w + 1, bottom, "wood-800");
}

/**
 * A broad-leaved tree seen from the front-top: a round, clumpy crown on a
 * short trunk. Returns its own canvas (outlined), `size` ≈ crown radius.
 */
export function oak(seed: number, size = 12, ramp: readonly Token[] = LEAF) {
  const rand = rng(seed);
  const w = size * 2 + 8;
  const crownY = size + 2;
  const h = crownY + size + 12;
  const cx = w / 2;
  const wood = new PixelCanvas(w, h);
  const tw = Math.max(4, Math.round(size / 2));
  trunk(wood, Math.round(cx - tw / 2), crownY, h - 2, tw, rand);
  wood.outline("wood-900");

  const crown = new PixelCanvas(w, h);
  const clumps: Clump[] = [];
  const count = 5 + Math.floor(rand() * 3);
  // Back clumps first (top), front clumps last (bottom), so rims fall downward.
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rand() * 0.6;
    const d = size * (0.45 + rand() * 0.15);
    clumps.push({
      x: cx + Math.cos(a) * d,
      y: crownY + Math.sin(a) * d * 0.85,
      r: size * (0.48 + rand() * 0.14),
    });
  }
  clumps.sort((p, q) => p.y - q.y);
  clumps.splice(Math.floor(clumps.length / 2), 0, {
    x: cx,
    y: crownY - 1,
    r: size * 0.62,
  });
  crown.clumps(clumps, ramp, seed + 1);
  crown.outline("leaf-900");
  return wood.draw(crown);
}

/** A pine: stacked, drooping tiers of needles on a thin trunk. */
export function pine(seed: number, size = 12) {
  const rand = rng(seed);
  const w = size * 2 + 4;
  const h = Math.round(size * 3.2) + 6;
  const cx = Math.floor(w / 2);
  const c = new PixelCanvas(w, h);
  trunk(c, cx - 1, h - 8, h - 2, 3, rand);
  c.outline("wood-900");
  const tree = new PixelCanvas(w, h);
  const tiers = 4;
  for (let t = 0; t < tiers; t++) {
    const top = 1 + Math.round((t * (h - 10)) / (tiers + 0.6));
    const tierH = Math.round(size * 1.15);
    for (let j = 0; j < tierH; j++) {
      const half = Math.round(((j + 1) / tierH) * (size * (0.45 + t * 0.17)));
      for (let i = -half; i <= half; i++) {
        const lit = -i / (half + 1) - j / tierH + 0.6;
        const level = Math.round(
          Math.max(0, Math.min(1, lit + (rand() - 0.5) * 0.3)) * (PINE.length - 1),
        );
        tree.set(cx + i, top + j, PINE[level]);
      }
      // Drooping tips at the tier's edge.
      if (j === tierH - 1) {
        tree.set(cx - half - 1, top + j + 1, PINE[1]);
        tree.set(cx + half + 1, top + j + 1, PINE[0]);
      }
    }
  }
  tree.outline("leaf-900");
  return c.draw(tree);
}

/** A round bush, optionally dotted with flowers or berries. */
export function bush(
  seed: number,
  size = 8,
  flowers: readonly Token[] = [],
  ramp: readonly Token[] = LEAF,
) {
  const rand = rng(seed);
  const w = size * 3 + 4;
  const h = size * 2 + 4;
  const c = new PixelCanvas(w, h);
  const clumps: Clump[] = [];
  for (let i = 0; i < 4; i++) {
    clumps.push({
      x: size + 2 + i * size * 0.33 + rand() * 2,
      y: size + 2 - (i % 2) * 2 + rand() * 2,
      r: size * (0.6 + rand() * 0.3),
    });
  }
  c.clumps(clumps, ramp, seed + 3);
  for (let i = 0; i < flowers.length * 3; i++) {
    const x = Math.round(3 + rand() * (w - 6));
    const y = Math.round(3 + rand() * (h - 8));
    if (!c.get(x, y) || !c.get(x + 1, y + 1)) continue;
    const petal = flowers[i % flowers.length];
    c.set(x, y, petal).set(x + 1, y, petal).set(x, y + 1, petal);
    c.set(x + 1, y + 1, "gold-400");
  }
  c.outline("leaf-900");
  return c;
}

/** A mossy rock. */
export function rock(seed: number, size = 5) {
  const rand = rng(seed);
  const c = new PixelCanvas(size * 2 + 4, size + 5);
  const cx = size + 2;
  const cy = Math.ceil(size * 0.6) + 2;
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++) {
      const dx = (x - cx) / (size + 0.3);
      const dy = (y - cy) / (size * 0.62 + 0.3);
      const d = dx * dx + dy * dy;
      if (d > 1) continue;
      const lit = -dx * 0.5 - dy * 0.8 + (rand() - 0.5) * 0.25;
      const token =
        lit > 0.45
          ? "stone-300"
          : lit > 0.05
            ? "stone-400"
            : lit > -0.4
              ? "stone-500"
              : "stone-600";
      c.set(x, y, token);
    }
  // Moss on top.
  for (let i = 0; i < size; i++) {
    const x = Math.round(cx - size / 2 + rand() * size);
    for (let y = 0; y < c.height; y++)
      if (c.get(x, y)) {
        c.set(x, y, rand() > 0.5 ? "leaf-400" : "leaf-500");
        break;
      }
  }
  c.outline("stone-800");
  return c;
}

/** Paints a small flower (petals + heart) centred on (x, y). */
export function flower(
  c: PixelCanvas,
  x: number,
  y: number,
  petal: Token,
  heart: Token = "gold-500",
) {
  c.set(x, y - 1, petal).set(x - 1, y, petal).set(x + 1, y, petal).set(x, y + 1, petal);
  c.set(x, y, heart);
  c.set(x, y + 2, "leaf-700");
}

/** Paints a little V-shaped tuft of grass whose root is at (x, y). */
export function tuft(
  c: PixelCanvas,
  x: number,
  y: number,
  dark: Token,
  light: Token,
) {
  c.set(x, y, dark).set(x, y - 1, light);
  c.set(x - 1, y - 1, dark).set(x - 2, y - 2, light);
  c.set(x + 1, y - 1, dark).set(x + 2, y - 2, light);
}

const FLOWER_COLOURS: readonly Token[] = [
  "pink-300",
  "paper-100",
  "gold-500",
  "violet-400",
  "red-500",
];

/**
 * The forest floor: a tileable patch of shaded, darker grass with tufts,
 * flowers, pebbles and fallen leaves.
 */
export function forestFloor(size: number, seed: number) {
  const rand = rng(seed);
  const c = new PixelCanvas(size, size, { wrapX: true, wrapY: true });
  c.rect(0, 0, size, size, "leaf-600");
  // Soft patches of lighter and darker grass.
  for (let i = 0; i < 9; i++) {
    const token = i % 3 === 0 ? "leaf-700" : "leaf-500";
    const x = rand() * size;
    const y = rand() * size;
    const r = 3 + rand() * 6;
    for (let j = -r; j <= r; j++)
      for (let k = -r; k <= r; k++)
        if (j * j + k * k * 1.6 <= r * r && rand() > 0.25)
          c.set(x + j, y + k, token);
  }
  for (let i = 0; i < size / 3; i++)
    tuft(c, rand() * size, rand() * size, "leaf-700", "leaf-400");
  for (let i = 0; i < size / 8; i++) {
    const colour = FLOWER_COLOURS[Math.floor(rand() * FLOWER_COLOURS.length)];
    flower(c, Math.round(rand() * size), Math.round(rand() * size), colour);
  }
  for (let i = 0; i < size / 16; i++) {
    const x = Math.round(rand() * size);
    const y = Math.round(rand() * size);
    c.set(x, y, "stone-300").set(x + 1, y, "stone-400").set(x, y + 1, "leaf-800");
  }
  for (let i = 0; i < size / 16; i++) {
    const x = Math.round(rand() * size);
    const y = Math.round(rand() * size);
    c.set(x, y, "wood-400").set(x + 1, y, "wood-300").set(x + 1, y + 1, "wood-500");
  }
  return c;
}

type Placed = { art: PixelCanvas; x: number; y: number; flip?: boolean };

/** Draws pieces onto a tile back to front (by their foot), with ground shadows. */
export function scatter(c: PixelCanvas, pieces: Placed[]) {
  pieces
    .sort((p, q) => p.y + p.art.height - (q.y + q.art.height))
    .forEach(({ art, x, y, flip }) => {
      // A soft shadow under the piece's foot.
      const footY = y + art.height - 2;
      const half = art.width * 0.32;
      for (let i = -half; i <= half; i++)
        for (let j = -1; j <= 1; j++)
          if (c.get(x + art.width / 2 + i, footY + j) !== undefined)
            c.set(x + art.width / 2 + i, footY + j, "leaf-800");
      c.draw(art, Math.round(x), Math.round(y), { flip });
    });
  return c;
}
