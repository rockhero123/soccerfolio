import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { expectPixelSprite, expectTokensOnly } from "@/test/pixel";
import ForestBackground from "./ForestBackground";
import { FOREST } from "./forest-background/pixelForest";

afterEach(cleanup);

function renderForest() {
  const { container } = render(<ForestBackground />);
  const root = container.firstElementChild as HTMLElement;
  return { container, root };
}

describe("ForestBackground — AC1: original, layered pixel-art forest", () => {
  const tokens = (tile: (typeof FOREST)[keyof typeof FOREST]) =>
    tile.paths.map((p) => p.token);

  it("repeats seeded pixel tiles at the site's pixel size, one pattern per area", () => {
    const { container } = renderForest();
    for (const part of ["side-left", "side-right", "band-top", "band-bottom"]) {
      const area = container.querySelector(`[data-forest-part="${part}"]`)!;
      const svg = area.tagName === "svg" ? area : area.querySelector("svg")!;
      expectPixelSprite(svg);
      expect(svg.querySelector("pattern")).toHaveAttribute(
        "patternUnits",
        "userSpaceOnUse",
      );
      expect(svg.querySelector("g")!.getAttribute("style")).toContain(
        "scale(var(--px-scale))",
      );
    }
  });

  it.each(["side", "top", "bottom"] as const)(
    "the %s tile has three depth layers on a forest floor",
    (name) => {
      const used = tokens(FOREST[name]);
      // Floor and dark understory / shade.
      expect(used).toEqual(expect.arrayContaining(["leaf-600", "leaf-900"]));
      // Trees: shaded crowns lit from the top left…
      expect(used).toEqual(
        expect.arrayContaining(["leaf-800", "leaf-500", "leaf-300"]),
      );
      // …on wooden trunks (the bottom band's trunks run off the page edge).
      if (name !== "bottom")
        expect(used).toEqual(expect.arrayContaining(["wood-600", "wood-900"]));
      // Near layer: mossy rocks and flowering bushes.
      expect(used).toEqual(expect.arrayContaining(["stone-400", "stone-800"]));
    },
  );

  it("tiles seamlessly: the side tile wraps top to bottom, the bands wrap sideways", () => {
    const side = FOREST.side.canvas;
    let same = 0;
    for (let x = 0; x < side.width; x++)
      if (side.get(x, 0) && side.get(x, side.height - 1)) same++;
    expect(same).toBe(side.width);
    expect(FOREST.top.canvas.width).toBe(FOREST.bottom.canvas.width);
  });

  it("varies the top and bottom bands so the tiling does not look regular", () => {
    expect(FOREST.top.paths).not.toEqual(FOREST.bottom.paths);
  });

  it("is the same on every render (seeded)", () => {
    expect(renderToStaticMarkup(<ForestBackground />)).toBe(
      renderToStaticMarkup(<ForestBackground />),
    );
  });

  it("uses design tokens only — no raw hex colours in the markup", () => {
    expectTokensOnly(renderToStaticMarkup(<ForestBackground />));
  });

  it("is static: no SVG or CSS animation", () => {
    const html = renderToStaticMarkup(<ForestBackground />);
    expect(html).not.toMatch(/<animate|<set\b|animate-|transition/);
  });
});

describe("ForestBackground — AC2: frame around the field", () => {
  it("fills its positioned parent behind the content", () => {
    const { root } = renderForest();
    expect(root).toHaveClass("absolute", "inset-0", "-z-10");
  });

  it("renders left and right panels sized by --forest-side", () => {
    const { container } = renderForest();
    for (const part of ["side-left", "side-right"]) {
      const panel = container.querySelector(`[data-forest-part="${part}"]`);
      expect(panel).toHaveClass("inset-y-0", "h-full", "w-(--forest-side)");
    }
  });

  it("renders top and bottom bands sized by --forest-band, the bottom one showing its tile's foot", () => {
    const { container } = renderForest();
    expect(container.querySelector('[data-forest-part="band-top"]')).toHaveClass(
      "top-0",
      "h-(--forest-band)",
    );
    const bottom = container.querySelector('[data-forest-part="band-bottom"]')!;
    expect(bottom).toHaveClass("bottom-0", "h-(--forest-band)", "overflow-hidden");
    expect(bottom.querySelector("svg")).toHaveClass("bottom-0", "h-[calc(72*var(--px))]");
  });

  it("defines a narrow border below 1024px and wide side panels from 1024px", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toMatch(/:root\s*\{[^}]*--forest-side:\s*1rem;/);
    expect(css).toMatch(
      /@media \(min-width: 64rem\)\s*\{\s*:root\s*\{\s*--forest-side:\s*max\(9rem/,
    );
  });
});

describe("ForestBackground — AC3: decorative", () => {
  it('has aria-hidden="true" and does not take pointer events', () => {
    const { root } = renderForest();
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("pointer-events-none");
  });

  it("contains nothing focusable", () => {
    const { root } = renderForest();
    expect(
      root.querySelectorAll("a, button, input, select, textarea, [tabindex]"),
    ).toHaveLength(0);
    root
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("focusable", "false"));
  });

  it("exposes no text or accessible names", () => {
    const { root } = renderForest();
    expect(root.textContent).toBe("");
    expect(root.querySelectorAll("title, desc, [aria-label]")).toHaveLength(0);
  });
});

describe("ForestBackground — AC4: inline SVG, ≤ 150 KB gzipped", () => {
  it("uses no raster images", () => {
    const html = renderToStaticMarkup(<ForestBackground />);
    expect(html).not.toMatch(/<img|<image|<picture|<canvas/);
    expect(html).not.toMatch(/data:image|\.(png|jpe?g|gif|webp|avif)\b/i);
  });

  it("weighs at most 150 KB gzipped", () => {
    const html = renderToStaticMarkup(<ForestBackground />);
    const gzipped = gzipSync(html).byteLength;
    expect(gzipped).toBeLessThanOrEqual(150 * 1024);
  });
});
