import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { expectTokensOnly } from "@/test/pixel";
import FilmOverlay, { BANDS, VIGNETTE } from "./FilmOverlay";

afterEach(cleanup);

function renderOverlay() {
  const { container } = render(<FilmOverlay />);
  return container.querySelector('[data-testid="film-overlay"]') as HTMLElement;
}

describe("FilmOverlay — AC1: a fixed, full-screen, banded vignette", () => {
  it("covers the whole screen, fixed, above the page", () => {
    expect(renderOverlay()).toHaveClass("fixed", "inset-0", "z-50");
  });

  it("is clear in the centre and darkens towards the edges in hard-edged bands", () => {
    const style = renderOverlay()
      .querySelector('[data-film="vignette"]')!
      .getAttribute("style")!;
    expect(style).toContain("radial-gradient(ellipse at center, transparent 0");
    // Each band starts where the previous one ends: hard edges, no smooth fade.
    for (let i = 0; i < BANDS.length; i++) {
      const [at] = BANDS[i];
      const end = BANDS[i + 1]?.[0] ?? 100;
      expect(style).toContain(`${at}% ${end}%`);
    }
    // Bands get darker towards the edge, up to VIGNETTE.
    const alphas = BANDS.map(([, alpha]) => alpha);
    expect([...alphas].sort((a, b) => a - b)).toEqual(alphas);
    expect(alphas.at(-1)).toBe(VIGNETTE);
  });

  it("keeps the effect subtle and has no film grain", () => {
    expect(VIGNETTE).toBeLessThanOrEqual(0.15);
    expect(renderOverlay().querySelector("feTurbulence")).toBeNull();
  });

  it("uses design tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<FilmOverlay />));
  });
});

describe("FilmOverlay — AC2: never blocks the page", () => {
  it("takes no pointer events and is hidden from assistive tech", () => {
    const overlay = renderOverlay();
    expect(overlay).toHaveClass("pointer-events-none");
    expect(overlay).toHaveAttribute("aria-hidden", "true");
    expect(overlay.textContent).toBe("");
  });
});

describe("FilmOverlay — AC3: respects prefers-reduced-motion", () => {
  it("is not rendered (display: none) when the visitor prefers reduced motion", () => {
    expect(renderOverlay()).toHaveClass("motion-reduce:hidden");
  });
});

describe("FilmOverlay — AC4: no scroll jank", () => {
  it("is static CSS: no animation, transition or script", () => {
    const html = renderToStaticMarkup(<FilmOverlay />);
    expect(html).not.toMatch(/<animate|<set\b|<script|animate-|transition/);
  });
});
