import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { skills, type SkillLogo } from "@/content/skills";
import { contrast, overlay, token } from "@/test/contrast";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import { VIGNETTE } from "../FilmOverlay";
import { BADGES, JERSEY } from "./jerseyArt";
import SkillJersey from "./SkillJersey";
import { SKILL_LOGOS } from "./skillLogos";

afterEach(cleanup);

function renderJersey(index = 0) {
  const { container } = render(<SkillJersey skill={skills[index]} />);
  return container.querySelector("[data-skill]") as HTMLElement;
}

describe("SkillJersey — AC1: a pixel jersey with the name and the logo below", () => {
  it("draws a shaded pitch-dark pixel shirt with chalk collar and cuffs and an ink outline", () => {
    const jersey = renderJersey();
    const shirt = jersey.querySelector('[data-jersey="shirt"]')!;
    expectPixelSprite(shirt);
    expect(pixelTokens(shirt)).toEqual(
      expect.arrayContaining(["grass-800", "grass-700", "grass-900", "paper-100", "ink"]),
    );
    expect(jersey.getAttribute("style")).toContain(
      `calc(${JERSEY.width} * var(--px))`,
    );
  });

  it.each(skills)("$name: name on the chest, logo below it", (skill) => {
    const { container } = render(<SkillJersey skill={skill} />);
    const name = container.querySelector('[data-jersey="name"]')!;
    const logo = container.querySelector(`[data-skill-logo="${skill.logo}"]`)!;
    expect(name).toHaveTextContent(skill.name);
    expect(logo).not.toBeNull();
    expect(
      name.compareDocumentPosition(logo) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("SkillJersey — AC2: every skill has its own pixelated logo", () => {
  const logos: SkillLogo[] = [
    "javascript",
    "typescript",
    "react",
    "angular",
    "nodejs",
    "html",
    "css",
    "scss",
    "mongodb",
    "kiro",
    "claude-code",
  ];

  it("has exactly one distinct logo per skill", () => {
    expect(Object.keys(SKILL_LOGOS).sort()).toEqual([...logos].sort());
    expect(skills.map((s) => s.logo).sort()).toEqual([...logos].sort());
    const paths = Object.values(SKILL_LOGOS).map((l) => l.d);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it.each(Object.entries(BADGES))(
    "pixelates the %s logo in ink on a round parchment badge",
    (_, badge) => {
      const tokens = badge.paths.map((p) => p.token);
      expect(tokens).toEqual(expect.arrayContaining(["ink", "paper-200"]));
      // Enough ink pixels to read as a mark, not a speck or a blob.
      let ink = 0;
      for (let y = 0; y < badge.canvas.height; y++)
        for (let x = 0; x < badge.canvas.width; x++)
          if (badge.canvas.get(x, y) === "ink") ink++;
      expect(ink).toBeGreaterThan(70);
    },
  );

  it("renders logos as inline SVG in token colours, with no raster images", () => {
    const html = renderToStaticMarkup(
      <>
        {skills.map((s) => (
          <SkillJersey key={s.name} skill={s} />
        ))}
      </>,
    );
    expect(html).not.toMatch(/data:image|\.svg"/);
    expectTokensOnly(html);
  });
});

describe("SkillJersey — AC3: readable names that fit", () => {
  it("writes the name as chalk text on the pitch-dark shirt", () => {
    const name = renderJersey().querySelector('[data-jersey="name"]')!;
    expect(name.tagName).toBe("SPAN");
    expect(name).toHaveClass("text-chalk", "font-heading");
  });

  it("keeps chalk on pitch-dark at AA, even under the vignette", () => {
    const ink = token("ink");
    const dark = (c: ReturnType<typeof token>) => overlay(c, ink, VIGNETTE);
    expect(
      contrast(token("chalk"), token("pitch-dark")),
    ).toBeGreaterThanOrEqual(4.5);
    expect(
      contrast(dark(token("chalk")), dark(token("pitch-dark"))),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(skills)(
    "$name: sizes the text to its longest word, never below 0.75rem",
    (skill) => {
      const { container } = render(<SkillJersey skill={skill} />);
      const name = container.querySelector(
        '[data-jersey="name"]',
      ) as HTMLElement;
      const longest = Math.max(...skill.name.split(" ").map((w) => w.length));
      expect(name.style.getPropertyValue("--chars")).toBe(
        String(Math.max(longest, 5)),
      );
      expect(name.className).toContain("clamp(0.75rem,");
      expect(name.className).not.toMatch(/overflow-wrap:anywhere|break-all/);
    },
  );
});

describe("SkillJersey — AC4: decorative artwork, no interaction", () => {
  it("hides the shirt and logo from assistive tech and has nothing focusable", () => {
    const jersey = renderJersey();
    jersey.querySelectorAll("svg").forEach((svg) => {
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    });
    expect(
      jersey.querySelectorAll("a, button, input, [tabindex]"),
    ).toHaveLength(0);
    expect(jersey).toHaveTextContent(skills[0].name);
  });
});

describe("SkillJersey — AC5: skills from src/content/skills.ts", () => {
  it("lists the eleven skills of the 1-4-3-3 lineup", () => {
    expect(skills).toHaveLength(11);
    const count = (line: string) =>
      skills.filter((s) => s.line === line).length;
    expect([
      count("goalkeeper"),
      count("defenders"),
      count("midfielders"),
      count("forwards"),
    ]).toEqual([1, 4, 3, 3]);
  });
});
