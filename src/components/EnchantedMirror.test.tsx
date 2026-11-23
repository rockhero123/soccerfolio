import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { hero } from "@/content/hero";
import { site } from "@/content/site";
import { contrast, overlay, token } from "@/test/contrast";
import { expectTokensOnly } from "@/test/pixel";
import EnchantedMirror from "./EnchantedMirror";
import { VIGNETTE } from "./FilmOverlay";

afterEach(cleanup);

function renderMirror() {
  const { container } = render(
    <EnchantedMirror portrait={<svg role="img" aria-label="Portrait" />} />,
  );
  const frame = container.querySelector('[data-mirror="frame"]') as HTMLElement;
  return { container, frame };
}

describe("EnchantedMirror — AC1: an enchanted pixel mirror with grass", () => {
  it("draws a bevelled pixel stone-silver frame around mint glass", () => {
    const { frame } = renderMirror();
    const glass = frame.querySelector(".pixel-frame-stone")!;
    expect(glass).not.toBeNull();
    // Four gold corner studs on the frame, and a gold crest on top.
    expect(glass.querySelectorAll(":scope > svg:not([data-mirror])")).toHaveLength(4);
    expect(frame.querySelector('[data-mirror="crest"]')).not.toBeNull();
  });

  it("is magical: pixel sparkles around it and a stepped shine on the glass", () => {
    const { frame } = renderMirror();
    expect(frame.querySelectorAll('[data-mirror="sparkle"]')).toHaveLength(3);
    const shine = frame.querySelector('[data-mirror="shine"]')!;
    expect(shine).toHaveClass("opacity-60");
    expect(shine.querySelector('path[fill="var(--color-paper-100)"]')).not.toBeNull();
  });

  it("grows pixel grass along its bottom edge", () => {
    const { frame } = renderMirror();
    expect(frame.querySelector("[data-grass-strip]")).toHaveClass("absolute");
  });

  it("holds the portrait inside the glass", () => {
    const { frame } = renderMirror();
    const glass = frame.querySelector(".pixel-frame-stone")!;
    expect(glass).toContainElement(screen.getByRole("img", { name: "Portrait" }));
  });

  it("keeps all the ornaments decorative", () => {
    const { frame } = renderMirror();
    frame
      .querySelectorAll('svg[shape-rendering="crispEdges"]')
      .forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });
});

describe("EnchantedMirror — AC2/AC3: nickname and role", () => {
  it('shows "Richi" as the only <h1>, named "Ricardo Martinez (Richi)"', () => {
    const { frame } = renderMirror();
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toHaveAccessibleName("Ricardo Martinez (Richi)");
    expect(h1).toHaveClass("font-heading");
    expect(h1.querySelector('[aria-hidden="true"]')).toHaveTextContent(/^Richi$/);
    expect(h1.querySelector(".sr-only")).toHaveTextContent(
      /^Ricardo Martinez \(Richi\)$/,
    );
    expect(frame.querySelectorAll("h1")).toHaveLength(1);
  });

  it("shows the role below the name in regular weight, on a riveted pixel nameplate", () => {
    const { frame } = renderMirror();
    const role = frame.querySelector('[data-mirror="role"]')!;
    expect(role).toHaveTextContent("Software Engineer");
    expect(role).toHaveClass("font-body", "font-normal", "pixel-button", "bg-stone-200");
    expect(role.querySelectorAll('[data-mirror="rivet"]')).toHaveLength(2);
    const h1 = frame.querySelector("h1")!;
    expect(
      h1.compareDocumentPosition(role) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("EnchantedMirror — AC4: name and role from the content files", () => {
  it("takes the nickname, full name and role from hero.ts / site.ts", () => {
    expect(hero.nickname).toBe("Richi");
    expect(hero.name).toBe(site.name);
    expect(hero.role).toBe(site.role);
    expect(site.role).toBe("Software Engineer");
  });
});

describe("EnchantedMirror — AC5: readable text in tokens only", () => {
  const ink = token("ink");
  const darken = (c: ReturnType<typeof token>) => overlay(c, ink, VIGNETTE);

  it("puts ink text on the mint glass and the light stone plate, ≥ 4.5:1 under the vignette", () => {
    const { frame } = renderMirror();
    expect(frame.querySelector(".pixel-frame-stone > div")).toHaveClass("text-ink");
    for (const surface of ["mint", "stone-200"])
      expect(contrast(ink, darken(token(surface)))).toBeGreaterThanOrEqual(4.5);
  });

  it("uses design tokens only", () => {
    expectTokensOnly(
      renderToStaticMarkup(<EnchantedMirror portrait={<span />} />),
    );
  });
});
