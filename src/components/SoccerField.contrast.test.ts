import { describe, expect, it } from "vitest";
import { contrast, overlay, token } from "@/test/contrast";
import { VIGNETTE } from "./FilmOverlay";

/**
 * AC5 (spec 001 US-3): text on the field meets WCAG AA. Text always sits on a
 * surface (manifest §6), but the zone text colours must also hold on the lawn
 * colours themselves, in case a word ever lands on the grass, under the
 * vignette's darkest band.
 */
const ink = token("ink");
const chalk = token("chalk");
const darken = (c: ReturnType<typeof token>) => overlay(c, ink, VIGNETTE);

describe("SoccerField — AC5: zone text colours on the pixel lawns (WCAG AA)", () => {
  it.each(["grass-500", "grass-400", "grass-300"])(
    "ink text on the bright lawn's %s stays ≥ 4.5:1",
    (lawn) => {
      expect(contrast(ink, darken(token(lawn)))).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(["grass-800", "grass-900"])(
    "chalk text on the dark lawn's %s stays ≥ 4.5:1",
    (lawn) => {
      expect(contrast(darken(chalk), darken(token(lawn)))).toBeGreaterThanOrEqual(4.5);
    },
  );
});
