import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

// Manifest §6 design tokens.
const colors: Record<string, string> = {
  pitch: "#00b262",
  "pitch-dark": "#00522d",
  mint: "#a8f0d8",
  chalk: "#fffbef",
  parchment: "#f3e7c9",
  ink: "#1e1a16",
  "forest-deep": "#2f3b2a",
  moss: "#a9bf5a",
  bark: "#7a5236",
  "cartoon-red": "#c8312b",
  "cartoon-yellow": "#e8b630",
};

function themeBlocks(source: string): string {
  return [...source.matchAll(/@theme[^{]*\{([^}]*)\}/g)]
    .map((match) => match[1])
    .join("\n");
}

const theme = themeBlocks(css);

function tokenValue(name: string): string | undefined {
  const match = theme.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return match?.[1].trim().toLowerCase();
}

describe("globals.css design tokens (AC1)", () => {
  it.each(Object.entries(colors))(
    "defines color token %s as %s",
    (name, value) => {
      expect(tokenValue(`color-${name}`)).toBe(value);
    },
  );

  it("defines the outline widths (3px, 4px for large shapes)", () => {
    expect(tokenValue("border-width-outline")).toBe("3px");
    expect(tokenValue("border-width-outline-lg")).toBe("4px");
    expect(tokenValue("stroke-width-outline")).toBe("3px");
    expect(tokenValue("stroke-width-outline-lg")).toBe("4px");
  });

  it("defines the radius tokens (12px cards, 9999px pills)", () => {
    expect(tokenValue("radius-card")).toBe("12px");
    expect(tokenValue("radius-pill")).toBe("9999px");
  });

  it("maps font-heading and font-body to the next/font variables (AC2)", () => {
    expect(tokenValue("font-heading")).toBe("var(--font-lilita-one)");
    expect(tokenValue("font-body")).toBe("var(--font-source-sans-3)");
  });
});

describe("create-next-app defaults are removed (AC3)", () => {
  it.each([
    "prefers-color-scheme",
    "--background",
    "--foreground",
    "geist",
    "Arial",
  ])("globals.css no longer contains %s", (leftover) => {
    expect(css.toLowerCase()).not.toContain(leftover.toLowerCase());
  });
});
