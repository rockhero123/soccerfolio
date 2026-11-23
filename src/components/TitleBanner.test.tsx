import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { contrast, overlay, token } from "@/test/contrast";
import { expectTokensOnly } from "@/test/pixel";
import { VIGNETTE } from "./FilmOverlay";
import TitleBanner from "./TitleBanner";

afterEach(cleanup);

function renderBanner() {
  const { container } = render(
    <TitleBanner title="Skills" headingId="skills-title" />,
  );
  return container.querySelector("[data-title-banner]") as HTMLElement;
}

describe("TitleBanner — AC1: <h2> on a title banner with GrassStrip", () => {
  it("renders the title as an <h2> with the given id, in the heading font", () => {
    renderBanner();
    const heading = screen.getByRole("heading", { level: 2, name: "Skills" });
    expect(heading).toHaveAttribute("id", "skills-title");
    expect(heading).toHaveClass("font-heading");
  });

  it("grows pixel grass in front of the plank's bottom edge", () => {
    const grass = renderBanner().querySelector("[data-grass-strip]")!;
    expect(grass).toHaveClass("absolute", "-bottom-[calc(2*var(--px))]");
  });
});

describe("TitleBanner — a pixel wooden sign with the title burned into it", () => {
  it("draws a light-wood pixel plank with a knot and two nails", () => {
    const banner = renderBanner();
    expect(banner.querySelector('[data-wood="plank"]')).toHaveClass(
      "pixel-frame-wood",
    );
    expect(banner.querySelector('[data-wood="knot"]')).not.toBeNull();
    expect(banner.querySelectorAll('[data-wood="nail"]')).toHaveLength(2);
    banner
      .querySelectorAll("[data-wood] path")
      .forEach((p) => expect(p.getAttribute("fill")).toMatch(/^var\(--color-/));
  });

  it("burns the title into the wood: ink letters with a light pixel lip", () => {
    const heading = renderBanner().querySelector("h2")!;
    expect(heading).toHaveClass("text-ink", "uppercase");
    expect(heading.className).toContain(
      "[text-shadow:0_calc(var(--px)*0.5)_0_var(--color-wood-200)]",
    );
  });

  it("keeps all the wood art decorative", () => {
    const banner = renderBanner();
    const art = banner.querySelector('[aria-hidden="true"]')!;
    banner.querySelectorAll("svg").forEach((svg) => {
      expect(art).toContainElement(svg as unknown as HTMLElement);
      expect(svg).toHaveAttribute("focusable", "false");
    });
  });

  it("uses design tokens only", () => {
    expectTokensOnly(
      renderToStaticMarkup(<TitleBanner title="T" headingId="t" />),
    );
  });
});

describe("TitleBanner — burned-in text stays WCAG AA (manifest §6: ink on light wood)", () => {
  const ink = token("ink");
  const vignette = (c: ReturnType<typeof token>) => overlay(c, ink, VIGNETTE);

  it.each([
    ["the boards", "wood-300"],
    ["a board seam", "wood-400"],
    ["the top highlight", "wood-200"],
  ])("ink letters on %s are at least 4.5:1, even under the vignette", (_, wood) => {
    expect(contrast(ink, vignette(token(wood)))).toBeGreaterThanOrEqual(4.5);
  });
});
