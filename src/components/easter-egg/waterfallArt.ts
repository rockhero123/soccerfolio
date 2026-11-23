import { PixelCanvas, rng, sprite, type Token } from "../pixel/canvas";
import { LEAF, bush, rock } from "../pixel/nature";
import { SCENE_H } from "./waterfallSize";

/**
 * The easter egg's waterfall (spec 900 US-1) as pixel art. The static parts
 * (cliffs, ledges, rocks, plants) are sprites; the moving water is drawn by
 * `Waterfall` with animated pixel patterns, behind holes in the rock sprite.
 */

export { SCENE_H };

/** The cascade in the middle: its size and the water it shows, in art pixels. */
export const FALLS = {
  width: 128,
  /** Falling sheets per tier: [x, y, width, height]. */
  sheets: [
    [30, 0, 68, 19],
    [20, 22, 88, 14],
    [10, 39, 108, 10],
  ],
  /** Flat, sideways-running water between the tiers and in the pool. */
  flats: [
    [22, 18, 84, 5],
    [12, 35, 104, 5],
    [4, 48, 120, 9],
  ],
} as const satisfies {
  width: number;
  sheets: readonly (readonly [number, number, number, number])[];
  flats: readonly (readonly [number, number, number, number])[];
};

/**
 * Mossy cliff wall: irregular, rounded stone blocks of different sizes, each lit
 * from the top left, with dark cracks between them, moss and hanging plants.
 */
function cliffWall(c: PixelCanvas, x0: number, x1: number, bottom: number, seed: number) {
  const rand = rng(seed);
  c.rect(x0, 0, x1 - x0, bottom, "stone-800");
  // Courses of uneven height; blocks of uneven width, offset course to course.
  for (let y = -2; y < bottom; ) {
    const h = 5 + Math.floor(rand() * 4);
    for (let x = x0 - Math.floor(rand() * 8); x < x1; ) {
      const w = 6 + Math.floor(rand() * 9);
      for (let j = 0; j < h - 1; j++)
        for (let i = 0; i < w - 1; i++) {
          // Rounded corners, so the blocks read as worn rocks, not bricks.
          const corner = (i === 0 || i === w - 2) && (j === 0 || j === h - 2);
          if (corner) continue;
          const lit = i / w + j / h;
          const token =
            j === 0 || i === 0
              ? "stone-400"
              : lit < 0.7
                ? "stone-500"
                : lit < 1.4
                  ? rand() > 0.9 ? "stone-500" : "stone-600"
                  : "stone-700";
          c.set(x + i, y + j, token);
        }
      x += w;
    }
    y += h;
  }
  // Moss spilling over the stones.
  for (let i = 0; i < (x1 - x0) / 3; i++) {
    const x = x0 + Math.floor(rand() * (x1 - x0));
    const y = Math.floor(rand() * bottom);
    const len = 1 + Math.floor(rand() * 4);
    for (let k = 0; k < len; k++) c.tint(x + k, y, k % 2 ? "leaf-500" : "leaf-600");
    c.tint(x + 1, y + 1, "leaf-700");
  }
}

/** Width of the side cliff tile (repeats sideways), in art pixels. */
export const CLIFF_TILE_W = 64;

/** The cliffs on both sides of the falls, tileable sideways. */
export const CLIFF_TILE = (() => {
  const w = CLIFF_TILE_W;
  const c = new PixelCanvas(w, SCENE_H, { wrapX: true });
  cliffWall(c, 0, w, 42, 12);
  const rand = rng(13);
  // Jungle canopy hanging over the top of the cliff.
  for (let x = -6, i = 0; x < w; x += 12 + Math.floor(rand() * 6), i++)
    c.draw(bush(500 + i, 6 + Math.floor(rand() * 3), [], LEAF), x, -6 + Math.floor(rand() * 3));
  // Boulders and grass along the foot of the cliff, where it meets the field.
  for (let x = -4, i = 0; x < w; x += 9 + Math.floor(rand() * 6), i++) {
    const r = rock(600 + i, 4 + Math.floor(rand() * 3));
    c.draw(r, x, 46 - r.height + 6 + Math.floor(rand() * 3));
  }
  for (let x = 2, i = 0; x < w; x += 16 + Math.floor(rand() * 10), i++)
    c.draw(bush(700 + i, 4, i % 2 ? ["pink-300"] : []), x, 40 + Math.floor(rand() * 4));
  return sprite(c);
})();

