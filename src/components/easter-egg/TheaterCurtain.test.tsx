import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import TheaterCurtain, { LIFT_MS, STAGE_LIGHT } from "./TheaterCurtain";
import TheaterDrapes from "./TheaterDrapes";
import TheaterStalls from "./TheaterStalls";

function setup() {
  const onBegin = vi.fn();
  const onSkip = vi.fn();
  const onDone = vi.fn();
  const view = render(
    <TheaterCurtain
      drapes={<TheaterDrapes />}
      stalls={<TheaterStalls />}
      onBegin={onBegin}
      onSkip={onSkip}
      onDone={onDone}
    />,
  );
  const dialog = view.container.querySelector("[data-theater]") as HTMLDialogElement;
  return { onBegin, onSkip, onDone, dialog };
}

const begin = () => screen.getByRole("button", { name: "Start" });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  document.documentElement.style.overflow = "";
});

describe("TheaterCurtain — the theater before the match (spec 900 US-2 AC6)", () => {
  it("is an open dialog covering the page, named by its poster, with focus on 'Start'", () => {
    const { dialog } = setup();
    expect(dialog.tagName).toBe("DIALOG");
    expect(dialog).toHaveAttribute("open");
    expect(dialog).toHaveAccessibleName("Ready to start the match?");
    expect(dialog).toHaveClass("fixed", "inset-0", "pointer-events-auto");
    expect(begin()).toHaveFocus();
  });

  it("when skipped (tests), never opens as a modal, takes focus or locks scrolling", () => {
    document.documentElement.setAttribute("data-skip-theater", "");
    try {
      const outside = document.createElement("button");
      document.body.append(outside);
      outside.focus();
      setup();
      expect(outside).toHaveFocus();
      expect(document.documentElement.style.overflow).toBe("");
      outside.remove();
    } finally {
      document.documentElement.removeAttribute("data-skip-theater");
    }
  });

  it("stops the page scrolling behind the curtain, and restores it", () => {
    const { onDone } = setup();
    expect(document.documentElement.style.overflow).toBe("hidden");
    fireEvent.click(begin());
    act(() => vi.advanceTimersByTime(LIFT_MS));
    expect(onDone).toHaveBeenCalled();
    cleanup();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("shows a paper poster asking 'Ready to start the match?' above the 'Start' button", () => {
    const { dialog } = setup();
    const poster = dialog.querySelector("[data-theater-poster]")!;
    expect(poster).toHaveClass("pixel-frame-paper");
    const heading = screen.getByRole("heading", { level: 2, name: "Ready to start the match?" });
    expect(poster).toContainElement(heading);
    expect(heading).toHaveClass("text-ink", "font-heading");
    // The poster comes before the button.
    expect(poster.compareDocumentPosition(begin()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(begin()).toHaveClass("pixel-button", "bg-gold-500", "text-ink");
  });

  it("'Start' starts the music at once, then lifts the curtain", () => {
    const { onBegin, onSkip, onDone, dialog } = setup();
    fireEvent.click(begin());
    expect(onBegin).toHaveBeenCalledTimes(1);
    expect(onSkip).not.toHaveBeenCalled();
    expect(dialog).toHaveAttribute("data-lifting");
    expect(dialog.querySelector("[data-theater-drapes]")!.className).toMatch(/-translate-y-/);
    expect(dialog.querySelector("[data-theater-stalls]")).toHaveClass("translate-y-full", "opacity-0");
    expect(begin()).toBeDisabled();
    // The curtain rises for LIFT_MS, then the theater is removed.
    act(() => vi.advanceTimersByTime(LIFT_MS - 50));
    expect(onDone).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(50));
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it("lights the stage: dark blurred corners, a warm pool on the floor, never blocking clicks", () => {
    const { dialog } = setup();
    const light = dialog.querySelector("[data-theater-light]")!;
    expect(light).toHaveAttribute("aria-hidden", "true");
    expect(light).toHaveClass("pointer-events-none", "absolute", "inset-0");
    // A smooth radial shadow: clear in the middle, darkest at the edges.
    expect(STAGE_LIGHT.shadow).toMatch(/^radial-gradient\(ellipse .*transparent 30%.*var\(--color-ink\) 88%, transparent\) 100%\)$/);
    // Warm light centred low, on the lower curtain and the wooden floor.
    expect(STAGE_LIGHT.light).toMatch(/^radial-gradient\(ellipse [\d%\s]+at 50% 66%.*var\(--color-gold-400\)/);
    expect(light.querySelector(".mix-blend-screen")).not.toBeNull();
    // It fades away as the curtain rises.
    fireEvent.click(begin());
    expect(light).toHaveClass("opacity-0");
  });

  it("lifts smoothly (not pixel-stepped) and stands still with reduced motion", () => {
    const { dialog } = setup();
    const drapes = dialog.querySelector("[data-theater-drapes]")!;
    expect(drapes.className).toMatch(/transition-\[translate\]/);
    expect(drapes.className).toMatch(/ease-\[cubic-bezier/);
    expect(drapes).toHaveClass("motion-reduce:transition-none");
  });

  it("with reduced motion, removes the curtain right away", () => {
    const matchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...matchMedia(query),
      matches: query.includes("reduce"),
    })) as typeof window.matchMedia;
    try {
      const { onDone } = setup();
      fireEvent.click(begin());
      act(() => vi.advanceTimersByTime(0));
      expect(onDone).toHaveBeenCalled();
    } finally {
      window.matchMedia = matchMedia;
    }
  });

  it("Escape enters without music, and the curtain still rises", () => {
    const { onBegin, onSkip, dialog } = setup();
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onBegin).not.toHaveBeenCalled();
    expect(dialog).toHaveAttribute("data-lifting");
  });

  it("only reacts to the first choice", () => {
    const { onBegin, onSkip, dialog } = setup();
    fireEvent.click(begin());
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(onBegin).toHaveBeenCalledTimes(1);
    expect(onSkip).not.toHaveBeenCalled();
  });
});

describe("TheaterDrapes and TheaterStalls — the pixel-art theater", () => {
  it("draws velvet folds, a gold-fringed valance and hem, and the match crest", () => {
    const { container } = render(<TheaterDrapes />);
    const art = container.querySelector('[data-theater-art="drapes"]')!;
    expect(art).toHaveAttribute("aria-hidden", "true");
    const svgs = art.querySelectorAll("svg");
    svgs.forEach(expectPixelSprite);
    const tokens = pixelTokens(art);
    for (const t of ["red-800", "red-700", "red-600", "red-500", "gold-600", "gold-700"])
      expect(tokens).toContain(t);
    // The curtain, hem and valance are repeating tiles, so they fit any screen.
    expect(art.querySelectorAll("pattern")).toHaveLength(3);
  });

  it("draws a brown wooden stage and dark blue-gray seats, with no red", () => {
    const { container } = render(<TheaterStalls />);
    const art = container.querySelector('[data-theater-art="stalls"]')!;
    expect(art).toHaveAttribute("aria-hidden", "true");
    const tokens = pixelTokens(art);
    for (const t of ["wood-500", "wood-800", "wood-300", "water-900", "water-700", "stone-900"])
      expect(tokens).toContain(t);
    expect(tokens.some((t) => t.startsWith("red-"))).toBe(false);
    // The lip and seats repeat; the floor is one wide perspective sprite.
    expect(art.querySelectorAll("pattern")).toHaveLength(2);
  });

  it("keeps the curtain mostly dark velvet, with only a thin bright sheen", () => {
    const { container } = render(<TheaterDrapes />);
    const curtain = container.querySelector('pattern[id^="curtain-"]')!;
    const tokens = pixelTokens(curtain);
    expect(tokens).toEqual(expect.arrayContaining(["ink", "red-800", "red-700", "red-600", "red-500"]));
    expect(tokens).not.toContain("red-400");
  });

  it("uses tokens only", () => {
    expectTokensOnly(renderToStaticMarkup(<TheaterDrapes />));
    expectTokensOnly(renderToStaticMarkup(<TheaterStalls />));
    vi.useRealTimers();
    expectTokensOnly(
      renderToStaticMarkup(
        <TheaterCurtain drapes={null} stalls={null} onBegin={() => {}} onSkip={() => {}} onDone={() => {}} />,
      ),
    );
  });
});
