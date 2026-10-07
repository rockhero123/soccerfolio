import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { contrast, overlay, token } from "@/test/contrast";
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

  it("grows grass in front of the plank's bottom edge", () => {
    const grass = renderBanner().querySelector("[data-grass-strip]")!;
    expect(grass).toHaveClass("absolute", "-bottom-1");
  });
});

describe("TitleBanner — a wooden plank with the title engraved in it", () => {
  it("draws a bark plank with a bold ink outline, grain, a knot and two nails", () => {
    const banner = renderBanner();
    const plank = banner.querySelector('[data-wood="plank"]')!;
    expect(plank.querySelector("path.fill-bark")).not.toBeNull();
    expect(
      plank.querySelector("path.stroke-ink.stroke-outline-lg"),
    ).not.toBeNull();
    expect(plank.querySelector("path.stroke-forest-bark-shade")).not.toBeNull();
    expect(banner.querySelector('[data-wood="knot"]')).not.toBeNull();
    // Two nail heads, one at each end.
    expect(
      banner.querySelectorAll("svg circle.fill-forest-bark-shade"),
    ).toHaveLength(2);
  });

  it("keeps the plank's outline and grain the same width however long the title is", () => {
    const plank = renderBanner().querySelector('[data-wood="plank"]')!;
    expect(plank).toHaveAttribute("preserveAspectRatio", "none");
    plank
      .querySelectorAll('path[class*="stroke-"]')
      .forEach((line) =>
        expect(line).toHaveAttribute("vector-effect", "non-scaling-stroke"),
      );
  });

  it("engraves the title: pale wood letters with a dark cut edge and a light lip", () => {
    const heading = renderBanner().querySelector("h2")!;
    expect(heading).toHaveClass("text-parchment");
    expect(heading.className).toContain(
      "[text-shadow:-1px_-2px_0_var(--color-ink),1px_1.5px_0_var(--color-forest-bark-light)]",
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
    const html = renderToStaticMarkup(<TitleBanner title="T" headingId="t" />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
  });
});

describe("TitleBanner — engraved text stays WCAG AA (manifest §6: parchment on bark)", () => {
  const parchment = token("parchment");
  const bark = token("bark");
  const shade = token("forest-bark-shade");

  it.each([
    ["the plank", bark],
    ["a grain line", shade],
    ["the shaded underside", overlay(bark, shade, 0.55)],
  ])("parchment letters on %s are at least 4.5:1", (_, wood) => {
    expect(contrast(parchment, wood)).toBeGreaterThanOrEqual(4.5);
  });
});
