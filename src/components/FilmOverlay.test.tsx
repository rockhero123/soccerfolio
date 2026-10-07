import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import FilmOverlay, { GRAIN, VIGNETTE } from "./FilmOverlay";

afterEach(cleanup);

function renderOverlay() {
  const { container } = render(<FilmOverlay />);
  return container.querySelector('[data-testid="film-overlay"]') as HTMLElement;
}

describe("FilmOverlay — AC1: fixed full-screen film grain and soft vignette", () => {
  it("covers the whole screen, fixed, above the page", () => {
    expect(renderOverlay()).toHaveClass("fixed", "inset-0", "z-50");
  });

  it("adds fine film grain from a static noise tile", () => {
    const overlay = renderOverlay();
    const grain = overlay.querySelector('[data-film="grain"]')!;
    const noise = grain.querySelector("feTurbulence")!;
    expect(noise).toHaveAttribute("stitchTiles", "stitch");
    // Dark ink and light parchment specks, both at the GRAIN opacity.
    const floods = [...grain.querySelectorAll("feFlood")];
    expect(floods.map((f) => f.getAttribute("class"))).toEqual([
      "[flood-color:var(--color-ink)]",
      "[flood-color:var(--color-parchment)]",
    ]);
    floods.forEach((f) =>
      expect(Number(f.getAttribute("flood-opacity"))).toBe(GRAIN),
    );
    expect(
      grain.querySelector('rect[fill="url(#film-grain-tile)"]'),
    ).not.toBeNull();
  });

  it("adds a soft ink vignette that is clear in the centre and VIGNETTE strong at the corners", () => {
    const vignette = renderOverlay().querySelector('[data-film="vignette"]')!;
    expect(vignette.className).toContain(
      "radial-gradient(ellipse_at_center,transparent_",
    );
    expect(vignette.className).toContain(
      `var(--color-ink)_${Math.round(VIGNETTE * 100)}%,transparent)_100%`,
    );
  });

  it("keeps the effect subtle", () => {
    expect(VIGNETTE).toBeLessThanOrEqual(0.15);
    expect(GRAIN).toBeLessThanOrEqual(0.06);
  });

  it("uses design tokens only", () => {
    const html = renderToStaticMarkup(<FilmOverlay />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
  });
});

describe("FilmOverlay — AC2: never blocks the page", () => {
  it("takes no pointer events and is hidden from assistive tech", () => {
    const overlay = renderOverlay();
    expect(overlay).toHaveClass("pointer-events-none");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay.textContent).toBe("");
    overlay
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("focusable", "false"));
  });
});

describe("FilmOverlay — AC3: respects prefers-reduced-motion", () => {
  it("is not rendered (display: none) when the visitor prefers reduced motion", () => {
    expect(renderOverlay()).toHaveClass("motion-reduce:hidden");
  });
});

describe("FilmOverlay — AC4: no scroll jank", () => {
  it("is static CSS and SVG: no animation, transition or script", () => {
    const html = renderToStaticMarkup(<FilmOverlay />);
    expect(html).not.toMatch(/<animate|<set\b|<script|animate-|transition/);
  });
});
