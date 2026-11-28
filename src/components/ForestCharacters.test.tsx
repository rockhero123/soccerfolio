import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import ForestBackground from "./ForestBackground";
import ForestCharacters from "./ForestCharacters";
import { CHARACTERS } from "./forest/characterArt";
import { expectTokensOnly } from "@/test/pixel";

afterEach(cleanup);

/** Every character component file in src/components/forest/ (not the shared parts). */
const forestDir = join(process.cwd(), "src/components/forest");
const characters = await Promise.all(
  readdirSync(forestDir)
    .filter((file) => file.endsWith(".tsx"))
    .map(async (file) => {
      const mod: { default: ComponentType<{ className?: string }> } =
        await import(`./forest/${file}`);
      return { file, Character: mod.default };
    }),
);

function renderAll() {
  const { container } = render(<ForestCharacters />);
  return container;
}

describe("Forest characters — AC1: at least 15 original pixel-art characters", () => {
  it("renders at least 15 different characters", () => {
    const names = [...renderAll().querySelectorAll("[data-character]")].map(
      (c) => c.getAttribute("data-character"),
    );
    expect(names.length).toBeGreaterThanOrEqual(15);
    expect(new Set(names).size).toBe(names.length);
  });

  it("includes a tree with a face, a mushroom, a flower with eyes, a big-eyed bird, an owl and a plant", () => {
    const container = renderAll();
    for (const name of [
      "face-tree",
      "mushroom",
      "daisy",
      "bird",
      "owl",
      "sprout",
    ]) {
      expect(
        container.querySelector(`[data-character="${name}"]`),
        name,
      ).not.toBeNull();
    }
  });

  it.each(Object.entries(CHARACTERS))(
    "%s has an exaggerated face: big eyes with a pie-cut notch in the pupil",
    (_, art) => {
      const { canvas } = art;
      // A pie-cut pupil: an eye-white pixel with ink directly below it and
      // ink beside it (the notch bitten out of the top of the pupil).
      let notches = 0;
      for (let y = 0; y < canvas.height; y++)
        for (let x = 0; x < canvas.width; x++)
          if (
            canvas.get(x, y) === "paper-100" &&
            canvas.get(x, y + 1) === "ink" &&
            canvas.get(x - 1, y) === "ink"
          )
            notches++;
      expect(notches).toBeGreaterThanOrEqual(1);
    },
  );

  it.each(Object.entries(CHARACTERS))(
    "%s is shaded pixel art with a dark wood outline, in tokens only",
    (_, art) => {
      const tokens = art.paths.map((p) => p.token);
      expect(tokens).toContain("wood-900");
      expect(tokens.length).toBeGreaterThanOrEqual(6);
      expect(art.canvas.width).toBeGreaterThanOrEqual(16);
      tokens.forEach((t) => expect(t).toMatch(/^[a-z]+(-\d+)?$/));
    },
  );

  it("uses design tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<ForestCharacters />));
  });

  it("is static: no SVG or CSS animation", () => {
    const html = renderToStaticMarkup(<ForestCharacters />);
    expect(html).not.toMatch(/<animate|<set\b|animate-|transition/);
  });
});

describe("Forest characters — AC2/AC3: placed in the forest around the field", () => {
  it("puts five characters in each forest band, shown at every width", () => {
    const container = renderAll();
    for (const band of ["top", "bottom"]) {
      const group = container.querySelector(
        `[data-forest-characters="${band}"]`,
      )!;
      expect(group.querySelectorAll("[data-character]")).toHaveLength(5);
      expect(group).toHaveClass("h-(--forest-band)");
      expect(group.className).not.toMatch(/(^|\s)hidden(\s|$)/);
    }
  });

  it("adds side-panel characters only from 1024px, inside the panels", () => {
    const container = renderAll();
    for (const side of ["left", "right"]) {
      const group = container.querySelector(
        `[data-forest-characters="${side}"]`,
      )!;
      expect(group.querySelectorAll("[data-character]").length).toBeGreaterThan(
        0,
      );
      expect(group).toHaveClass(
        "hidden",
        "lg:flex",
        "w-(--forest-side)",
        "top-(--forest-band)",
      );
      // Spread evenly down the whole height of the page, not bunched at the top.
      expect(group).toHaveClass("bottom-(--forest-band)", "justify-around");
    }
  });

  it("scatters the top band and side panels; the bottom band stands in a row", () => {
    const container = renderAll();
    const offsets = (band: string) =>
      [...container.querySelectorAll(`[data-forest-characters="${band}"] [data-character]`)].map(
        (c) => c.getAttribute("class")!.match(/(^|\s)mb-\S+/)?.[0].trim() ?? "mb-0",
      );
    const top = offsets("top");
    expect(new Set(top).size).toBe(top.length);
    expect(new Set(offsets("bottom"))).toEqual(new Set(["mb-0"]));
    expect(container.querySelector('[data-forest-characters="bottom"]')).toHaveClass("items-end", "justify-evenly");
    for (const side of ["left", "right"]) {
      const tops = [...container.querySelectorAll(`[data-forest-characters="${side}"] [data-character]`)].map(
        (c) => c.getAttribute("class")!.match(/-?top-\S+/)?.[0],
      );
      expect(new Set(tops).size, side).toBe(tops.length);
    }
    const left = container.querySelector('[data-forest-characters="left"]')!.className;
    const right = container.querySelector('[data-forest-characters="right"]')!.className;
    expect(left).not.toBe(right.replace("right-0", "left-0"));
  });

  it("lives inside the forest background", () => {
    const { container } = render(<ForestBackground />);
    const forest = container.querySelector(
      '[data-testid="forest-background"]',
    )!;
    expect(
      forest.querySelectorAll("[data-character]").length,
    ).toBeGreaterThanOrEqual(15);
  });
});

describe("Forest characters — AC4: one component per character in src/components/forest/", () => {
  it("has at least 15 character files, each rendering exactly one character", () => {
    expect(characters.length).toBeGreaterThanOrEqual(15);
    for (const { file, Character } of characters) {
      const { container } = render(<Character />);
      expect(container.querySelectorAll("[data-character]"), file).toHaveLength(
        1,
      );
      cleanup();
    }
  });

  it("names each file after its character", () => {
    for (const { file, Character } of characters) {
      const { container } = render(<Character />);
      const name = container
        .querySelector("[data-character]")!
        .getAttribute("data-character")!;
      const pascal = name.replace(/(^|-)(\w)/g, (_, __, c: string) =>
        c.toUpperCase(),
      );
      expect(file).toBe(`${pascal}.tsx`);
      cleanup();
    }
  });

  it("is drawn at the site's pixel size, and accepts layout classes from its caller", () => {
    const { Character } = characters[0];
    const { container } = render(<Character className="self-start" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveClass("self-start");
    expect(svg.getAttribute("style")).toMatch(/width: calc\(\d+ \* var\(--px\)\)/);
  });
});

describe("Forest characters — AC5: decorative", () => {
  it.each(characters)(
    '$file is aria-hidden="true", unfocusable and has no text',
    ({ Character }) => {
      const { container } = render(<Character />);
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
      expect(svg.textContent).toBe("");
      expect(svg.querySelectorAll("title, desc, [aria-label]")).toHaveLength(0);
    },
  );
});
