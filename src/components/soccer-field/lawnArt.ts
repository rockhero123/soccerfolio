import { PixelCanvas, rng, sprite, type Token } from "../pixel/canvas";
import { flower, tuft } from "../pixel/nature";

/**
 * Pixel lawns of the field (spec 001 US-3): a tileable patch of mown grass
 * with two-tone mowing stripes, speckled blades and a few tufts, plus a
 * scatter of fallen forest debris on a transparent tile.
 */

type Lawn = {
  /** Mowing stripes: [stripe A, stripe B]. */
  stripes: readonly [Token, Token];
  /** Specks of darker and lighter blades. */
  dark: Token;
  light: Token;
};

const LAWNS = {
  play: { stripes: ["grass-500", "grass-400"], dark: "grass-600", light: "grass-300" },
  contact: { stripes: ["grass-800", "grass-700"], dark: "grass-900", light: "grass-600" },
} as const satisfies Record<string, Lawn>;

export type Zone = keyof typeof LAWNS;

/** Width and stripe height of a lawn tile, in art pixels. */
export const LAWN_TILE = { width: 64, stripe: 16 } as const;

function lawn({ stripes, dark, light }: Lawn, seed: number) {
  const { width, stripe } = LAWN_TILE;
  const rand = rng(seed);
  const c = new PixelCanvas(width, stripe * 2, { wrapX: true, wrapY: true });
  c.rect(0, 0, width, stripe, stripes[0]).rect(0, stripe, width, stripe, stripes[1]);
  // Speckled blades: short vertical dashes of a darker and a lighter green.
  for (let i = 0; i < 90; i++) {
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * stripe * 2);
    const token = rand() > 0.5 ? dark : light;
    c.set(x, y, token);
    if (rand() > 0.5) c.set(x, y - 1, token);
  }
  for (let i = 0; i < 4; i++)
    tuft(c, Math.floor(rand() * width), Math.floor(rand() * stripe * 2), dark, light);
  return sprite(c);
}

export const LAWN_ART = {
  play: lawn(LAWNS.play, 7),
  contact: lawn(LAWNS.contact, 8),
} as const;

/** A fallen leaf (5 × 4), in one of the autumn or forest colours. */
function leaf(c: PixelCanvas, x: number, y: number, [edge, face, vein]: readonly Token[], flip: boolean) {
  const rows = ["..ee.", ".effe", "efvf.", ".ev.."];
  c.stamp(rows, { e: edge, f: face, v: vein }, x, y, { flip });
}

const LEAF_COLOURS: readonly (readonly Token[])[] = [
  ["wood-600", "wood-400", "wood-300"],
  ["gold-700", "gold-600", "gold-400"],
  ["red-700", "red-600", "red-400"],
  ["leaf-700", "leaf-500", "leaf-300"],
];

/** Size of the two scatter tiles (unrelated, so the scatter never looks tiled). */
export const SCATTER_TILES = [
  { width: 280, height: 190, seed: 3, count: 22 },
  { width: 190, height: 250, seed: 29, count: 14 },
] as const;

/**
 * Fallen forest debris on a transparent tile: leaves, twigs, clovers, little
 * flowers and pebbles, each with a one-pixel shadow.
 */
function debris(zone: Zone, width: number, height: number, seed: number, count: number) {
  const rand = rng(seed + (zone === "contact" ? 100 : 0));
  const c = new PixelCanvas(width, height, { wrapX: true, wrapY: true });
  for (let i = 0; i < count; i++) {
    const x = Math.floor(rand() * width);
    const y = Math.floor(rand() * height);
    const kind = rand();
    if (kind < 0.45) {
      leaf(c, x, y, LEAF_COLOURS[Math.floor(rand() * LEAF_COLOURS.length)], rand() > 0.5);
    } else if (kind < 0.6) {
      // A twig with a side shoot.
      const len = 5 + Math.floor(rand() * 4);
      for (let k = 0; k < len; k++) c.set(x + k, y + Math.floor(k / 3), "wood-700");
      c.set(x + 2, y - 1, "wood-600").set(x + 3, y - 2, "wood-600");
    } else if (kind < 0.72) {
      // A clover: three round leaflets.
      const g = zone === "play" ? "leaf-400" : "leaf-500";
      c.rect(x, y, 2, 2, g).rect(x + 2, y, 2, 2, g).rect(x + 1, y + 2, 2, 2, g);
      c.set(x + 1, y + 1, "leaf-600").set(x + 2, y + 4, "leaf-700");
    } else if (kind < 0.86) {
      flower(c, x, y, rand() > 0.5 ? "paper-100" : "pink-300");
    } else {
      c.set(x, y, "stone-300").set(x + 1, y, "stone-400").set(x, y + 1, "stone-500").set(x + 1, y + 1, "stone-600");
    }
  }
  return sprite(c);
}

export const SCATTER_ART = {
  play: SCATTER_TILES.map(({ width, height, seed, count }) => debris("play", width, height, seed, count)),
  contact: SCATTER_TILES.map(({ width, height, seed, count }) => debris("contact", width, height, seed, count)),
} as const;
