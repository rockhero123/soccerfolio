import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { site } from "@/content/site";
import Home from "./page";

afterEach(cleanup);

function renderHome() {
  const { container } = render(<Home />);
  const field = screen.getByTestId("soccer-field");
  return { container, field };
}

describe("Home page — AC1: sections on the soccer field", () => {
  it("renders hero, skills, projects and contact, in that order, inside SoccerField", () => {
    const { field } = renderHome();
    const ids = [...field.querySelectorAll("section")].map((s) => s.id);
    expect(ids).toEqual(["hero", "skills", "projects", "contact"]);
  });

  it("plays hero, skills and projects on the bright grass and contact on the dark grass", () => {
    const { field } = renderHome();
    const play = field.querySelector('[data-field-zone="play"]')!;
    const contact = field.querySelector('[data-field-zone="contact"]')!;
    for (const id of ["hero", "skills", "projects"]) {
      expect(play.querySelector(`section#${id}`)).not.toBeNull();
    }
    expect(contact.querySelector("section#contact")).not.toBeNull();
  });

  it.each(site.sections)(
    "section #$id starts with its <h2> on a title banner with grass, and is labelled by it",
    ({ id, title }) => {
      renderHome();
      const section = document.getElementById(id)!;
      const banner = section.firstElementChild!;
      expect(banner).toHaveAttribute("data-title-banner");
      const heading = within(section).getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent(title);
      expect(banner).toContainElement(heading);
      expect(banner.querySelector("[data-grass-strip]")).not.toBeNull();
      expect(section).toHaveAttribute("aria-labelledby", heading.id);
    },
  );

  it("keeps the name as the only <h1>, in the hero", () => {
    renderHome();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(site.name);
    expect(document.getElementById("hero")).toContainElement(h1s[0]);
  });

  it("puts placeholder text on surfaces, never straight on the grass (manifest §6)", () => {
    const { field } = renderHome();
    field.querySelectorAll("section p, section h1").forEach((text) => {
      expect(
        text.closest(".bg-mint, [data-title-banner], [data-intro-sign]"),
      ).not.toBeNull();
    });
  });

  it("takes section titles from src/content/site.ts", () => {
    expect(site.sections.map((s) => s.id)).toEqual([
      "hero",
      "skills",
      "projects",
      "contact",
    ]);
  });

  it("uses design tokens, not starter utility classes", () => {
    const { container } = renderHome();
    expect(container.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,6}\b(?![-\w])/);
    expect(container.innerHTML).not.toMatch(/zinc-|dark:/);
  });

  it("no longer contains create-next-app starter content", () => {
    const { container } = renderHome();
    expect(container).not.toHaveTextContent(/to get started/i);
    expect(container).not.toHaveTextContent(/deploy now/i);
    // The starter's logos are gone (the page has its own project images).
    expect(
      container.querySelector('img[src*="next.svg"], img[src*="vercel.svg"]'),
    ).toBeNull();
    expect(container.querySelector('a[href*="vercel.com"]')).toBeNull();
  });
});

describe("Home page — section spacing (owner layout fix)", () => {
  it("pads every section and separates its title banner from the content", () => {
    renderHome();
    for (const id of ["hero", "skills", "projects", "contact"]) {
      expect(document.getElementById(id)).toHaveClass(
        "py-10",
        "md:py-16",
        "gap-10",
        "md:gap-14",
      );
    }
  });
});

describe("Home page — AC3: content width", () => {
  it("centres the content in both field zones at a maximum of 1100px", () => {
    const { field } = renderHome();
    const wrappers = field.querySelectorAll("[data-field-content] > div");
    expect(wrappers).toHaveLength(2);
    wrappers.forEach((w) =>
      expect(w).toHaveClass("mx-auto", "w-full", "max-w-[68.75rem]"),
    );
  });
});
