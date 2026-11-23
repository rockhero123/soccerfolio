import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import { contrast, overlay, token } from "@/test/contrast";
import { VIGNETTE } from "../FilmOverlay";
import ProjectBrowser from "./ProjectBrowser";
import {
  ALL,
  countLabel,
  filterOptions,
  filterProjects,
} from "./projectFilters";

afterEach(cleanup);

const titles = () =>
  screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
const group = () =>
  screen.getByRole("group", { name: "Filter projects by category" });

describe("filter logic", () => {
  it("offers All, then each category in order of first appearance", () => {
    expect(filterOptions(projects)).toEqual([
      "All",
      "Web",
      "Mobile app",
      "Interactive installation",
      "Java game",
    ]);
  });

  it("returns every project for All and only that category otherwise", () => {
    expect(filterProjects(projects, ALL)).toEqual(projects);
    expect(filterProjects(projects, "Web").map((p) => p.title)).toEqual([
      "Jogo",
      "Ingaser",
    ]);
    expect(filterProjects(projects, "Java game").map((p) => p.title)).toEqual([
      "Hockey Town",
      "Wild Friends",
    ]);
  });

  it("phrases the count for screen readers", () => {
    expect(countLabel(1)).toBe("1 project");
    expect(countLabel(3)).toBe("3 projects");
  });
});

describe("ProjectBrowser — AC1: All plus one button per category", () => {
  it("renders the filter buttons from projects.ts", () => {
    render(<ProjectBrowser />);
    expect(
      within(group())
        .getAllByRole("button")
        .map((b) => b.textContent),
    ).toEqual(filterOptions(projects));
  });
});

describe("ProjectBrowser — AC2/AC3: filtering, with aria-pressed", () => {
  it("shows every project with All pressed by default", () => {
    render(<ProjectBrowser />);
    expect(titles()).toHaveLength(projects.length);
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows only the chosen category and moves aria-pressed and the highlight", async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser />);
    await user.click(
      screen.getByRole("button", { name: "Interactive installation" }),
    );
    expect(titles()).toEqual(["Sensturo", "Move On"]);
    within(group())
      .getAllByRole("button")
      .forEach((b) => {
        const on = b.textContent === "Interactive installation";
        expect(b).toHaveAttribute("aria-pressed", String(on));
        expect(b).toHaveClass("pixel-button", on ? "bg-pitch-dark" : "bg-paper-200");
      });
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(titles()).toHaveLength(projects.length);
  });
});

describe("ProjectBrowser — AC4: the count is announced", () => {
  it("updates a polite live region with the number of projects shown", async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("");
    await user.click(screen.getByRole("button", { name: "Web" }));
    expect(status).toHaveTextContent("2 projects");
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(status).toHaveTextContent(`${projects.length} projects`);
  });
});

describe("ProjectBrowser — AC5: keyboard, wrapping and contrast", () => {
  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<ProjectBrowser />);
    screen.getByRole("button", { name: "All" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Web" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Web" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await user.tab();
    await user.keyboard(" ");
    expect(screen.getByRole("button", { name: "Mobile app" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("wraps the buttons on small screens", () => {
    render(<ProjectBrowser />);
    expect(group()).toHaveClass("flex", "flex-wrap");
  });

  it.each([
    ["active", "chalk", "pitch-dark"],
    ["inactive", "ink", "paper-200"],
    ["hovered", "ink", "gold-500"],
  ])("%s buttons stay ≥ 4.5:1, even under the vignette", (_, text, bg) => {
    const ink = token("ink");
    const dark = (c: ReturnType<typeof token>) => overlay(c, ink, VIGNETTE);
    expect(contrast(token(text), token(bg))).toBeGreaterThanOrEqual(4.5);
    expect(contrast(dark(token(text)), dark(token(bg)))).toBeGreaterThanOrEqual(
      4.5,
    );
  });
});
