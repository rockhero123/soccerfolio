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

  it("has huge pie-cut eyes, raised brows, an enormous toothy grin, beard, moustache, short hair and big ears", () => {
    const { svg, part } = renderPortrait();
    const eyes = svg.querySelectorAll('[data-part="pie-eye"]');
    expect(eyes).toHaveLength(2);
    eyes.forEach((eye) => {
      expect(eye.querySelector("path.fill-ink")!.getAttribute("d")).toMatch(
        /A[\d.]+ [\d.]+ 0 1 1 /,
      );
      // Tall cartoon eyes.
      const white = eye.querySelector("ellipse")!;
      expect(Number(white.getAttribute("ry"))).toBeGreaterThan(
        Number(white.getAttribute("rx")),
      );
    });
    expect(svg.querySelectorAll('[data-part="brow"]')).toHaveLength(2);
    for (const name of [
      "beard",
      "moustache",
      "hair",
      "grin",
      "teeth",
      "tongue",
    ]) {
      expect(part(name), name).not.toBeNull();
    }
    expect(part("tongue")).toHaveClass("fill-cartoon-red");
    expect(svg.querySelectorAll("ellipse.fill-skin")).toHaveLength(2);
  });

  it("looks fast and epic: a sunburst, speed lines, excitement marks, smoke and a waving glove", () => {
    const { part } = renderPortrait();
    for (const name of [
      "sunburst",
      "speed-lines",
      "excitement",
      "smoke",
      "glove",
    ]) {
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

describe("CartoonPortrait — AC2: a Colombia soccer shirt", () => {
  it("shows yellow, blue and red flag bands inside the shirt", () => {
    const { svg, part } = renderPortrait();
    expect(part("shirt")).toHaveClass("fill-cartoon-yellow");
    const flag = part("flag");
    const bands = [...flag.querySelectorAll("rect")].map((r) =>
      r.getAttribute("class"),
    );
    expect(bands).toEqual(["fill-cartoon-blue", "fill-cartoon-red"]);
    // The bands are clipped to the shirt shape.
    const clip = flag.getAttribute("clip-path")!;
    const shirtClip = svg.querySelector(`clipPath${clip.slice(4, -1)} path`)!;
    expect(shirtClip.getAttribute("d")).toBe(part("shirt").getAttribute("d"));
  });

  it("defines cartoon-blue in globals.css with the manifest §6 value", () => {
    const manifest = read("specs/manifest.md").match(
      /\| `cartoon-blue` \| `(#[0-9A-Fa-f]{6})`/,
    )![1];
    expect(read("src/app/globals.css")).toContain(
      `--color-cartoon-blue: ${manifest.toLowerCase()};`,
    );
  });
});

describe("CartoonPortrait — AC3: clipped to a circle, with the hair breaking out", () => {
  it("clips the face, shirt and background to the portrait circle", () => {
    const { svg, part } = renderPortrait();
    const circle = svg.querySelector("clipPath circle")!;
    expect(
      [
        circle.getAttribute("cx"),
        circle.getAttribute("cy"),
        circle.getAttribute("r"),
      ].map(Number),
    ).toEqual([PORTRAIT_CIRCLE.cx, PORTRAIT_CIRCLE.cy, PORTRAIT_CIRCLE.r]);
    for (const name of ["shirt", "beard", "moustache"]) {
      expect(
        part(name).closest(`[clip-path="url(#${circle.parentElement!.id})"]`),
        name,
      ).not.toBeNull();
    }
  });

  it("draws the hair outside the clip, over the circle's outline and above its top edge", () => {
    const { svg, part } = renderPortrait();
    const hair = part("hair");
    expect(hair.closest("[clip-path]")).toBeNull();
    // Drawn after the circle outline, so it sits on top of it.
    const frame = part("frame");
    expect(
      frame.compareDocumentPosition(hair) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(topOf(hair.getAttribute("d")!)).toBeLessThan(
      PORTRAIT_CIRCLE.cy - PORTRAIT_CIRCLE.r - 10,
    );
    expect(svg).toHaveClass("overflow-visible");
  });

  it("lets the smoke and the waving glove burst out of the circle too", () => {
    const { part } = renderPortrait();
    const { cx, cy, r } = PORTRAIT_CIRCLE;
    for (const name of ["smoke", "glove"]) {
      expect(part(name).closest("[clip-path]"), name).toBeNull();
    }
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
