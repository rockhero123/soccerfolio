import type { SkillLogo } from "@/content/skills";
import { PixelCanvas, sprite } from "../pixel/canvas";
import { rasterize } from "../pixel/rasterPath";
import { SKILL_LOGOS } from "./skillLogos";

/** Size of a jersey sprite, in art pixels. */
export const JERSEY = { width: 30, height: 36 } as const;

/**
 * A pixel-art soccer jersey (spec 004 US-1): a `pitch-dark` shirt shaded from
 * the left, short sleeves with chalk cuffs, a round chalk collar and a few
 * fabric folds, outlined in ink.
 */
function shirt() {
  const { width, height } = JERSEY;
  const c = new PixelCanvas(width, height);
  const mid = (width - 1) / 2;
  const inside = (x: number, y: number) => {
    const fromMid = Math.abs(x - mid);
    // Neck opening.
    if ((fromMid / 4.2) ** 2 + ((y + 0.5) / 3) ** 2 < 1) return false;
    // Torso.
    if (fromMid <= 10.5 && y >= 1 && y <= height - 2) return true;
    // Sleeves: angled down and out from the shoulders.
    const out = fromMid - 10.5;
    return out > 0 && out <= 4.5 && y >= 1 + out * 0.8 && y <= 9 + out * 0.2;
  };
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      if (!inside(x, y)) continue;
      const fromMid = Math.abs(x - mid);
      const left = x < mid;
      let token = "grass-800";
      if (fromMid > 13.5) token = "paper-100"; // cuffs
      else if (left && fromMid > 8.5) token = "grass-700";
      else if (!left && fromMid > 8.5) token = "grass-900";
      c.set(x, y, token);
    }
  // Collar: a chalk ring around the neck opening.
  for (let y = 0; y < 5; y++)
    for (let x = 0; x < width; x++) {
      if (!c.get(x, y)) continue;
      const near = [[0, -1], [1, 0], [-1, 0], [0, 1]].some(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return ny >= 0 && !c.get(nx, ny) && Math.abs(nx - mid) < 5;
      });
      if (near) c.set(x, y, "paper-100");
    }
  // Folds and a light seam under each arm.
  c.set(6, 16, "grass-700").set(6, 17, "grass-700").set(23, 21, "grass-900").set(23, 22, "grass-900");
  c.rect(6, height - 3, 18, 1, "grass-900");
  c.outline("ink");
  return sprite(c);
}

export const SHIRT = shirt();

/** Size of the logo badge, in art pixels (the logo is 2 pixels smaller). */
export const BADGE = 16;

/**
 * A skill's official logo, rasterised to pixels on a round parchment badge,
 * in `ink` (the Kiro ghost's eyes stay parchment).
 */
function badge(logo: SkillLogo) {
  const { viewBox, d, cut } = SKILL_LOGOS[logo];
  const c = new PixelCanvas(BADGE + 2, BADGE + 2);
  c.disc(BADGE / 2 + 0.5, BADGE / 2 + 0.5, BADGE / 2, "paper-200");
  c.outline("ink");
  const size = BADGE - 4;
  const shape = rasterize(d, viewBox, size, 0.4);
  const holes = cut ? rasterize(cut, viewBox, size, 0.3) : null;
  shape.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on && !holes?.[y][x]) c.set(x + 3, y + 3, "ink");
    }),
  );
  return sprite(c);
}

export const BADGES = Object.fromEntries(
  (Object.keys(SKILL_LOGOS) as SkillLogo[]).map((logo) => [logo, badge(logo)]),
) as Record<SkillLogo, ReturnType<typeof badge>>;
