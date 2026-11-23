import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import GrassStrip from "./GrassStrip";

afterEach(cleanup);

describe("GrassStrip — AC4: reusable pixel grass for title banners", () => {
  it("is a decorative, unfocusable, crisp pixel SVG", () => {
    const { container } = render(<GrassStrip />);
    const svg = container.querySelector("svg")!;
    expectPixelSprite(svg);
    expect(svg.textContent).toBe("");
  });

  it("repeats one tile of shaded tufts at the site's pixel size", () => {
    const { container } = render(<GrassStrip />);
    const pattern = container.querySelector("pattern")!;
    expect(pattern).toHaveAttribute("patternUnits", "userSpaceOnUse");
    expect(pattern).toHaveAttribute("width", "64");
    expect(pattern).toHaveAttribute("height", "9");
    // Dark roots, mid blades, light tips and a dark outline.
    const tokens = pixelTokens(pattern);
    expect(tokens).toEqual(expect.arrayContaining(["grass-900", "grass-500"]));
    expect(new Set(tokens).size).toBeGreaterThanOrEqual(4);
    const scaled = container.querySelector("svg > g")!;
    expect(scaled.getAttribute("style")).toContain("scale(var(--px-scale))");
    expect(scaled.querySelector("rect")).toHaveAttribute(
      "fill",
      `url(#${pattern.id})`,
    );
  });

  it("is always 9 art pixels tall and spans its box", () => {
    const { container } = render(<GrassStrip />);
    expect(container.querySelector("svg")).toHaveClass(
      "w-full",
      "h-[calc(9*var(--px))]",
    );
  });

  it("defaults to dark grass and offers bright field grass", () => {
    const { container, rerender } = render(<GrassStrip />);
    expect(container.querySelector("svg")).toHaveAttribute("data-grass-strip", "dark");
    rerender(<GrassStrip tone="field" className="absolute" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("data-grass-strip", "field");
    expect(svg).toHaveClass("absolute");
    expect(pixelTokens(svg)).toContain("grass-300");
  });

  it("uses design tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<GrassStrip />));
  });

  it("can be used several times on one page without clashing pattern ids", () => {
    const { container } = render(
      <>
        <GrassStrip />
        <GrassStrip />
      </>,
    );
    const [a, b] = [...container.querySelectorAll("pattern")].map((p) => p.id);
    expect(a).not.toBe(b);
    const fills = [...container.querySelectorAll("svg > g > rect")].map((r) =>
      r.getAttribute("fill"),
    );
    expect(fills).toEqual([`url(#${a})`, `url(#${b})`]);
  });
});
