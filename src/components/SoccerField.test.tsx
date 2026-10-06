import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SoccerField from "./SoccerField";

afterEach(cleanup);

function renderField() {
  const { container } = render(
    <SoccerField contact={<p>Contact me</p>}>
      <section id="skills">
        <h2>Skills</h2>
      </section>
    </SoccerField>,
  );
  const field = screen.getByTestId("soccer-field");
  const play = field.querySelector('[data-field-zone="play"]')!;
  const contact = field.querySelector('[data-field-zone="contact"]')!;
  const marking = (name: string) =>
    field.querySelectorAll(`[data-marking="${name}"]`);
  return { container, field, play, contact, marking };
}

describe("SoccerField — AC1: wraps the content with chalk field markings", () => {
  it("renders the sections in the playing zone and the contact slot in the contact zone", () => {
    const { play, contact } = renderField();
    expect(play).toContainElement(screen.getByRole("heading", { name: "Skills" }));
    expect(contact).toContainElement(screen.getByText("Contact me"));
  });

  it("draws the outer boundary with four corner arcs", () => {
    const { marking } = renderField();
    expect(marking("boundary")).toHaveLength(1);
    expect(marking("boundary")[0]).toHaveClass("border-chalk", "border-outline");
    expect(marking("corner-arc")).toHaveLength(4);
  });

  it("draws a penalty box, goal area, spot and arc at the top", () => {
    const { play } = renderField();
    const top = play.querySelector('[data-marking="penalty-area-top"]')!;
    for (const name of ["penalty-box", "goal-area", "penalty-spot", "penalty-arc"]) {
      expect(top.querySelector(`[data-marking="${name}"]`)).not.toBeNull();
    }
  });

  it("draws the halfway line with the centre circle and spot", () => {
    const { play, marking } = renderField();
    expect(play).toContainElement(marking("halfway-line")[0] as HTMLElement);
    expect(marking("halfway-line")[0]).toHaveClass("border-chalk");
    expect(play.querySelector('[data-marking="center-circle"] circle')).not.toBeNull();
    expect(marking("center-spot")).toHaveLength(1);
  });

  it("draws a penalty box and a goal at the bottom, mirrored from the top", () => {
    const { contact } = renderField();
    const bottom = contact.querySelector('[data-marking="penalty-area-bottom"]')!;
    expect(bottom).toHaveClass("-scale-y-100");
    expect(bottom.querySelector('[data-marking="penalty-box"]')).not.toBeNull();
    expect(bottom.querySelector('[data-marking="goal"]')).not.toBeNull();
  });

  it("draws every marking in chalk, with no raw hex colours", () => {
    const { field } = renderField();
    field.querySelectorAll("svg path, svg circle").forEach((shape) => {
      const isMarking = shape.closest("[data-marking]") !== null;
      if (!isMarking) return;
      expect(shape.getAttribute("class")).toMatch(/(stroke|fill)-chalk/);
    });
    expect(field.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
  });
});

describe("SoccerField — AC2: grows with its content, markings keep their proportions", () => {
  it("has no fixed height, so sections are never clipped", () => {
    const { field, play, contact } = renderField();
    for (const el of [field, play, contact]) {
      expect(el.className).not.toMatch(/(^|\s)(h-|max-h-)/);
    }
  });

  it("sizes proportional shapes by width only, with a fixed viewBox", () => {
    const { field } = renderField();
    const shapes = field.querySelectorAll(
      '[data-marking^="penalty-area-"], [data-marking="center-circle"]',
    );
    expect(shapes).toHaveLength(3);
    shapes.forEach((svg) => {
      expect(svg).toHaveAttribute("viewBox");
      expect(svg).not.toHaveAttribute("preserveAspectRatio", "none");
      expect(svg.getAttribute("class")).not.toMatch(/(^|\s)h-/);
    });
    expect(
      field.querySelector('[data-marking="center-circle"]')!.getAttribute("viewBox"),
    ).toBe("0 0 200 200");
  });

  it("keeps chalk lines the same width at any size", () => {
    const { field } = renderField();
    field
      .querySelectorAll("[data-marking] .stroke-chalk")
      .forEach((line) =>
        expect(line).toHaveAttribute("vector-effect", "non-scaling-stroke"),
      );
  });
});

describe("SoccerField — AC3: grass colours", () => {
  it("uses mown pitch grass for the playing zone", () => {
    const { play } = renderField();
    expect(play).toHaveClass("bg-pitch", "bg-mowing");
  });

  it("uses pitch-dark for the contact zone, edged with a grass strip", () => {
    const { contact } = renderField();
    expect(contact).toHaveClass("bg-pitch-dark");
    expect(contact.querySelector("[data-grass-strip]")).toHaveClass(
      "fill-pitch-dark",
    );
  });

  it("defines the mowing stripes from tokens only", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    const utility = css.match(/@utility bg-mowing\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(utility).toMatch(/repeating-linear-gradient/);
    expect(utility).toContain("var(--color-chalk)");
    expect(utility).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("SoccerField — AC5: decorative markings and readable text", () => {
  it('hides every marking from assistive tech with aria-hidden="true"', () => {
    const { field } = renderField();
    field.querySelectorAll("[data-marking]").forEach((m) => {
      expect(m.closest('[aria-hidden="true"]')).not.toBeNull();
    });
    field.querySelectorAll("svg").forEach((svg) => {
      expect(svg.closest('[aria-hidden="true"]')).not.toBeNull();
      expect(svg).toHaveAttribute("focusable", "false");
    });
  });

  it("sets ink text on the bright grass and chalk text on the dark grass", () => {
    const { play, contact } = renderField();
    expect(play).toHaveClass("text-ink");
    expect(contact).toHaveClass("text-chalk");
  });
});
