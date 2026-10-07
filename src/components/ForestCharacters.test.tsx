import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import ForestBackground from "./ForestBackground";
import ForestCharacters from "./ForestCharacters";

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

describe("Forest characters — AC1: at least 15 original rubber-hose characters", () => {
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

  it.each(characters)(
    "$file has an exaggerated face with pie-cut eyes",
    ({ Character }) => {
      const { container } = render(<Character />);
      const eyes = container.querySelectorAll('[data-part="pie-eye"]');
      expect(eyes.length).toBeGreaterThanOrEqual(1);
      eyes.forEach((eye) => {
        // A parchment eye white and an ink pupil with a wedge cut out (a long arc).
        expect(eye.querySelector("ellipse.fill-parchment")).not.toBeNull();
        expect(eye.querySelector("path.fill-ink")!.getAttribute("d")).toMatch(
          /A[\d.]+ [\d.]+ 0 1 1 /,
        );
      });
    },
  );

  it.each(characters)(
    "$file pulls an exaggerated, Cuphead-boss expression",
    ({ Character }) => {
      const { container } = render(<Character />);
      const has = (part: string) =>
        container.querySelector(`[data-part="${part}"]`) !== null;
      // At least two dramatic features: fangs, a gaping maw, scowling or
      // terrified brows, heavy lids or bloodshot eyes.
      const features = ["teeth", "maw", "brow", "lid", "veins"].filter(has);
      expect(features.length).toBeGreaterThanOrEqual(2);
      // Pupils shrink to a manic pinprick (well under the default size).
      const eyes = [...container.querySelectorAll('[data-part="pie-eye"]')];
      const pinprick = eyes.some((eye) => {
        const white = eye.querySelector("ellipse")!;
        const pupil = eye.querySelector("path.fill-ink")!.getAttribute("d")!;
        const rx = Number(pupil.match(/A([\d.]+)/)![1]);
        return rx <= Number(white.getAttribute("rx")) * 0.4;
      });
      expect(pinprick).toBe(true);
    },
  );

  it.each(characters)(
    "$file is drawn with bold ink outlines in token colours only",
    ({ Character }) => {
      const { container } = render(<Character />);
      expect(container.querySelector("svg > g")).toHaveClass(
        "stroke-ink",
        "stroke-outline-lg",
      );
      const html = container.innerHTML;
      expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
      expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
    },
  );

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
    }
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

  it("accepts a size from its caller, so it can be reused anywhere", () => {
    const { Character } = characters[0];
    const { container } = render(<Character className="h-40" />);
    expect(container.querySelector("svg")).toHaveClass("h-40", "w-auto");
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
