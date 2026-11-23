import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import SoccerField from "./SoccerField";
import { LAWN_ART, LAWN_TILE, SCATTER_ART } from "./soccer-field/lawnArt";
import {
  CENTER_CIRCLE,
  CORNER_ARC,
  PENALTY,
  PENALTY_ART,
} from "./soccer-field/markingArt";

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

describe("SoccerField — AC1: wraps the content with pixel chalk markings", () => {
  it("renders the sections in the playing zone and the contact slot in the contact zone", () => {
    const { play, contact } = renderField();
    expect(play).toContainElement(
      screen.getByRole("heading", { name: "Skills" }),
    );
    for (const zone of [play, contact]) {
      expect(zone.querySelector("[data-field-content]")).toHaveClass(
        "relative",
        "z-10",
      );
    }
    expect(contact).toContainElement(screen.getByText("Contact me"));
  });

  it("draws the outer boundary with four corner arcs", () => {
    const { marking } = renderField();
    expect(marking("boundary")).toHaveLength(1);
    expect(marking("corner-arc")).toHaveLength(4);
  });

  it("draws a penalty area at the top, the halfway line with the centre circle, and a penalty area with a goal at the bottom", () => {
    const { play, contact } = renderField();
    expect(play.querySelector('[data-marking="penalty-area-top"]')).not.toBeNull();
    expect(play.querySelector('[data-marking="halfway-line"]')).not.toBeNull();
    expect(play.querySelector('[data-marking="center-circle"]')).not.toBeNull();
    const bottom = contact.querySelector('[data-marking="penalty-area-bottom"]')!;
    expect(bottom).toHaveClass("-scale-y-100");
  });

  it("draws every marking as crisp pixel art in chalk, never in white", () => {
    const { field } = renderField();
    const sprites = field.querySelectorAll("svg[data-marking]");
    expect(sprites.length).toBe(7);
    sprites.forEach((svg) => {
      expectPixelSprite(svg);
      expect(pixelTokens(svg).every((t) => ["paper-100", "stone-300"].includes(t))).toBe(true);
    });
    expect(field.querySelector('[data-marking="boundary"]')).toHaveClass(
      "border-paper-100",
    );
    expect(field.querySelector('[data-marking="halfway-line"]')).toHaveClass(
      "bg-paper-100",
    );
  });

  it("gives the markings a crisp, one-pixel dark-grass drop shadow", () => {
    const { field } = renderField();
    field.querySelectorAll("[data-field-markings]:not(:has([data-field-scatter]))").forEach((layer) => {
      expect(layer.className).toContain("drop-shadow(var(--px)_var(--px)_0_");
    });
  });
});

describe("SoccerField — AC1: the pixel markings' geometry", () => {
  const { canvas: box } = PENALTY_ART.plain;
  const line = PENALTY.goalDepth;

  it("draws the penalty box sides from the goal line, two pixels wide", () => {
    for (const x of [0, 1, PENALTY.width - 2, PENALTY.width - 1])
      expect(box.get(x, line + 5)).toBe("paper-100");
    expect(box.get(2, line + 5)).toBeUndefined();
  });

  it("puts the penalty spot on the centre line and the arc outside the box", () => {
    const mid = PENALTY.width / 2;
    expect(box.get(mid, line + 26)).toBe("paper-100");
    const arcRows = [...Array(box.height).keys()].filter(
      (y) => y > line + 39 && box.get(mid, y) === "paper-100",
    );
    expect(arcRows.length).toBeGreaterThan(0);
  });

  it("adds the goal (posts and net) behind the line only at the bottom end", () => {
    const tokens = (art: typeof PENALTY_ART.goal) =>
      art.paths.map((p) => p.token);
    expect(tokens(PENALTY_ART.goal)).toContain("stone-300");
    expect(tokens(PENALTY_ART.plain)).not.toContain("stone-300");
  });

  it("keeps the centre circle and its spot symmetric", () => {
    const { canvas } = CENTER_CIRCLE;
    for (let y = 0; y < canvas.height; y++)
      for (let x = 0; x < canvas.width; x++)
        expect(canvas.get(x, y)).toBe(canvas.get(canvas.width - 1 - x, y));
    expect(canvas.get(canvas.width / 2, canvas.height / 2)).toBe("paper-100");
  });

  it("draws a quarter-circle corner arc", () => {
    expect(CORNER_ARC.canvas.get(6, 0)).toBe("paper-100");
    expect(CORNER_ARC.canvas.get(0, 6)).toBe("paper-100");
    expect(CORNER_ARC.canvas.get(0, 0)).toBeUndefined();
  });
});

