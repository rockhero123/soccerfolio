import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import CartoonPortrait, { PORTRAIT_CIRCLE } from "./CartoonPortrait";

afterEach(cleanup);

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

function renderPortrait() {
  render(<CartoonPortrait />);
  const svg = screen.getByRole("img", { name: hero.portrait.label });
  const part = (name: string) =>
    svg.querySelector(`[data-portrait-part="${name}"]`)!;
  return { svg, part };
}

/** The smallest y coordinate in an SVG path made of absolute commands. */
function topOf(d: string): number {
  const numbers = d.match(/-?\d+(\.\d+)?/g)!.map(Number);
  return Math.min(...numbers.filter((_, i) => i % 2 === 1));
}

describe("CartoonPortrait — AC1: an original rubber-hose SVG portrait of Ricardo", () => {
  it("is a hand-coded inline SVG with bold ink outlines", () => {
    const { svg } = renderPortrait();
    expect(svg.tagName).toBe("svg");
    expect(svg.querySelector(":scope > g")).toHaveClass(
      "stroke-ink",
      "stroke-outline-lg",
    );
  });

  it("keeps his features: huge pie-cut eyes, strong brows, short hair, moustache, partial beard, ears", () => {
    const { svg, part } = renderPortrait();
    const eyes = svg.querySelectorAll('[data-part="pie-eye"]');
    expect(eyes).toHaveLength(2);
    eyes.forEach((eye) =>
      expect(eye.querySelector("path.fill-ink")!.getAttribute("d")).toMatch(
        /A[\d.]+ [\d.]+ 0 1 1 /,
      ),
    );
    expect(svg.querySelectorAll('[data-part="brow"]')).toHaveLength(2);
    for (const name of ["hair", "moustache", "beard", "head"]) {
      expect(part(name), name).not.toBeNull();
    }
    expect(svg.querySelectorAll("ellipse.fill-skin")).toHaveLength(2);
  });

  it("draws the two brows as exact mirror images", () => {
    const { svg } = renderPortrait();
    const [left, right] = [...svg.querySelectorAll('[data-part="brow"]')];
    expect(left.getAttribute("d")).toBe(right.getAttribute("d"));
    expect(left.parentElement).toHaveAttribute(
      "transform",
      "translate(236 0) scale(-1 1)",
    );
  });

  it("pulls a roguish smirk: clenched teeth with one corner raised", () => {
    const { part } = renderPortrait();
    expect(part("grin")).toHaveClass("fill-parchment");
    expect(part("teeth")).not.toBeNull();
    expect(part("smirk")).not.toBeNull();
  });

  it("looks fast and epic: a sunburst, speed lines, excitement marks and smoke", () => {
    const { part } = renderPortrait();
    for (const name of ["sunburst", "speed-lines", "excitement", "smoke"]) {
      expect(part(name), name).not.toBeNull();
    }
    expect(
      part("smoke").querySelectorAll("circle.fill-parchment").length,
    ).toBeGreaterThan(8);
  });

  it("is static", () => {
    expect(renderToStaticMarkup(<CartoonPortrait />)).not.toMatch(
      /<animate|<set\b|animate-|transition/,
    );
  });
});

describe("CartoonPortrait — AC2: the yellow Colombia shirt", () => {
  it("wears a cartoon-yellow shirt with a round collar", () => {
    const { part } = renderPortrait();
    expect(part("shirt")).toHaveClass("fill-cartoon-yellow");
    expect(part("collar")).not.toBeNull();
  });
});

describe("CartoonPortrait — AC3: clipped to a circle, with the hair breaking out", () => {
  it("clips the face, shirt and background to the portrait circle", () => {
    const { svg, part } = renderPortrait();
    const circle = svg.querySelector("clipPath circle")!;
    expect(
      ["cx", "cy", "r"].map((a) => Number(circle.getAttribute(a))),
    ).toEqual([PORTRAIT_CIRCLE.cx, PORTRAIT_CIRCLE.cy, PORTRAIT_CIRCLE.r]);
    const clip = `[clip-path="url(#${circle.parentElement!.id})"]`;
    for (const name of ["shirt", "beard", "moustache", "head"]) {
      expect(part(name).closest(clip), name).not.toBeNull();
    }
  });

  it("draws the hair outside the clip, over the circle's outline and above its top edge", () => {
    const { svg, part } = renderPortrait();
    const hair = part("hair");
    expect(hair.closest("[clip-path]")).toBeNull();
    expect(
      part("frame").compareDocumentPosition(hair) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(topOf(hair.getAttribute("d")!)).toBeLessThan(
      PORTRAIT_CIRCLE.cy - PORTRAIT_CIRCLE.r - 10,
    );
    expect(svg).toHaveClass("overflow-visible");
  });

  it("lets the smoke burst out of the circle too", () => {
    const { part } = renderPortrait();
    const { cx, cy, r } = PORTRAIT_CIRCLE;
    expect(part("smoke").closest("[clip-path]")).toBeNull();
    const outside = [...part("smoke").querySelectorAll("circle")].some((c) => {
      const [x, y, size] = ["cx", "cy", "r"].map((a) =>
        Number(c.getAttribute(a)),
      );
      return Math.hypot(x - cx, y - cy) + size > r;
    });
    expect(outside).toBe(true);
  });
});

describe("CartoonPortrait — AC4: a meaningful image with an accessible name", () => {
  it('has role="img" and its label from src/content/hero.ts, and is not hidden', () => {
    const { svg } = renderPortrait();
    expect(svg).toHaveAttribute("aria-label", hero.portrait.label);
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(hero.portrait.label).toMatch(/Ricardo Martinez/);
  });
});

describe("CartoonPortrait — AC5: tokens only, no raster images", () => {
  it("uses no raw hex colours, colour attributes or raster images", () => {
    const html = renderToStaticMarkup(<CartoonPortrait />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
    expect(html).not.toMatch(/<image|<img|data:image/);
  });

  it("mixes its skin tones from existing tokens", () => {
    const css = read("src/app/globals.css");
    for (const name of ["skin", "skin-shade"]) {
      const value = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))![1];
      expect(value).toMatch(
        /^color-mix\(in oklab, var\(--color-bark\) \d+%, var\(--color-parchment\)\)$/,
      );
    }
  });
});
