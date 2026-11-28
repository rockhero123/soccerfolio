import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import { contrast, overlay, token } from "@/test/contrast";
import { expectTokensOnly } from "@/test/pixel";
import { VIGNETTE } from "./FilmOverlay";
import IntroSign from "./IntroSign";

afterEach(cleanup);

function renderSign() {
  const { container } = render(<IntroSign />);
  const sign = container.querySelector("[data-intro-sign]") as HTMLElement;
  return { sign, text: sign.querySelector("p")! };
}

describe("IntroSign — AC1: the intro burned into a pixel wooden plank", () => {
  it("draws the same pixel wooden plank as the section title banners", () => {
    const { sign } = renderSign();
    expect(sign.querySelector('[data-wood="plank"]')).toHaveClass(
      "pixel-frame-wood",
    );
    expect(sign.querySelectorAll('[data-wood="nail"]')).toHaveLength(2);
  });

  it("burns the text into the light wood in ink", () => {
    const { text } = renderSign();
    expect(text).toHaveClass("text-ink");
  });

  it("rings every letter with a light-wood halo, so the board seams never cross the strokes", () => {
    const { text } = renderSign();
    const shadow = [...text.classList].find((c) => c.startsWith("[text-shadow:"))!;
    // Eight directions, all in wood-200 (lighter than the wood-400 seams).
    expect(shadow.match(/var\(--color-wood-200\)/g)).toHaveLength(8);
    expect(shadow).not.toMatch(/wood-[3-9]00/);
  });

  it("uses tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<IntroSign />));
  });
});

describe("IntroSign — AC2: text from src/content/hero.ts", () => {
  it("shows hero.intro", () => {
    const { text } = renderSign();
    expect(hero.intro.length).toBeGreaterThan(40);
    expect(text).toHaveTextContent(hero.intro);
  });
});

describe("IntroSign — AC4: readable engraved text", () => {
  it("is large and bold enough to hold its own next to the mirror", () => {
    const { text } = renderSign();
    expect(text).toHaveClass(
      "text-xl",
      "md:text-2xl",
      "font-medium",
      "leading-relaxed",
      "font-body",
    );
  });

  it("comes out from behind the mirror: it overlaps it on both layouts", () => {
    const { sign } = renderSign();
    expect(sign).toHaveClass("-mt-10", "md:mt-0", "md:-ml-12");
  });

  const ink = token("ink");
  const woods = [
    ["the boards", token("wood-300")],
    ["a board seam", token("wood-400")],
    ["the top highlight", token("wood-200")],
  ] as const;

  it.each(woods)(
    "ink text on %s stays at least 4.5:1, even under the vignette",
    (_, wood) => {
      expect(contrast(ink, overlay(wood, ink, VIGNETTE))).toBeGreaterThanOrEqual(
        4.5,
      );
    },
  );
});
