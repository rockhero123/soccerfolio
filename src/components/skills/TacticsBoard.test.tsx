import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { skills } from "@/content/skills";
import { expectTokensOnly } from "@/test/pixel";
import TacticsBoard from "./TacticsBoard";

afterEach(cleanup);

const LINEUP = {
  forwards: ["React", "Claude Code", "Kiro Code"],
  midfielders: ["JavaScript", "TypeScript", "Angular"],
  defenders: ["CSS", "SCSS", "MongoDB", "Node.js"],
  goalkeeper: ["HTML"],
};

function renderBoard() {
  const { container } = render(<TacticsBoard />);
  const frame = container.querySelector('[data-board="frame"]') as HTMLElement;
  return { container, frame };
}

describe("TacticsBoard — AC1: a framed pixel board with pitch markings", () => {
  it("has a bevelled wooden pixel frame with nails and a slate surface distinct from the jerseys", () => {
    const { frame } = renderBoard();
    expect(frame).toHaveClass("pixel-frame-board");
    expect(frame.querySelectorAll('[data-board="nail"]')).toHaveLength(4);
    const surface = frame.querySelector('[data-board="surface"]')!;
    expect(surface).toHaveClass("bg-stone-800");
    expect(surface).not.toHaveClass("bg-pitch-dark");
  });

  it("draws the boundary, halfway line, centre circle and both penalty boxes in chalk", () => {
    const { frame } = renderBoard();
    for (const name of [
      "boundary",
      "halfway",
      "center-circle",
      "box-top",
      "box-bottom",
    ]) {
      const marking = frame.querySelector(`[data-board-marking="${name}"]`)!;
      expect(marking, name).not.toBeNull();
      expect(marking).toHaveClass("border-paper-100/70", "border-[length:var(--px)]");
    }
  });

  it("adds the coach's chalk strategy: zones, runs, passes and opponents", () => {
    const { frame } = renderBoard();
    const strategy = frame.querySelector('[data-board="strategy"]')!;
    for (const part of ["zone", "run", "pass", "opponents"]) {
      expect(
        strategy.querySelector(`[data-strategy="${part}"]`),
        part,
      ).not.toBeNull();
    }
    // Chalk drawings sit behind the players, so they never cover a name.
    const team = frame.querySelector("ul")!;
    expect(
      strategy.compareDocumentPosition(team) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("draws the chalk strategy as un-smoothed, pixel-wide strokes", () => {
    const { frame } = renderBoard();
    const strategy = frame.querySelector('[data-board="strategy"]')!;
    expect(strategy).toHaveAttribute("shape-rendering", "crispEdges");
    expect(strategy.querySelector("[class*='stroke-width:var(--px)']")).not.toBeNull();
  });

  it("uses a smaller pixel size on phones, so the back four fit", () => {
    const { frame } = renderBoard();
    expect(frame).toHaveClass("[--px:2px]", "sm:[--px:3px]", "md:[--px:4px]");
  });

  it("is a portrait rectangle like a pitch: generous room above, between and below the lines", () => {
    const { container } = render(<TacticsBoard />);
    const surface = container.querySelector('[data-board="surface"]')!;
    expect(surface).toHaveClass("py-10", "md:py-20");
    const lines = container.querySelector('ul[aria-label^="The team"]')!;
    expect(lines).toHaveClass("gap-8", "md:gap-20");
  });

  it("uses tokens only and no raster images", () => {
    const html = renderToStaticMarkup(<TacticsBoard />);
    expect(html).not.toMatch(/data:image/);
    expectTokensOnly(html);
  });
});

describe("TacticsBoard — AC2: the eleven skills in a 1-4-3-3 formation", () => {
  it("stands every skill from skills.ts on the board as a jersey", () => {
    const { frame } = renderBoard();
    const names = [...frame.querySelectorAll("[data-skill]")].map((j) =>
      j.getAttribute("data-skill"),
    );
    expect(names.sort()).toEqual(skills.map((s) => s.name).sort());
  });

  it("lines them up top to bottom: 3 forwards, 3 midfielders, 4 defenders, 1 goalkeeper, in the lineup order", () => {
    const { frame } = renderBoard();
    const lines = [...frame.querySelectorAll("[data-formation-line]")];
    expect(lines.map((l) => l.getAttribute("data-formation-line"))).toEqual(
      Object.keys(LINEUP),
    );
    lines.forEach((line) => {
      const key = line.getAttribute(
        "data-formation-line",
      ) as keyof typeof LINEUP;
      const players = [...line.querySelectorAll("[data-skill]")].map((j) =>
        j.getAttribute("data-skill"),
      );
      expect(players).toEqual(LINEUP[key]);
    });
  });

  it("gives the goalkeeper the same width as a midfielder, and the back four a quarter each", () => {
    const { frame } = renderBoard();
    const slot = (line: string) =>
      frame.querySelector(`[data-formation-line="${line}"] li`)!;
    expect(slot("goalkeeper")).toHaveClass("w-1/3");
    expect(slot("midfielders")).toHaveClass("w-1/3");
    expect(slot("defenders")).toHaveClass("w-1/4");
  });
});

describe("TacticsBoard — AC5: a list grouped by line for screen readers", () => {
  it("exposes the team as a list of lines, each named and listing its skills", () => {
    renderBoard();
    const team = screen.getByRole("list", { name: /1-4-3-3 formation/ });
    const lines = within(team)
      .getAllByRole("listitem")
      .filter((li) => li.parentElement === team);
    expect(
      lines.map(
        (l) => within(l).getByRole("heading", { level: 3 }).textContent,
      ),
    ).toEqual(["Forwards", "Midfielders", "Defenders", "Goalkeeper"]);
    const forwards = within(lines[0]).getByRole("list");
    expect(
      within(forwards)
        .getAllByRole("listitem")
        .map((li) => li.textContent),
    ).toEqual(LINEUP.forwards);
  });

  it("hides all board artwork from assistive tech", () => {
    const { frame } = renderBoard();
    for (const selector of [
      '[data-board="markings"]',
      '[data-board="strategy"]',
      '[data-board="nail"]',
    ]) {
      frame
        .querySelectorAll(selector)
        .forEach((el) => expect(el).toHaveAttribute("aria-hidden", "true"));
    }
  });
});
