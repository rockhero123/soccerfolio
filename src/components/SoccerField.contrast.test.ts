import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LEAF_SHADE, ZONE_PALETTE } from "./soccer-field/debris/palette";
import { SHADE_TINT } from "./soccer-field/FieldPaint";
import { GRASS_TINT, SCATTER_SHADOW } from "./soccer-field/FieldScatter";

/**
 * AC5 (spec 001 US-3): text on the field meets WCAG AA (4.5:1), in the worst case,
 * on the grass and on any fallen debris it may sit on. axe cannot measure text over
 * gradients or SVG art, so this computes the real colours from globals.css: the
 * hex tokens, the `forest-*` colours (oklab `color-mix()`es of tokens), the
 * `bg-mowing` stripe and the paint opacities.
 */
const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

type RGB = [number, number, number];

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
function token(name: string): RGB {
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

const stripe =
  Number(
    css.match(
      /color-mix\(in oklab, var\(--color-chalk\) (\d+)%, transparent\)/,
    )![1],
  ) / 100;

/** The token behind a palette class, e.g. `fill-forest-mid-light` → `forest-mid-light`. */
const tokenOf = (cls: string) => cls.replace(/^(fill|stroke)-/, "");

describe("SoccerField — AC5: text contrast on the painted grass (WCAG AA)", () => {
  it("ink text on the bright grass, at its darkest (forest tint and debris shadow, no stripe)", () => {
    const tinted = overlay(token("pitch"), token("forest-deep"), SHADE_TINT);
    const darkest = overlay(tinted, token("ink"), SCATTER_SHADOW);
    expect(contrast(token("ink"), darkest)).toBeGreaterThanOrEqual(4.5);
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

describe("SoccerField — AC5: text contrast on scattered debris (WCAG AA)", () => {
  const zones = [
    ["play", "ink"],
    ["contact", "chalk"],
  ] as const;

  it.each(zones)(
    "every %s-zone debris colour keeps %s text at 4.5:1",
    (zone, text) => {
      const p = ZONE_PALETTE[zone];
      const fills = [
        ...p.leaves,
        p.twig,
        p.stalk,
        p.leaflet,
        p.tuft,
        ...(p.feather ? [p.feather.vane, p.feather.tip] : []),
        ...(p.clover ? [p.clover] : []),
      ];
      for (const cls of fills) {
        const colour = token(tokenOf(cls));
        expect(contrast(token(text), colour), cls).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each(zones)(
    "%s-zone leaves stay readable on their ink-shaded half too",
    (zone, text) => {
      for (const cls of ZONE_PALETTE[zone].leaves) {
        const shaded = overlay(token(tokenOf(cls)), token("ink"), LEAF_SHADE);
        expect(contrast(token(text), shaded), cls).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it.each(zones)(
    "%s-zone debris melted into the grass (tint and fade) stays readable",
    (zone, text) => {
      const grass = token(zone === "play" ? "pitch" : "pitch-dark");
      const p = ZONE_PALETTE[zone];
      for (const cls of [...p.leaves, p.twig, p.tuft]) {
        const tinted = overlay(token(tokenOf(cls)), grass, GRASS_TINT);
        for (const opacity of [0.55, 0.85]) {
          const melted = overlay(grass, tinted, opacity);
          expect(contrast(token(text), melted), cls).toBeGreaterThanOrEqual(
            4.5,
          );
        }
      }
    },
  );
});
