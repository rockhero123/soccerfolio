import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { expectTokensOnly } from "@/test/pixel";
import Waterfall from "./Waterfall";
import {
  CLIFF_TILE,
  FALLS,
  FALLS_ROCKS,
  FALL_TILE,
  FOAM_TILE,
  SCENE_H,
} from "./waterfallArt";

afterEach(cleanup);

function renderWaterfall() {
  const { container } = render(<Waterfall />);
  const root = container.querySelector(
    '[data-waterfall="root"]',
  ) as HTMLElement;
  const all = (name: string) =>
    root.querySelectorAll(`[data-waterfall="${name}"]`);
  return { root, all };
}

describe("Waterfall — AC1: an original pixel-art waterfall", () => {
  it("is a pixel scene: cliffs, three falling sheets, terraces and a pool, rocks, leaves and a stick", () => {
    const { root, all } = renderWaterfall();
    expect(all("cliffs")).toHaveLength(1);
    root
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("shape-rendering", "crispEdges"));
    expect(FALLS.sheets).toHaveLength(3);
    expect(all("fall")[0].getAttribute("clip-path")).toBe("url(#waterfall-sheets)");
    expect(root.querySelectorAll("#waterfall-sheets rect")).toHaveLength(3);
    // Two terraces between the tiers, and the pool.
    expect(root.querySelectorAll("#waterfall-flats rect")).toHaveLength(3);
    expect(all("rock")).toHaveLength(1);
    expect(all("leaves")[0].children.length).toBeGreaterThanOrEqual(4);
  });

  it("draws mossy grey stone, blue water, chalk foam and jungle from the token ramps", () => {
    const rocks = FALLS_ROCKS.paths.map((p) => p.token);
    expect(rocks).toEqual(
      expect.arrayContaining(["stone-400", "stone-600", "stone-800", "leaf-500"]),
    );
    expect(FALL_TILE.paths.map((p) => p.token)).toEqual(
      expect.arrayContaining(["water-500", "water-300", "water-200"]),
    );
    expect(FOAM_TILE.paths.map((p) => p.token)).toContain("paper-100");
    const cliffs = CLIFF_TILE.paths.map((p) => p.token);
    expect(cliffs).toEqual(expect.arrayContaining(["stone-500", "leaf-300"]));
  });

  it("leaves holes in the rock where the water shows through", () => {
    const [x, y, w, h] = FALLS.sheets[0];
    expect(FALLS_ROCKS.canvas.get(x + w / 2, y + h / 2)).toBeUndefined();
    expect(FALLS_ROCKS.canvas.get(1, 1)).toBeDefined();
  });

  it("uses tokens only and no raster images", () => {
    const html = renderToStaticMarkup(<Waterfall />);
    expect(html).not.toMatch(/data:image/);
    expectTokensOnly(html);
  });
});

describe("Waterfall — AC2: from the top of the field to just above the Introduction banner", () => {
  it("is pinned to the top of the field and sized in art pixels to stop above the hero banner", () => {
    const { root } = renderWaterfall();
    expect(root).toHaveClass("absolute", "inset-x-0", "top-0");
    expect(root.getAttribute("style")).toContain(`calc(${SCENE_H} * var(--px))`);
    // The Introduction banner starts below the top penalty area (48 art pixels
    // after a 5-pixel inset), the content gap (1.5rem) and the section's top
    // padding (2.5rem): 69 art pixels at the largest pixel size (4px), so the
    // scene must end before that.
    const remInArtPx = 16 / 4;
    expect(SCENE_H).toBeLessThan(5 + 48 + (1.5 + 2.5) * remInArtPx);
  });
});

describe("Waterfall — AC3/AC4: moving water, still with reduced motion", () => {
  it("animates streaks, ripples, foam and floating leaves only with motion-safe CSS", () => {
    const html = renderToStaticMarkup(<Waterfall />);
    for (const animation of [
      "animate-water-fall",
      "animate-water-flow",
      "animate-foam",
      "animate-float",
    ]) {
      expect(html).toContain(`motion-safe:${animation}`);
    }
    const classes = html.match(/class="[^"]*"/g)!.join(" ");
    expect(classes.match(/(?<![\w:-])animate-[\w-]+/g)).toBeNull();
    expect(html).not.toMatch(/<animate|<set\b|<script/);
  });

  it("moves the water one art pixel at a time, with keyframes in globals.css", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    for (const name of ["water-fall", "water-flow", "foam", "float"]) {
      expect(css).toContain(`@keyframes ${name}`);
      expect(css).toMatch(new RegExp(`--animate-${name}: ${name} [\\d.]+s steps\\(\\d+\\)`));
    }
  });
});

describe("Waterfall — AC5: decorative", () => {
  it("is aria-hidden, unfocusable and has no text", () => {
    const { root } = renderWaterfall();
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("pointer-events-none");
    root
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("focusable", "false"));
    expect(root.textContent).toBe("");
    expect(root.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
  });
});
