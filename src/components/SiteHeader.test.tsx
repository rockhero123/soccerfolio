import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { site } from "@/content/site";
import SiteHeader from "./SiteHeader";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

const nav = () => screen.getByRole("navigation", { name: "Main" });
const menuButton = () => screen.getByRole("button", { name: /menu/i });
const menu = () => document.getElementById("site-menu")!;

describe("SiteHeader — AC1: a wooden sign with the logo and section links", () => {
  it("is a fixed, wooden sign at the top of the screen", () => {
    const { container } = render(<SiteHeader />);
    expect(container.querySelector("[data-site-header]")).toHaveClass(
      "fixed",
      "top-0",
      "z-40",
    );
    const plank = nav().querySelector('[data-wood="plank"]')!;
    expect(plank.querySelector("path.fill-bark")).not.toBeNull();
    expect(plank.querySelector("path.stroke-ink")).not.toBeNull();
  });

  it('shows the "RM" logo linking to #hero', () => {
    render(<SiteHeader />);
    const logo = within(nav()).getByRole("link", { name: /^RM/ });
    expect(logo).toHaveAttribute("href", "#hero");
    expect(logo).toHaveTextContent("RM");
  });

  it("takes its links from site.nav, engraved in parchment", () => {
    render(<SiteHeader />);
    const desktop = nav().querySelector("ul")!;
    const links = within(desktop).getAllByRole("link");
    expect(links.map((l) => [l.textContent, l.getAttribute("href")])).toEqual(
      site.nav.map(({ label, href }) => [label, href]),
    );
    links.forEach((l) =>
      expect(l).toHaveClass("text-parchment", "font-heading"),
    );
  });
});

describe("SiteHeader — AC3: hamburger menu below 768px", () => {
  it("shows the links on wide screens and a menu button on narrow ones", () => {
    render(<SiteHeader />);
    expect(nav().querySelector("ul")).toHaveClass("hidden", "md:flex");
    expect(menuButton()).toHaveClass("md:hidden");
    expect(menu()).toHaveClass("md:hidden");
  });

  it("opens and closes when the button is pressed", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menuButton()).toHaveAttribute("aria-controls", "site-menu");
    expect(menu()).not.toBeVisible();

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "true");
    expect(menuButton()).toHaveAccessibleName("Close menu");
    expect(menu()).toBeVisible();

    await user.click(menuButton());
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    expect(menu()).not.toBeVisible();
  });

  it("opens with the keyboard, and Esc closes it and returns focus to the button", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    menuButton().focus();
    await user.keyboard("{Enter}");
    expect(menu()).toBeVisible();
    await user.tab();
    await user.keyboard("{Escape}");
    expect(menu()).not.toBeVisible();
    expect(menuButton()).toHaveFocus();
  });

  it("closes when a link is chosen", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(menuButton());
    await user.click(within(menu()).getByRole("link", { name: "Projects" }));
    expect(menu()).not.toBeVisible();
  });

  it("closes on a click or tap outside the sign", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SiteHeader />
        <p>Outside</p>
      </>,
    );
    await user.click(menuButton());
    await user.click(screen.getByText("Outside"));
    expect(menu()).not.toBeVisible();
  });

  it("lists every site.nav link in the menu", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(menuButton());
    expect(
      within(menu())
        .getAllByRole("link")
        .map((l) => l.getAttribute("href")),
    ).toEqual(site.nav.map((l) => l.href));
  });
});

describe("SiteHeader — AC4: highlights the section in view", () => {
  function addSections(tops: Record<string, number>) {
    for (const [id, top] of Object.entries(tops)) {
      const section = document.createElement("section");
      section.id = id;
      section.getBoundingClientRect = () => ({ top }) as DOMRect;
      document.body.append(section);
    }
  }

  it("marks the link of the section that has scrolled into view with a yellow underline", () => {
    addSections({ hero: -900, skills: 100, projects: 700, contact: 1400 });
    render(<SiteHeader />);
    const desktop = nav().querySelector("ul")!;
    const current = within(desktop).getByRole("link", { name: "Skills" });
    expect(current).toHaveAttribute("aria-current", "location");
    expect(current).toHaveClass("border-cartoon-yellow");
    for (const name of ["Projects", "Contact"]) {
      const other = within(desktop).getByRole("link", { name });
      expect(other).not.toHaveAttribute("aria-current");
      expect(other).toHaveClass("border-transparent");
    }
  });

  it("follows the reader as they scroll", async () => {
    const tops = { hero: 0, skills: 900, projects: 1800, contact: 2700 };
    addSections(tops);
    render(<SiteHeader />);
    expect(screen.queryAllByRole("link", { current: "location" })).toHaveLength(
      0,
    );
    for (const [id, top] of Object.entries({
      hero: -2000,
      skills: -1100,
      projects: 50,
      contact: 950,
    })) {
      document.getElementById(id)!.getBoundingClientRect = () =>
        ({ top }) as DOMRect;
    }
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    const desktop = nav().querySelector("ul")!;
    await waitFor(() =>
      expect(
        within(desktop).getByRole("link", { name: "Projects" }),
      ).toHaveAttribute("aria-current", "location"),
    );
  });
});

describe("SiteHeader — AC2/AC5: smooth scrolling under the sign, unless reduced motion", () => {
  const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

  it("offsets scrolled-to sections by the header height", () => {
    expect(css).toMatch(
      /html\s*\{\s*scroll-padding-top:\s*var\(--header-offset\);/,
    );
    expect(css).toMatch(/--header-offset:\s*\d/);
  });

  it("scrolls smoothly only when the visitor has no reduced-motion preference", () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*html\s*\{\s*scroll-behavior:\s*smooth;/,
    );
    const outside = css.replace(
      /@media \(prefers-reduced-motion: no-preference\)[\s\S]*?\}\s*\}/,
      "",
    );
    expect(outside).not.toMatch(/scroll-behavior:\s*smooth/);
  });
});
