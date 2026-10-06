import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import GrassStrip from "./GrassStrip";

afterEach(cleanup);

describe("GrassStrip — AC4: reusable grass for title banners", () => {
  it("is a decorative, unfocusable SVG", () => {
    const { container } = render(<GrassStrip />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
    expect(svg.textContent).toBe("");
  });

  it("draws cartoon grass: back and front rows of blades with ink outlines, on a solid base", () => {
    const { container } = render(<GrassStrip />);
    const pattern = container.querySelector("pattern")!;
    expect(pattern).toHaveAttribute("patternUnits", "userSpaceOnUse");
    for (const row of ["back", "front"]) {
      const blades = pattern.querySelector(`[data-grass-row="${row}"]`)!;
      expect(blades.getAttribute("d")!.match(/M/g)!.length).toBeGreaterThan(12);
      // Bold ink outline, kept at the outline width when the strip stretches.
      expect(blades).toHaveClass("stroke-ink", "stroke-outline");
      expect(blades).toHaveAttribute("vector-effect", "non-scaling-stroke");
    }
    expect(pattern.querySelector("rect")).not.toBeNull();
    const rect = container.querySelector("svg > rect")!;
    expect(rect).toHaveAttribute("width", "100%");
    expect(rect).toHaveAttribute("fill", `url(#${pattern.id})`);
  });

  it("fills the tile edge to edge, so the repeat has no gaps", () => {
    const { container } = render(<GrassStrip />);
    const pattern = container.querySelector("pattern")!;
    const width = Number(pattern.getAttribute("width"));
    const front = pattern
      .querySelector('[data-grass-row="front"]')!
      .getAttribute("d")!;
    const xs = [...front.matchAll(/[ZM]?M?([\d.]+) \d+(?:\.\d+)?Z/g)].map((m) =>
      Number(m[1]),
    );
    expect(Math.max(...xs)).toBeGreaterThan(width - 12);
  });

  it("defaults to dark grass and accepts its size and colour as tokens", () => {
    const { container, rerender } = render(<GrassStrip />);
    expect(container.querySelector("svg")).toHaveClass(
      "w-full",
      "fill-pitch-dark",
    );
    rerender(<GrassStrip className="h-10 fill-pitch" />);
    expect(container.querySelector("svg")).toHaveClass("h-10", "fill-pitch");
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
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
    const fills = [...container.querySelectorAll("svg > rect")].map((r) =>
      r.getAttribute("fill"),
    );
    expect(fills).toEqual([`url(#${a})`, `url(#${b})`]);
  });
});
