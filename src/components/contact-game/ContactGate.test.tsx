import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { expectPixelSprite, expectTokensOnly, pixelTokens } from "@/test/pixel";
import ContactGate, { SPLIT_MS } from "./ContactGate";
import GoldIngot from "./GoldIngot";

// The real game is tested on its own; here a stand-in lets the test win at once.
vi.mock("./ContactGame", () => ({
  default: ({ onWin, onClose }: { onWin: () => void; onClose: () => void }) => (
    <section aria-label="Contact game: score 3 goals">
      <button type="button" onClick={onWin}>Win</button>
      <button type="button" onClick={onClose}>Close the game</button>
    </section>
  ),
}));
import { CONTACT_UNLOCKED_KEY } from "./unlock";

const renderGate = () =>
  render(
    <ContactGate ingot={<GoldIngot />}>
      <a href="mailto:test@example.com">Email</a>
    </ContactGate>,
  );
const contactButton = () => screen.getByRole("button", { name: "Contact" });
const content = () => document.querySelector("[data-contact-gate-content]")!;

/** Clicks CONTACT and waits for the ingot to split. */
function openGame() {
  fireEvent.click(contactButton());
  act(() => vi.advanceTimersByTime(SPLIT_MS));
}

beforeEach(() => {
  vi.useFakeTimers();
  sessionStorage.clear();
  // jsdom has no canvas: the game loop simply does not draw.
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("ContactGate — the CONTACT gold ingot (spec 900 US-3 AC1)", () => {
  it("hides the contact signs behind a CONTACT button", () => {
    renderGate();
    expect(contactButton()).toHaveAttribute("aria-expanded", "false");
    expect(content()).toHaveClass("hidden");
    // The details stay in the HTML (for search engines and no-JS visitors).
    expect(content().querySelector("a")).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("draws the button as a gold ingot with leaves, in tokens only", () => {
    renderGate();
    const ingot = contactButton().querySelector('[data-ingot-half="left"] [data-gold-ingot]')!;
    expectPixelSprite(ingot);
    const tokens = pixelTokens(ingot);
    for (const t of ["gold-400", "gold-600", "gold-700", "gold-800", "leaf-900", "leaf-500"])
      expect(tokens).toContain(t);
    expectTokensOnly(renderToStaticMarkup(<GoldIngot />));
  });

  it("is drawn at 4 px per art pixel everywhere, the size of a title banner", () => {
    renderGate();
    expect(document.querySelector("[data-contact-gate-button]")).toHaveClass("[--px:4px]");
  });

  it("labels it in ink, with the red focus ring", () => {
    renderGate();
    expect(contactButton().querySelector('[data-ingot-half="left"] > span')).toHaveClass("text-ink", "font-heading");
    expect(contactButton()).toHaveClass("focus-visible:outline-red-600");
  });
});

describe("ContactGate — analytics (AC10)", () => {
  it("reports each click on CONTACT", () => {
    window.gtag = vi.fn();
    renderGate();
    fireEvent.click(contactButton());
    expect(window.gtag).toHaveBeenCalledWith("event", "contact_click", undefined);
    delete window.gtag;
  });
});

describe("ContactGate — opening and closing the game (AC2)", () => {
  it("splits the ingot in two halves that fly apart, then shows the game in the page", () => {
    renderGate();
    fireEvent.click(contactButton());
    const left = document.querySelector('[data-ingot-half="left"]')!;
    const right = document.querySelector('[data-ingot-half="right"]')!;
    expect(left).toHaveClass("[clip-path:inset(0_calc(50%-1px)_0_0)]", "-translate-x-[45%]", "opacity-0");
    expect(right).toHaveClass("[clip-path:inset(0_0_0_calc(50%-1px))]", "translate-x-[45%]", "opacity-0");
    expect(contactButton()).toBeDisabled();
    expect(screen.queryByRole("region", { name: /score 3 goals/i })).toBeNull();
    act(() => vi.advanceTimersByTime(SPLIT_MS));
    expect(screen.queryByRole("button", { name: "Contact" })).toBeNull();
    const game = screen.getByRole("region", { name: /score 3 goals/i });
    expect(game.closest("[data-contact-gate]")).not.toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closing it brings back the CONTACT button, still locked", () => {
    renderGate();
    openGame();
    fireEvent.click(screen.getByRole("button", { name: "Close the game" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(contactButton()).toBeInTheDocument();
    expect(content()).toHaveClass("hidden");
  });
});

describe("ContactGate — revealing the contact signs (AC8, AC9)", () => {
  it("winning reveals them, and remembers nothing for the next load", () => {
    renderGate();
    openGame();
    fireEvent.click(screen.getByRole("button", { name: "Win" }));
    expect(screen.queryByRole("region", { name: /score 3 goals/i })).toBeNull();
    expect(screen.queryByRole("button", { name: "Contact" })).toBeNull();
    expect(content()).not.toHaveClass("hidden");
    expect(sessionStorage.length).toBe(0);
  });

  it("is unlocked when tests set the unlock key", () => {
    sessionStorage.setItem(CONTACT_UNLOCKED_KEY, "1");
    renderGate();
    expect(screen.queryByRole("button", { name: "Contact" })).toBeNull();
    expect(content()).not.toHaveClass("hidden");
  });

  it("moves focus to the first contact sign once revealed", () => {
    renderGate();
    openGame();
    fireEvent.click(screen.getByRole("button", { name: "Win" }));
    act(() => vi.advanceTimersByTime(50));
    expect(screen.getByRole("link", { name: "Email" })).toHaveFocus();
  });
});