/**
 * The rock frame of the cascade: cliff faces beside every tier, ledge
 * boulders between tiers and the stony rim of the pool. The water areas
 * (`FALLS.sheets` / `FALLS.flats`) are left transparent, so the animated water
 * shows through.
 */
export const FALLS_ROCKS = (() => {
  const { width, sheets, flats } = FALLS;
  const c = new PixelCanvas(width, SCENE_H);
  cliffWall(c, 0, width, 48, 31);
  // Cut the water out of the wall.
  for (const [x, y, w, h] of [...sheets, ...flats])
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) c.set(x + i, y + j, undefined);
  const rand = rng(37);
  // Dark wet edges where the wall meets the water.
  for (const [x, y, w, h] of sheets) {
    c.rect(x - 1, y, 1, h, "stone-900").rect(x + w, y, 1, h, "stone-800");
  }
  // Ledge boulders sitting on the lip of each tier, and stones in the pool rim.
  const ledges: [number, number, number][] = [
    [34, 14, 4], [58, 13, 4], [82, 14, 4],
    [24, 31, 4], [52, 31, 5], [80, 31, 4], [100, 31, 4],
    [4, 52, 5], [30, 55, 4], [92, 55, 4], [114, 52, 5],
  ];
  ledges.forEach(([x, y, size], i) => {
    const r = rock(800 + i, size);
    c.draw(r, x - r.width / 2, y);
  });
  // Ferns and leaves tucked into the rock cracks.
  for (let i = 0; i < 6; i++) {
    const b = bush(900 + i, 3 + Math.floor(rand() * 2), i % 3 === 0 ? ["gold-500"] : []);
    c.draw(b, i < 3 ? 2 + i * 4 : width - 12 - (i - 3) * 4, 6 + i * 7);
  }
  return sprite(c);
})();

/** Falling-water tile: streaks of light and foam running down (8 × 16). */
export const FALL_TILE = (() => {
  const c = new PixelCanvas(8, 16, { wrapX: true, wrapY: true });
  const rand = rng(51);
  for (let x = 0; x < 8; x++) {
    const base: Token = x % 3 === 0 ? "water-400" : x % 3 === 1 ? "water-500" : "water-300";
    c.rect(x, 0, 1, 16, base);
    const start = Math.floor(rand() * 16);
    const len = 3 + Math.floor(rand() * 6);
    for (let k = 0; k < len; k++) c.set(x, start + k, k === 0 ? "water-200" : "water-300");
  }
  return sprite(c);
})();

/** Flat-water tile: ripples running sideways (16 × 6). */
export const FLAT_TILE = (() => {
  const c = new PixelCanvas(16, 6, { wrapX: true, wrapY: true });
  c.rect(0, 0, 16, 6, "water-500");
  c.rect(0, 0, 16, 1, "water-300");
  c.rect(2, 2, 5, 1, "water-300").rect(10, 4, 4, 1, "water-400").rect(11, 2, 2, 1, "water-200");
  return sprite(c);
})();

/** Foam along the foot of a fall: white bubbles (16 × 3). */
export const FOAM_TILE = (() => {
  const c = new PixelCanvas(16, 3, { wrapX: true });
  c.stamp(
    [
      ".ww..w.www..ww.w",
      "wwwwwwwwwwwwwwww",
      "w.bw.ww.b.www.bw",
    ],
    { w: "paper-100", b: "water-200" },
  );
  return sprite(c);
})();

/** A leaf and a stick floating on the water. */
export const FLOATING = {
  leaf: sprite(
    new PixelCanvas(5, 4).stamp(["..ee.", ".effe", "efvf.", ".ev.."], {
      e: "red-700",
      f: "red-500",
      v: "gold-400",
    }),
  ),
  stick: sprite(
    new PixelCanvas(8, 3).stamp(["......w.", "wwwwwww.", ".kkk.kkk"], {
      w: "wood-500",
      k: "wood-700",
    }),
  ),
  greenLeaf: sprite(
    new PixelCanvas(5, 4).stamp(["..ee.", ".effe", "efvf.", ".ev.."], {
      e: "leaf-700",
      f: "leaf-400",
      v: "leaf-200",
    }),
  ),
} as const;
