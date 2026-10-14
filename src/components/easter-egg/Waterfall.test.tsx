import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import Waterfall from "./Waterfall";

afterEach(cleanup);

function renderWaterfall() {
  const { container } = render(<Waterfall />);
  const root = container.querySelector(
    '[data-waterfall="root"]',
  ) as HTMLElement;
  const all = (name: string) =>
    root.querySelectorAll(`[data-waterfall="${name}"]`);
  return { root, all };
}

describe("Waterfall — AC1: an original cartoon waterfall", () => {
  it("is one composed inline-SVG scene with falls, terraces, a pool, rocks, leaves and sticks", () => {
    const { root, all } = renderWaterfall();
    expect(root.querySelectorAll("svg").length).toBeGreaterThanOrEqual(1);
    expect(all("fall")).toHaveLength(3);
    expect(all("terrace")).toHaveLength(2);
    expect(all("pool")).toHaveLength(1);
    expect(all("rock").length).toBeGreaterThanOrEqual(8);
    expect(all("cliff-rock").length).toBeGreaterThanOrEqual(8);
    expect(all("leaf").length).toBeGreaterThanOrEqual(3);
    expect(all("stick").length).toBeGreaterThanOrEqual(1);
    expect(all("leaves").length).toBeGreaterThanOrEqual(2);
  });

  it("draws grey stones in the water and dark-green, moss-topped cliffs on the sides", () => {
    const { all } = renderWaterfall();
    all("rock").forEach((rock) => {
      expect(rock.querySelector("path")).toHaveClass(
        "fill-silver",
        "stroke-ink",
      );
      expect(rock.querySelector(".fill-moss")).toBeNull();
    });
    all("cliff-rock").forEach((rock) => {
      expect(rock.querySelector("path")).toHaveClass(
        "fill-forest-deep-light",
        "stroke-ink",
      );
      expect(rock.querySelector(".fill-moss")).not.toBeNull();
    });
  });

  it("uses curved shapes for the water, with no rectangles in the scene", () => {
    const { root, all } = renderWaterfall();
    // The only <rect> is the sky backdrop behind everything.
    expect(
      [...root.querySelectorAll("rect")].map((r) =>
        r.getAttribute("data-waterfall"),
      ),
    ).toEqual(["sky"]);
    all("fall").forEach((fall) =>
      expect(fall.querySelector("path")!.getAttribute("d")).toMatch(/Q/),
    );
  });

  it("uses tokens only and no raster images", () => {
    const html = renderToStaticMarkup(<Waterfall />);
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![-\w])/);
    expect(html).not.toMatch(/(fill|stroke)="(?!url\(|none)/);
    expect(html).not.toMatch(/<img|<image|data:image/);
  });
});

describe("Waterfall — AC2: from the top of the field to just above the Introduction banner", () => {
  it("is pinned to the top of the field and sized to stop above the hero banner", () => {
    const { root } = renderWaterfall();
    expect(root).toHaveClass("absolute", "inset-x-0", "top-0");
    expect(root.className).toContain(
      "h-[calc(var(--field-inset)+var(--penalty-w)*0.425+3.25rem)]",
    );
  });

  it("has no hard bottom edge: it fades out progressively", () => {
    const { root } = renderWaterfall();
    expect(root.className).toContain(
      "[mask-image:linear-gradient(to_bottom,black_0_74%,transparent_100%)]",
    );
  });
});

describe("Waterfall — AC3/AC4: moving water, still with reduced motion", () => {
  it("animates streaks, spray, ripples and floating debris only with motion-safe CSS", () => {
    const html = renderToStaticMarkup(<Waterfall />);
    for (const animation of [
      "animate-water-dash",
      "animate-droplet",
      "animate-water-drift",
    ]) {
      expect(html).toContain(`motion-safe:${animation}`);
    }
    // Every animation is motion-safe, so nothing moves with prefers-reduced-motion.
    const classes = html.match(/class="[^"]*"/g)!.join(" ");
    expect(classes.match(/(?<![\w:-])animate-[\w-]+/g)).toBeNull();
    expect(html).not.toMatch(/<animate|<set\b|<script/);
  });

  it("defines the water keyframes in globals.css", () => {
    const css = readFileSync(
      join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    for (const name of ["water-drift", "water-dash", "droplet"]) {
      expect(css).toContain(`@keyframes ${name}`);
      expect(css).toMatch(new RegExp(`--animate-${name}:`));
    }
  });
});

describe("Waterfall — AC5: decorative", () => {
  it("is aria-hidden, unfocusable and has no text", () => {
    const { root } = renderWaterfall();
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("pointer-events-none");
    root
      .querySelectorAll("svg")
      .forEach((svg) => expect(svg).toHaveAttribute("focusable", "false"));
    expect(root.textContent).toBe("");
    expect(root.querySelectorAll("a, button, [tabindex]")).toHaveLength(0);
  });
});
