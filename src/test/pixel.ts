import { expect } from "vitest";

/**
 * Test helpers for the pixel art (manifest §6): sprites are inline SVG with
 * one path per colour, filled with `var(--color-<token>)`.
 */

/** The token names used by every pixel path in `root`. */
export function pixelTokens(root: ParentNode): string[] {
  return [...root.querySelectorAll("path[fill]")]
    .map((path) => path.getAttribute("fill")!.match(/^var\(--color-([\w-]+)\)$/)?.[1])
    .filter((name): name is string => Boolean(name));
}

/**
 * Asserts that markup uses design tokens only: no raw hex colours, every
 * `fill`/`stroke` attribute is a token, a pattern or none, and no raster images.
 */
export function expectTokensOnly(html: string) {
  expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
  expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none|var\(--color-)/);
  expect(html).not.toMatch(/<img|<image|\.png|\.jpe?g|\.webp/);
}

/** Asserts a pixel sprite is a crisp, decorative, unfocusable SVG. */
export function expectPixelSprite(svg: Element) {
  expect(svg.tagName.toLowerCase()).toBe("svg");
  expect(svg).toHaveAttribute("aria-hidden", "true");
  expect(svg).toHaveAttribute("focusable", "false");
  expect(svg).toHaveAttribute("shape-rendering", "crispEdges");
}
