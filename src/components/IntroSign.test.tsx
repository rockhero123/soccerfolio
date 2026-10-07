import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import { contrast, overlay, token } from "@/test/contrast";
import { GRAIN, VIGNETTE } from "./FilmOverlay";
import IntroSign from "./IntroSign";

afterEach(cleanup);

function renderSign() {
  const { container } = render(<IntroSign />);
  const sign = container.querySelector("[data-intro-sign]") as HTMLElement;
  return { sign, text: sign.querySelector("p")! };
}

describe("IntroSign — AC1: the intro engraved on a wooden plank", () => {
  it("draws the same wooden plank as the section title banners", () => {
    const { sign } = renderSign();
    const plank = sign.querySelector('[data-wood="plank"]')!;
    expect(plank.querySelector("path.fill-bark")).not.toBeNull();
    expect(sign.querySelectorAll('[data-wood="nail"]')).toHaveLength(2);
  });

  it("engraves the text in parchment with a dark cut edge and a shadowed groove", () => {
    const { text } = renderSign();
    expect(text).toHaveClass("text-parchment");
    expect(text.className).toContain(
      "[text-shadow:-1px_-1.5px_0_var(--color-ink),1px_1.5px_0_var(--color-forest-bark-shade)]",
    );
  });

  it("uses tokens only", () => {
    const html = renderToStaticMarkup(<IntroSign />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
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
      "font-bold",
      "leading-relaxed",
      "font-body",
    );
  });

  it("comes out from behind the mirror: it overlaps it on both layouts", () => {
    const { sign } = renderSign();
    expect(sign).toHaveClass("-mt-10", "md:mt-0", "md:-ml-12");
  });

  const parchment = token("parchment");
  const bark = token("bark");
  const shade = token("forest-bark-shade");
  const ink = token("ink");
  const woods = [
    ["the plank", bark],
    ["a grain line", shade],
    ["the shaded underside", overlay(bark, shade, 0.55)],
  ] as const;

  it.each(woods)("parchment text on %s is at least 4.5:1", (_, wood) => {
    expect(contrast(parchment, wood)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(woods)(
    "parchment text on %s stays at least 4.5:1 under the film overlay",
    (_, wood) => {
      const darkest = (c: typeof parchment) =>
        overlay(c, ink, VIGNETTE + GRAIN);
      const lightSpeck = (c: typeof parchment) =>
        overlay(overlay(c, ink, VIGNETTE), parchment, GRAIN);
      expect(
        contrast(darkest(parchment), darkest(wood)),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(lightSpeck(parchment), lightSpeck(wood)),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
