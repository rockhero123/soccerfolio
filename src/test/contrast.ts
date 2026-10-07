import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Contrast helpers for tests: compute real colours from globals.css (hex tokens
 * and oklab `color-mix()` tokens) and WCAG contrast ratios between them.
 */
export const css = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

export type RGB = [number, number, number];

const toLinear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const toGamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function toOklab(rgb: RGB): RGB {
  const [r, g, b] = rgb.map(toLinear);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function fromOklab([L, a, b]: RGB): RGB {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((c) => Math.min(1, Math.max(0, toGamma(c)))) as RGB;
}

/** A colour token: a hex value, or an oklab `color-mix()` of two other tokens. */
export function token(name: string): RGB {
  const value = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))![1];
  const hex = value.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    return [0, 2, 4].map(
      (i) => parseInt(hex[1].slice(i, i + 2), 16) / 255,
    ) as RGB;
  }
  const [, a, p, b] = value.match(
    /color-mix\(in oklab, var\(--color-([\w-]+)\) (\d+)%, var\(--color-([\w-]+)\)\)/,
  )!;
  const [la, lb] = [toOklab(token(a)), toOklab(token(b))];
  const t = Number(p) / 100;
  return fromOklab(la.map((v, i) => v * t + lb[i] * (1 - t)) as RGB);
}

/** `top` at opacity `p` composited over `base` in sRGB, as the browser paints it. */
export function overlay(base: RGB, top: RGB, p: number): RGB {
  return base.map((c, i) => c * (1 - p) + top[i] * p) as RGB;
}

const luminance = (rgb: RGB) => {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a: RGB, b: RGB) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
