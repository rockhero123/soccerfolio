import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import { expectPixelSprite, expectTokensOnly } from "@/test/pixel";
import CartoonPortrait, { PORTRAIT_CIRCLE } from "./CartoonPortrait";
import { HAIR_TOP, PORTRAIT } from "./hero/portraitArt";

afterEach(cleanup);

const { canvas } = PORTRAIT;
const { cx, cy, r } = PORTRAIT_CIRCLE;
const inCircle = (x: number, y: number) =>
  Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r;

/** Every pixel of a token, as [x, y]. */
function pixels(token: string) {
  const found: [number, number][] = [];
  for (let y = 0; y < canvas.height; y++)
    for (let x = 0; x < canvas.width; x++)
      if (canvas.get(x, y) === token) found.push([x, y]);
  return found;
}

describe("CartoonPortrait — AC1: an original pixel-art portrait of Ricardo", () => {
  it("is a hand-coded, crisp pixel sprite, drawn at the site's pixel size", () => {
    render(<CartoonPortrait />);
    const svg = screen.getByRole("img").querySelector("svg")!;
    expectPixelSprite(svg);
    expect(svg.getAttribute("style")).toContain(`calc(${canvas.width} * var(--px))`);
  });

  it("keeps his features: dark hair, brows and eyes, skin shading, moustache and jaw beard, big ears", () => {
    const used = PORTRAIT.paths.map((p) => p.token);
    expect(used).toEqual(
      expect.arrayContaining(["hair", "skin-400", "skin-500", "skin-600", "skin-700", "paper-100"]),
    );
    // Ears stick out beyond the sides of the face.
    expect(canvas.get(18, 27)).toMatch(/^skin-/);
    expect(canvas.get(42, 27)).toMatch(/^skin-/);
    // Moustache and beard: hair-coloured pixels below the nose.
    expect(pixels("hair").filter(([, y]) => y >= 30 && y < 40).length).toBeGreaterThan(20);
  });

  it("pulls a toothy smirk: teeth between dark lips, one corner raised", () => {
    expect(pixels("paper-100").some(([x, y]) => y === 33 && x >= 27 && x <= 33)).toBe(true);
    expect(canvas.get(36, 30)).toBe("ink");
  });

  it("looks fast: a green sunburst, speed lines, excitement marks and smoke", () => {
    const used = PORTRAIT.paths.map((p) => p.token);
    expect(used).toEqual(expect.arrayContaining(["grass-300", "grass-400", "stone-200"]));
  });

  it("is static", () => {
    expect(renderToStaticMarkup(<CartoonPortrait />)).not.toMatch(
      /<animate|animate-|transition/,
    );
  });
});

describe("CartoonPortrait — AC2: the yellow Colombia shirt", () => {
  it("wears a cartoon-yellow shirt with a blue-and-red round collar", () => {
    const used = PORTRAIT.paths.map((p) => p.token);
    expect(used).toEqual(expect.arrayContaining(["gold-500", "water-700", "red-600"]));
    const yellow = [...pixels("gold-400"), ...pixels("gold-500"), ...pixels("gold-600")];
    expect(yellow.length).toBeGreaterThan(40);
  });
});

describe("CartoonPortrait — AC3: clipped to a circle, with the hair breaking out", () => {
  it("keeps the sunburst and the shirt inside the circle", () => {
    for (const token of ["grass-300", "grass-400", "gold-500"])
      pixels(token).forEach(([x, y]) => expect(inCircle(x, y)).toBe(true));
  });

  it("lets the hair break out above the circle's top edge", () => {
    expect(HAIR_TOP).toBeLessThan(cy - r);
    const above = pixels("hair").filter(([, y]) => y < cy - r);
    expect(above.length).toBeGreaterThan(5);
  });

  it("lets the smoke burst out of the circle too", () => {
    const outside = pixels("stone-200").filter(([x, y]) => !inCircle(x, y));
    expect(outside.length).toBeGreaterThan(5);
  });
});

describe("CartoonPortrait — AC4: a meaningful image with an accessible name", () => {
  it('has role="img" and its label from src/content/hero.ts, and is not hidden', () => {
    render(<CartoonPortrait />);
    const img = screen.getByRole("img", { name: hero.portrait.label });
    expect(img).not.toHaveAttribute("aria-hidden");
    expect(hero.portrait.label).toMatch(/^Pixel-art portrait of Ricardo Martinez/);
  });
});

describe("CartoonPortrait — AC5: tokens only, no raster images", () => {
  it("uses no raw hex colours, colour attributes or raster images", () => {
    expectTokensOnly(renderToStaticMarkup(<CartoonPortrait />));
  });
});