describe("SoccerField — AC2: grows with its content, markings keep their proportions", () => {
  it("has no fixed height, so sections are never clipped", () => {
    const { field, play } = renderField();
    expect(field.className).not.toMatch(/(^|\s)h-\[|(^|\s)h-\d/);
    expect(play.className).toMatch(/min-h-\[/);
  });

  it("sizes every marking sprite in art pixels, so it never stretches", () => {
    const { field } = renderField();
    field.querySelectorAll("svg[data-marking]").forEach((svg) => {
      expect(svg.getAttribute("style")).toMatch(/width: calc\(\d+ \* var\(--px\)\)/);
    });
  });

  it("keeps content clear of the penalty areas with padding in art pixels", () => {
    const { field } = renderField();
    expect(field.className).toContain("[--penalty-h:calc(48*var(--px))]");
    expect(
      field.querySelector('[data-field-zone="play"] [data-field-content]'),
    ).toHaveClass("pt-[calc(var(--field-inset)+var(--penalty-h)+1.5rem)]");
  });
});

describe("SoccerField — AC3: pixel lawns", () => {
  it("lays a striped pitch lawn in the playing zone and a pitch-dark lawn in the contact zone", () => {
    const { play, contact } = renderField();
    expect(play).toHaveClass("bg-pitch");
    expect(contact).toHaveClass("bg-pitch-dark");
    expect(play.querySelector('[data-field-paint="play"]')).not.toBeNull();
    expect(contact.querySelector('[data-field-paint="contact"]')).not.toBeNull();
  });

  it("mows the lawns in two-tone stripes", () => {
    const { canvas } = LAWN_ART.play;
    const stripe = LAWN_TILE.stripe;
    expect(canvas.height).toBe(stripe * 2);
    const count = (y0: number, token: string) => {
      let n = 0;
      for (let y = y0; y < y0 + stripe; y++)
        for (let x = 0; x < canvas.width; x++) if (canvas.get(x, y) === token) n++;
      return n;
    };
    expect(count(0, "grass-500")).toBeGreaterThan(count(0, "grass-400"));
    expect(count(stripe, "grass-400")).toBeGreaterThan(count(stripe, "grass-500"));
    expect(LAWN_ART.contact.paths.map((p) => p.token)).toEqual(
      expect.arrayContaining(["grass-800", "grass-700"]),
    );
  });

  it("edges the contact zone with a strip of pixel grass", () => {
    const { contact } = renderField();
    expect(contact.querySelector("[data-grass-strip]")).not.toBeNull();
  });

  it("frames the field with a notched dark border and crisp forest shade on its edges", () => {
    const { field } = renderField();
    expect(field.className).toContain("var(--color-leaf-900)");
    expect(field.querySelector("[data-field-shade]")!.className).toContain(
      "inset_0_0_0_var(--px)",
    );
  });
});

describe("SoccerField — fallen forest debris (design notes)", () => {
  it("scatters debris over both zones on two overlapping tiles", () => {
    const { play, contact } = renderField();
    expect(play.querySelectorAll('[data-field-scatter="play"]')).toHaveLength(2);
    expect(contact.querySelectorAll('[data-field-scatter="contact"]')).toHaveLength(2);
  });

  it("draws leaves, twigs, clovers, flowers and pebbles from the token ramps", () => {
    const tokens = SCATTER_ART.play.flatMap((tile) => tile.paths.map((p) => p.token));
    expect(tokens).toEqual(
      expect.arrayContaining(["wood-700", "leaf-400", "paper-100", "stone-300"]),
    );
  });

  it("lays debris on top of the lines and below the forest shade and content", () => {
    const { play } = renderField();
    const scatter = play.querySelector("[data-field-scatter]")!.parentElement!;
    expect(scatter).toHaveClass("z-[3]");
  });

  it("keeps pattern ids unique and uses tokens only", () => {
    const { container } = renderField();
    const ids = [...container.querySelectorAll("pattern")].map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expectTokensOnly(
      renderToStaticMarkup(<SoccerField contact={<p>c</p>}>x</SoccerField>),
    );
  });
});

describe("SoccerField — AC5: decorative markings and readable text", () => {
  it('hides every marking from assistive tech with aria-hidden="true"', () => {
    const { field } = renderField();
    field.querySelectorAll("[data-marking]").forEach((m) => {
      expect(m.closest('[aria-hidden="true"]')).not.toBeNull();
    });
  });

  it("sets ink text on the bright grass and chalk text on the dark grass", () => {
    const { play, contact } = renderField();
    expect(play).toHaveClass("text-ink");
    expect(contact).toHaveClass("text-chalk");
  });
});
