import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * AC5 (spec 001 US-3): text on the field meets WCAG AA (4.5:1) on both stripe
 * colours of both zones. axe cannot measure text over a gradient, so this computes
 * the real colours from the tokens and the `bg-mowing` mix in globals.css.
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

describe("SoccerField — AC5: text contrast on the mown grass (WCAG AA)", () => {
  it.each([
    ["ink", "pitch"],
    ["chalk", "pitch-dark"],
  ])("%s text on %s and its lighter stripe is at least 4.5:1", (text, grass) => {
    const base = token(grass);
    const light = overlay(base, token("chalk"), stripe);
    expect(contrast(token(text), base)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(token(text), light)).toBeGreaterThanOrEqual(4.5);
  });
});
