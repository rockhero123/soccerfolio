import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SHADE_TINT } from "./soccer-field/FieldPaint";

/**
 * AC5 (spec 001 US-3): text on the field meets WCAG AA (4.5:1) on both stripe
 * colours of both zones, in their worst case. axe cannot measure text over a
 * gradient, so this computes the real colours from the tokens, the `bg-mowing` mix
 * in globals.css and the paint opacities in `FieldPaint`.
 * The watercolour blotches only move each zone away from its text colour
 * (parchment on the bright grass, ink on the dark grass), so they never lower contrast.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

type RGB = [number, number, number];

function token(name: string): RGB {
  const hex = css.match(new RegExp(`--color-${name}:\\s*#([0-9a-f]{6});`, "i"))![1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as RGB;
}

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
/**
 * A `color-mix(in oklab, top p%, transparent)` stripe is `top` at alpha p,
 * which the browser composites over the grass in sRGB.
 */
function overlay(base: RGB, top: RGB, p: number): RGB {
  return base.map((c, i) => c * (1 - p) + top[i] * p) as RGB;
}

const luminance = (rgb: RGB) => {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const stripe = Number(
  css.match(/color-mix\(in oklab, var\(--color-chalk\) (\d+)%, transparent\)/)![1],
) / 100;

describe("SoccerField — AC5: text contrast on the painted grass (WCAG AA)", () => {
  it("ink text on the bright grass, at its darkest (forest tint, no stripe)", () => {
    const darkest = overlay(token("pitch"), token("forest-deep"), SHADE_TINT);
    expect(contrast(token("ink"), darkest)).toBeGreaterThanOrEqual(4.5);
    // The tint never takes the grass below AA, even with the stripe on top.
    const striped = overlay(darkest, token("chalk"), stripe);
    expect(contrast(token("ink"), striped)).toBeGreaterThanOrEqual(4.5);
  });

  it("chalk text on the dark grass, at its lightest (lighter stripe)", () => {
    const base = token("pitch-dark");
    const lightest = overlay(base, token("chalk"), stripe);
    expect(contrast(token("chalk"), base)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token("chalk"), lightest)).toBeGreaterThanOrEqual(4.5);
  });
});
