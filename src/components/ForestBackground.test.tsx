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

describe("ForestBackground — AC1: original layered SVG forest", () => {
  it.each(["forest-side-tile", "forest-band-tile"])(
    "%s has distant, mid and near depth layers, painted back to front",
    (tileId) => {
      const { container } = renderForest();
      const pattern = container.querySelector(`pattern#${tileId}`);
      expect(pattern).not.toBeNull();
      const layers = [...pattern!.querySelectorAll(":scope > g[id]")].map(
        (g) => g.id,
      );
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
    expect(distant.querySelector(".fill-\\(--forest-distant-wood\\)")).not.toBeNull();
    expect(distant.querySelector(".fill-\\(--forest-distant-leaf\\)")).not.toBeNull();
    expect(distant.querySelector(".fill-forest-deep")).toBeNull();
  });

  it("draws mid trees with bark trunks and thick ink outlines", () => {
    const { container } = renderForest();
    const mid = container.querySelector("#forest-side-tile-mid")!;
    const trunk = mid.querySelector("path.fill-bark")!;
    expect(trunk).toHaveClass("stroke-ink");
    expect(Number(trunk.getAttribute("stroke-width"))).toBeGreaterThanOrEqual(3);
  });

  it("draws dark foreground foliage in forest-deep with 4px ink outlines and moss details", () => {
    const { container } = renderForest();
    const near = container.querySelector("#forest-side-tile-near")!;
    const clumps = near.querySelectorAll("path.fill-forest-deep.stroke-ink");
    expect(clumps.length).toBeGreaterThan(3);
    clumps.forEach((clump) =>
      expect(clump.getAttribute("stroke-width")).toBe("4"),
    );
    expect(near.querySelector(".stroke-moss")).not.toBeNull();
  });

  it("uses design tokens only — no raw hex colours in the markup", () => {
    const html = renderToStaticMarkup(<ForestBackground />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
  });

  it("mixes its muted colours from the moss, bark and forest-deep tokens", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const mix = (name: string) =>
      css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1] ?? "";
    expect(mix("forest-distant-wood")).toContain("var(--color-bark)");
    expect(mix("forest-distant-leaf")).toContain("var(--color-moss)");
    expect(mix("forest-mid-leaf")).toContain("var(--color-forest-deep)");
    for (const name of [
      "forest-mist",
      "forest-distant-leaf",
      "forest-distant-wood",
      "forest-distant-line",
      "forest-mid-leaf",
    ]) {
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
