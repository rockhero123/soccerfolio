import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrast, overlay, token, type RGB } from "@/test/contrast";
import { VIGNETTE } from "./FilmOverlay";

/**
 * AC2 (spec 001 US-5): the vignette does not reduce text contrast below WCAG AA.
 * The overlay sits on top of text and background alike, so it lowers every pair.
 * This checks every text/background pair the manifest §6 allows, under the
 * vignette's darkest band.
 */
const manifest = readFileSync(join(process.cwd(), "specs/manifest.md"), "utf8");
const rules = manifest
  .slice(manifest.indexOf("### Text color rules"))
  .split("\n")
  .filter((line) => /^\| `/.test(line))
  .map((line) => {
    const [backgrounds, texts] = line.split("|").slice(1, 3);
    const names = (cell: string) =>
      [...cell.matchAll(/`([\w-]+)`/g)].map((m) => m[1]);
    return { backgrounds: names(backgrounds), texts: names(texts) };
  });

const pairs = rules.flatMap(({ backgrounds, texts }) =>
  backgrounds.flatMap((bg) => texts.map((text) => [text, bg] as const)),
);

/** Text and background seen through the vignette's darkest band. */
function throughOverlay(text: RGB, bg: RGB) {
  const darkest = (c: RGB) => overlay(c, token("ink"), VIGNETTE);
  return contrast(darkest(text), darkest(bg));
}

describe("FilmOverlay — AC2: text contrast stays WCAG AA under the overlay", () => {
  it("reads every allowed text/background pair from manifest §6", () => {
    expect(pairs.length).toBeGreaterThanOrEqual(10);
    expect(pairs).toContainEqual(["ink", "pitch"]);
    expect(pairs).toContainEqual(["parchment", "bark"]);
    expect(pairs).toContainEqual(["ink", "wood-400"]);
  });

  it.each(pairs)(
    "%s text on %s stays ≥ 4.5:1 at the overlay's worst point",
    (text, bg) => {
      expect(throughOverlay(token(text), token(bg))).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );
});
