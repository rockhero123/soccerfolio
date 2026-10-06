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

  it("draws a row of grass blades on a solid base, repeated across any width", () => {
    const { container } = render(<GrassStrip />);
    const pattern = container.querySelector("pattern")!;
    expect(pattern).toHaveAttribute("patternUnits", "userSpaceOnUse");
    const blades = pattern.querySelector("path")!.getAttribute("d")!;
    // The base plus many pointed blades (one sub-path each).
    expect(blades.match(/M/g)!.length).toBeGreaterThan(20);
    const rect = container.querySelector("rect")!;
    expect(rect).toHaveAttribute("width", "100%");
    expect(rect).toHaveAttribute("fill", `url(#${pattern.id})`);
  });

  it("defaults to dark grass and accepts its size and colour as tokens", () => {
    const { container, rerender } = render(<GrassStrip />);
    expect(container.querySelector("svg")).toHaveClass("w-full", "fill-pitch-dark");
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
    const fills = [...container.querySelectorAll("rect")].map((r) =>
      r.getAttribute("fill"),
    );
    expect(fills).toEqual([`url(#${a})`, `url(#${b})`]);
  });
});
