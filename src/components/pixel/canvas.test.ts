import { describe, expect, it } from "vitest";
import { PixelCanvas, fromRows, rng, sprite } from "./canvas";
import { flatten, rasterize } from "./rasterPath";

describe("PixelCanvas — the pixel-art rasteriser", () => {
  it("is deterministic: the same seed gives the same numbers", () => {
    const a = rng(7);
    const b = rng(7);
    const run = () => [a(), a(), a()];
    expect(run()).toEqual([b(), b(), b()]);
  });

  it("stamps hand-typed rows through a palette, with transparent dots", () => {
    const c = fromRows(["a.", ".b"], { a: "ink", b: "gold-500" });
    expect(c.get(0, 0)).toBe("ink");
    expect(c.get(1, 0)).toBeUndefined();
    expect(c.get(1, 1)).toBe("gold-500");
  });

  it("ignores pixels outside the canvas, unless an axis wraps", () => {
    const c = new PixelCanvas(4, 4);
    c.set(5, 1, "ink");
    expect(c.paths()).toEqual([]);
    const tile = new PixelCanvas(4, 4, { wrapX: true });
    tile.set(5, 1, "ink");
    expect(tile.get(1, 1)).toBe("ink");
  });

  it("outlines shapes on their four sides, leaving the corners soft", () => {
    const c = new PixelCanvas(3, 3).set(1, 1, "gold-500").outline("ink");
    expect(c.get(1, 0)).toBe("ink");
    expect(c.get(0, 1)).toBe("ink");
    expect(c.get(0, 0)).toBeUndefined();
  });

  it("shades a ball lighter at the top left than at the bottom right", () => {
    const ramp = ["leaf-800", "leaf-600", "leaf-400", "leaf-200"];
    const c = new PixelCanvas(12, 12).ball(6, 6, 5, 5, ramp);
    const level = (x: number, y: number) => ramp.indexOf(c.get(x, y)!);
    expect(level(4, 3)).toBeGreaterThan(level(8, 9));
  });

  it("exports one merged path per colour", () => {
    const c = new PixelCanvas(4, 2).rect(0, 0, 4, 2, "ink").set(3, 1, "gold-500");
    const { paths } = sprite(c);
    expect(paths.map((p) => p.token).sort()).toEqual(["gold-500", "ink"]);
    // The 4 × 1 top row and the 3 × 1 run below make two rectangles.
    // Later rectangles move relative to the previous one's start.
    expect(paths.find((p) => p.token === "ink")!.d).toBe("M0 0h4v1h-4zm0 1h3v1h-3z");
  });
});

describe("rasterPath — official logos to pixels", () => {
  it("flattens straight, curved and arc commands into closed polygons", () => {
    expect(flatten("M0 0h10v10H0z")).toEqual([
      [
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
      ],
    ]);
    const [circle] = flatten("M0 5a5 5 0 1 0 10 0a5 5 0 1 0-10 0z");
    expect(circle.length).toBeGreaterThan(8);
  });

  it("fills a square and leaves a cut-out hole empty (nonzero rule)", () => {
    const mask = rasterize("M0 0h8v8H0zM2 2v4h4V2z", "0 0 8 8", 8);
    expect(mask[0][0]).toBe(true);
    expect(mask[3][3]).toBe(false);
    expect(mask[7][7]).toBe(true);
  });

  it("centres a non-square viewBox in the square mask", () => {
    const mask = rasterize("M0 0h4v8H0z", "0 0 4 8", 8);
    expect(mask[4][0]).toBe(false);
    expect(mask[4][3]).toBe(true);
  });
});
