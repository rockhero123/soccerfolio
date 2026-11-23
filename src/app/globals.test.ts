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

  it.each([
    ["grass", 8],
    ["leaf", 8],
    ["wood", 8],
    ["stone", 8],
    ["water", 8],
    ["paper", 5],
    ["red", 5],
    ["gold", 5],
    ["skin", 5],
  ])("defines the %s colour ramp (%i shades)", (ramp, shades) => {
    const names = [...theme.matchAll(new RegExp(`--color-${ramp}-(\\d+):`, "g"))];
    expect(names).toHaveLength(shades);
  });

  it("builds the ramps on the base tokens where they fit", () => {
    expect(tokenValue("color-grass-500")).toBe("var(--color-pitch)");
    expect(tokenValue("color-grass-800")).toBe("var(--color-pitch-dark)");
    expect(tokenValue("color-wood-600")).toBe("var(--color-bark)");
    expect(tokenValue("color-red-600")).toBe("var(--color-cartoon-red)");
    expect(tokenValue("color-gold-600")).toBe("var(--color-cartoon-yellow)");
  });

  it("sets the pixel size: 3px on phones, 4px from 768px (manifest §6)", () => {
    expect(css).toMatch(/:root \{\s*--px: 3px;\s*\/\*[^*]*\*\/\s*--px-scale: 3;/);
    expect(css).toMatch(
      /@media \(min-width: 48rem\) \{\s*:root \{\s*--px: 4px;\s*--px-scale: 4;/,
    );
  });

  it.each(["paper", "wood", "stone", "board"])(
    "defines the pixel-frame-%s surface",
    (frame) => {
      expect(css).toContain(`@utility pixel-frame-${frame} {`);
    },
  );

  it("maps font-heading and font-body to the next/font variables (AC2)", () => {
    expect(tokenValue("font-heading")).toBe("var(--font-jersey-10)");
    expect(tokenValue("font-body")).toBe("var(--font-pixelify-sans)");
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
