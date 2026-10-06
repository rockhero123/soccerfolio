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

describe("SoccerField — AC1: wraps the content with bold parchment and ink field markings", () => {
  it("renders the sections in the playing zone and the contact slot in the contact zone", () => {
    const { play, contact } = renderField();
    expect(play).toContainElement(
      screen.getByRole("heading", { name: "Skills" }),
    );
    expect(contact).toContainElement(screen.getByText("Contact me"));
  });

  it("draws the outer boundary with four corner arcs", () => {
    const { marking } = renderField();
    expect(marking("boundary")).toHaveLength(1);
    expect(marking("boundary")[0]).toHaveClass("border-parchment");
    expect(marking("corner-arc")).toHaveLength(4);
  });

  it("draws a penalty box, goal area, spot and arc at the top", () => {
    const { play } = renderField();
    const top = play.querySelector('[data-marking="penalty-area-top"]')!;
    for (const name of [
      "penalty-box",
      "goal-area",
      "penalty-spot",
      "penalty-arc",
    ]) {
      expect(top.querySelector(`[data-marking="${name}"]`)).not.toBeNull();
    }
  });

  it("draws the halfway line with the centre circle and spot", () => {
    const { play, marking } = renderField();
    expect(play).toContainElement(marking("halfway-line")[0] as HTMLElement);
    expect(marking("halfway-line")[0]).toHaveClass("bg-parchment");
    expect(
      play.querySelector('[data-marking="center-circle"] circle'),
    ).not.toBeNull();
    expect(marking("center-spot")).toHaveLength(1);
  });

  it("draws a penalty box and a goal at the bottom, mirrored from the top", () => {
    const { contact } = renderField();
    const bottom = contact.querySelector(
      '[data-marking="penalty-area-bottom"]',
    )!;
    expect(bottom).toHaveClass("-scale-y-100");
    expect(bottom.querySelector('[data-marking="penalty-box"]')).not.toBeNull();
    expect(bottom.querySelector('[data-marking="goal"]')).not.toBeNull();
  });

  it("paints every marking in parchment over a wider ink casing, never in white", () => {
    const { field } = renderField();
    const paint = field.querySelectorAll(
      "[data-marking] path, [data-marking] circle",
    );
    const ink = field.querySelectorAll(
      "[data-marking-ink] path, [data-marking-ink] circle",
    );
    expect(paint.length).toBeGreaterThan(10);
    paint.forEach((shape) =>
      expect(shape.getAttribute("class")).toMatch(/(stroke|fill)-parchment/),
    );
    ink.forEach((shape) =>
      expect(shape.getAttribute("class")).toMatch(/(stroke|fill)-ink/),
    );
    // Each painted marking has an ink casing of the same kind.
    for (const name of [
      "boundary",
      "halfway-line",
      "penalty-box",
      "goal-area",
      "penalty-arc",
      "corner-arc",
      "center-circle",
      "goal",
    ]) {
      expect(
        field.querySelectorAll(`[data-marking-ink="${name}"]`).length,
      ).toBe(field.querySelectorAll(`[data-marking="${name}"]`).length);
    }
    expect(field.innerHTML).not.toMatch(/(stroke|fill|border|bg)-chalk/);
    expect(field.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
  });

  it("draws the ink casing wider than the parchment line, using the outline token", () => {
    const { field } = renderField();
    const casing = field.querySelector('[data-marking-ink="penalty-box"]')!;
    const line = field.querySelector('[data-marking="penalty-box"]')!;
    expect(casing.getAttribute("class")).toContain(
      "calc(var(--field-line)+2*var(--stroke-width-outline))",
    );
    expect(line.getAttribute("class")).toContain(
      "[stroke-width:var(--field-line)]",
    );
  });

  it("layers every ink casing below every parchment line", () => {
    const { field } = renderField();
    const z = (el: Element) =>
      el.closest('[class*="z-["]')!.className.match(/z-\[(\d)\]/)![1];
    const inkZ = new Set(
      [...field.querySelectorAll("[data-marking-ink]")].map(z),
    );
    const paintZ = new Set(
      [...field.querySelectorAll("[data-marking]")].map(z),
    );
    expect([...inkZ]).toEqual(["1"]);
    expect([...paintZ]).toEqual(["2"]);
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
      field
        .querySelector('[data-marking="center-circle"]')!
        .getAttribute("viewBox"),
    ).toBe("0 0 200 200");
  });

  it("keeps the lines the same width at any size", () => {
    const { field } = renderField();
    field
      .querySelectorAll(
        "[data-marking] .stroke-parchment, [data-marking-ink] .stroke-ink, [data-marking].stroke-parchment, [data-marking-ink].stroke-ink",
      )
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

  it("paints both zones with a watercolour wash that only raises text contrast", () => {
    const { play, contact } = renderField();
    expect(play.querySelector('[data-field-paint="lighten"]')).not.toBeNull();
    expect(contact.querySelector('[data-field-paint="darken"]')).not.toBeNull();
    for (const paint of [
      ...play.querySelectorAll("[data-field-paint]"),
      ...contact.querySelectorAll("[data-field-paint]"),
    ]) {
      paint
        .querySelectorAll("feTurbulence")
        .forEach((noise) =>
          expect(noise).toHaveAttribute("stitchTiles", "stitch"),
        );
    }
    expect(
      play.querySelector("[data-field-paint] feFlood")!.getAttribute("class"),
    ).toContain("--color-parchment");
    expect(
      contact
        .querySelector("[data-field-paint] feFlood")!
        .getAttribute("class"),
    ).toContain("--color-ink");
  });

  it("lets the forest shade fall on the field edges", () => {
    const { field } = renderField();
    const shade = field.querySelector("[data-field-shade]")!;
    expect(shade).toHaveAttribute("aria-hidden", "true");
    expect(shade.className).toMatch(
      /shadow-\[inset_.*var\(--color-forest-deep\)/,
    );
    expect(field.className).toMatch(/shadow-\[0_.*var\(--color-forest-deep\)/);
  });

  it("uses pitch-dark for the contact zone, edged with a grass strip", () => {
    const { contact } = renderField();
    expect(contact).toHaveClass("bg-pitch-dark");
    expect(contact.querySelector("[data-grass-strip]")).toHaveClass(
      "fill-pitch-dark",
    );
  });

  it("defines the mowing stripes from tokens only", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    const utility = css.match(/@utility bg-mowing\s*\{([^}]*)\}/)?.[1] ?? "";
    expect(utility).toMatch(/repeating-linear-gradient/);
    expect(utility).toContain("var(--color-chalk)");
    expect(utility).not.toMatch(/#[0-9a-f]{3,8}/i);
  });
});

describe("SoccerField — painted to sit in the forest (design notes)", () => {
  it("drops leaves, stems, twigs and feathers along both edges, on top of the lines", () => {
    const { field } = renderField();
    const strips = field.querySelectorAll("[data-field-debris]");
    expect([...strips].map((s) => s.getAttribute("data-field-debris"))).toEqual(
      ["left", "right"],
    );
    for (const strip of strips) {
      for (const kind of ["leaf", "twig", "stem", "feather"]) {
        expect(strip.querySelector(`[data-debris="${kind}"]`)).not.toBeNull();
      }
      // Above the parchment lines (z 2), below the forest shade (z 4) and content (z 10).
      expect(strip.closest(".z-\\[3\\]")).not.toBeNull();
    }
    expect(field.querySelector("[data-field-shade]")).toHaveClass("z-[4]");
  });

  it("scatters tufts, clover and a few leaves over the bright grass, only tufts on the dark grass", () => {
    const { play, contact } = renderField();
    const lawn = play.querySelector('[data-field-scatter="play"]')!;
    expect(
      lawn.querySelectorAll('[data-debris="tuft"]').length,
    ).toBeGreaterThan(4);
    expect(lawn.querySelector('[data-debris="clover"]')).not.toBeNull();
    expect(lawn.querySelector('[data-debris="leaf"]')).not.toBeNull();
    const dark = contact.querySelector('[data-field-scatter="contact"]')!;
    const kinds = new Set(
      [...dark.querySelectorAll("[data-debris]")].map((p) =>
        p.getAttribute("data-debris"),
      ),
    );
    expect([...kinds]).toEqual(["tuft"]);
  });

  it("colours leaves on the lawn only in tones ink text stays readable on", () => {
    const { play } = renderField();
    const fills = [
      ...play.querySelectorAll(
        '[data-field-scatter] [data-debris="leaf"] > path:first-child',
      ),
    ].map((p) => p.getAttribute("class"));
    expect(fills.length).toBeGreaterThan(0);
    fills.forEach((fill) =>
      expect(fill).toMatch(/^fill-(moss|cartoon-yellow)$/),
    );
  });

  it("keeps the debris and paint pattern ids unique, with tokens only", () => {
    const { field } = renderField();
    const ids = [...field.querySelectorAll("pattern, filter")].map(
      (el) => el.id,
    );
    expect(new Set(ids).size).toBe(ids.length);
    expect(field.innerHTML).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(field.innerHTML).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
  });
});

describe("SoccerField — AC5: decorative markings and readable text", () => {
  it('hides every marking from assistive tech with aria-hidden="true"', () => {
    const { field } = renderField();
    field
      .querySelectorAll(
        "[data-marking], [data-marking-ink], [data-field-paint], [data-field-debris], [data-field-scatter]",
      )
      .forEach((m) => {
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
