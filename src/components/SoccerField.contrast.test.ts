import { describe, expect, it } from "vitest";
import { contrast, css, overlay, token } from "@/test/contrast";
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
