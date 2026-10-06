import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import ForestBackground from "./ForestBackground";

afterEach(cleanup);

function renderForest() {
  const { container } = render(<ForestBackground />);
  const root = container.firstElementChild as HTMLElement;
  return { container, root };
}

const TILE_IDS = [
  "forest-side-tile",
  "forest-band-top-tile",
  "forest-band-bottom-tile",
];

describe("ForestBackground — AC1: original layered SVG forest", () => {
  it.each(TILE_IDS)(
    "%s has distant, mid and near depth layers, painted back to front",
    (tileId) => {
      const { container } = renderForest();
      const pattern = container.querySelector(`pattern#${tileId}`);
      expect(pattern).not.toBeNull();
      const layers = [
        ...pattern!.querySelectorAll(":scope > g > g[id]"),
      ].map((g) => g.id);
      expect(layers).toEqual([
        `${tileId}-distant`,
        `${tileId}-mid`,
        `${tileId}-near`,
      ]);
      for (const id of layers) {
        expect(
          pattern!.querySelector(`#${id}`)!.querySelectorAll("path").length,
        ).toBeGreaterThan(3);
      }
    },
  );

  it("draws pale distant trees with mixed, washed-out token colours", () => {
    const { container } = renderForest();
    const distant = container.querySelector("#forest-side-tile-distant")!;
    expect(distant.querySelector(".fill-forest-distant-wood")).not.toBeNull();
    expect(distant.querySelector(".fill-forest-distant-leaf")).not.toBeNull();
    expect(distant.querySelector(".fill-forest-deep")).toBeNull();
  });

  it("draws mid trees with bark trunks and thick ink outlines (outline token)", () => {
    const { container } = renderForest();
    const mid = container.querySelector("#forest-side-tile-mid")!;
    expect(mid.querySelector("path.fill-bark")).not.toBeNull();
    const outlines = mid.querySelectorAll('path[data-ink="outline"].stroke-ink');
    expect(outlines.length).toBeGreaterThan(3);
  });

  it("draws dark foreground foliage in forest-deep with large ink outlines and moss details", () => {
    const { container } = renderForest();
    const near = container.querySelector("#forest-side-tile-near")!;
    expect(
      near.querySelectorAll("path.fill-forest-deep").length,
    ).toBeGreaterThan(3);
    const outlines = near.querySelectorAll(
      'path[data-ink="outline"].stroke-ink.stroke-outline-lg',
    );
    expect(outlines.length).toBeGreaterThan(3);
    expect(near.querySelector(".stroke-moss")).not.toBeNull();
  });

  it("takes outline widths from the SOC-2 outline tokens, not hard-coded numbers", () => {
    const { container } = renderForest();
    const outlines = container.querySelectorAll('[data-ink="outline"]');
    expect(outlines.length).toBeGreaterThan(20);
    outlines.forEach((outline) => {
      expect(outline).not.toHaveAttribute("stroke-width");
      const usesToken =
        outline.matches(".stroke-outline, .stroke-outline-lg") ||
        /var\(--stroke-width-outline(-lg)?\)/.test(
          outline.getAttribute("style") ?? "",
        );
      expect(usesToken).toBe(true);
    });
  });

  it("inks outlines unevenly: a wobble filter and heavier shadow-side ink shapes", () => {
    const { container } = renderForest();
    for (const tileId of TILE_IDS) {
      const pattern = container.querySelector(`pattern#${tileId}`)!;
      const filterRef = pattern
        .querySelector(":scope > g")!
        .getAttribute("filter")!;
      const filterId = filterRef.match(/^url\(#(.+)\)$/)![1];
      const filter = container.querySelector(`filter#${filterId}`)!;
      expect(filter.querySelector("feDisplacementMap")).not.toBeNull();
    }
    expect(
      container.querySelectorAll("#forest-side-tile-near path.fill-ink[transform]")
        .length,
    ).toBeGreaterThan(3);
  });

  it("paints a static watercolour wash and grain inside the shapes only", () => {
    const { container } = renderForest();
    container.querySelectorAll("filter").forEach((filter) => {
      expect(
        filter.querySelectorAll("feTurbulence").length,
      ).toBeGreaterThanOrEqual(3);
      filter
        .querySelectorAll("feTurbulence")
        .forEach((noise) => expect(noise).toHaveAttribute("stitchTiles", "stitch"));
      const last = filter.lastElementChild!;
      expect(last.tagName).toBe("feComposite");
      expect(last).toHaveAttribute("operator", "atop");
    });
  });

  it("varies the top and bottom bands so the tiling does not look regular", () => {
    const { container } = renderForest();
    const top = container.querySelector("pattern#forest-band-top-tile")!;
    const bottom = container.querySelector("pattern#forest-band-bottom-tile")!;
    // The tile is wider than a 1280px screen, so it never repeats there.
    expect(Number(top.getAttribute("width"))).toBeGreaterThan(1280);
    const shapes = (p: Element) =>
      [...p.querySelectorAll("path")].map((path) => path.getAttribute("d"));
    expect(shapes(top)).not.toEqual(shapes(bottom));
  });

  it("does not draw curly moss strokes on foliage that could read as faces", () => {
    const { container } = renderForest();
    container
      .querySelectorAll("[id$='-near'] path.stroke-moss")
      .forEach((detail) =>
        // Moss details are only leaf veins, which start at the leaf base.
        expect(detail.getAttribute("d")).toMatch(/^M0 -4Q/),
      );
  });

  it("uses design tokens only — no raw hex colours in the markup", () => {
    const html = renderToStaticMarkup(<ForestBackground />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke|flood-color)="(?!url\(|none)/);
  });

  it("defines its muted colours as @theme tokens mixed from moss, bark and forest-deep", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const theme = [...css.matchAll(/@theme static\s*\{([^}]*)\}/g)]
      .map((m) => m[1])
      .join("\n");
    const mix = (name: string) =>
      theme.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1] ?? "";
    expect(mix("forest-distant-wood")).toContain("var(--color-bark)");
    expect(mix("forest-distant-leaf")).toContain("var(--color-moss)");
    expect(mix("forest-mid-leaf")).toContain("var(--color-forest-deep)");
    const names = [...theme.matchAll(/--color-(forest-[\w-]+):/g)]
      .map((m) => m[1])
      .filter((name) => name !== "forest-deep");
    expect(names.length).toBeGreaterThanOrEqual(5);
    for (const name of names) {
      expect(mix(name)).toMatch(/^color-mix\(/);
      expect(mix(name)).not.toMatch(/#[0-9a-f]/i);
    }
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

  it("renders top and bottom bands sized by --forest-band", () => {
    const { container } = renderForest();
    expect(container.querySelector('[data-forest-part="band-top"]')).toHaveClass(
      "top-0",
      "h-(--forest-band)",
    );
    expect(
      container.querySelector('[data-forest-part="band-bottom"]'),
    ).toHaveClass("bottom-0", "h-(--forest-band)");
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
