import { PixelCanvas, rng, sprite, type Token } from "./canvas";

/** Grass colours of a tuft strip: [outline, base, mid, light, tip]. */
export type GrassRamp = readonly [Token, Token, Token, Token, Token];

export const FIELD_GRASS: GrassRamp = [
  "grass-900",
  "grass-700",
  "grass-500",
  "grass-400",
  "grass-300",
];
export const DARK_GRASS: GrassRamp = [
  "grass-900",
  "grass-800",
  "grass-700",
  "grass-600",
  "grass-500",
];

/**
 * A strip of pixel grass tufts, tileable horizontally: V-shaped tufts of
 * 1-pixel blades (dark at the root, light at the tip) on a band of ground,
 * outlined in the darkest green. `height` includes the ground rows.
 */
export function grassTufts(
  width: number,
  height: number,
  seed: number,
  [outline, base, mid, light, tip]: GrassRamp,
) {
  const rand = rng(seed);
  const c = new PixelCanvas(width, height);
  const ground = 2;
  const top = height - ground;
  for (let x = 1; x < width - 2; ) {
    const blades = 3 + Math.floor(rand() * 3);
    const peak = top - 2 - Math.floor(rand() * 2);
    for (let b = 0; b < blades && x < width - 2; b++, x++) {
      const fromCentre = Math.abs(b - (blades - 1) / 2);
      const h = Math.max(2, Math.round(peak - fromCentre * 2 - rand()));
      const lean = b < blades / 2 ? -1 : 1;
      for (let i = 0; i < h; i++) {
        const y = top - 1 - i;
        const share = i / h;
        const token = share < 0.35 ? base : share < 0.7 ? mid : light;
        // The tip leans out, like the blades of a tuft fanning open.
        const bx = i === h - 1 && h > 3 ? x + lean * (fromCentre > 0 ? 1 : 0) : x;
        c.set(bx, y, i === h - 1 ? tip : token);
      }
    }
    x += 1 + Math.floor(rand() * 4);
  }
  c.outline(outline);
  // Ground under the tufts, painted last so it tiles without seams.
  c.rect(0, top, width, ground, base);
  for (let x = 0; x < width; x++) if (rand() > 0.7) c.set(x, top, mid);
  return sprite(c);
}
