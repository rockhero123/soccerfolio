import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GameEvent, Phase } from "./engine";

// A stand-in engine, so the tests can drive the match's phases directly.
const fake = vi.hoisted(() => ({
  emit: (() => {}) as (event: GameEvent) => void,
  engine: null as null | Record<string, unknown>,
}));
vi.mock("./engine", () => ({
  GameEngine: class {
    phase: Phase = "countdown";
    score = { visitor: 0, machine: 0 };
    turn = "machine";
    count = 3;
    restart = vi.fn();
    update() {}
    pointerDown() {
      return false;
    }
    pointerMove() {}
    pointerUp() {}
    constructor({ onEvent }: { onEvent: (event: GameEvent) => void }) {
      fake.emit = onEvent;
      fake.engine = this as unknown as Record<string, unknown>;
    }
  },
}));
const whistle = vi.hoisted(() => vi.fn());
vi.mock("./whistle", () => ({ blowWhistle: whistle, createAudio: () => null }));

import ContactGame, { GROW_MS, WINNER_MS } from "./ContactGame";

function setup() {
  const props = { audio: null, onWin: vi.fn(), onClose: vi.fn() };
  render(<ContactGame {...props} />);
  return props;
}

function go(phase: Phase, score = { visitor: 0, machine: 0 }) {
  act(() => {
    Object.assign(fake.engine!, { phase, score });
    fake.emit({ type: "phase", phase });
  });
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.documentElement.style.overflow = "";
});

describe("ContactGame — the game window (spec 900 US-3)", () => {
  it("is a labelled region in the page (not a modal), with a vertical pitch canvas, focus on Close", () => {
    setup();
    const region = screen.getByRole("region", { name: /score 3 goals/i });
    expect(region.closest("dialog")).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
    const pitch = screen.getByRole("img", { name: /vertical soccer pitch/i }) as HTMLCanvasElement;
    expect(pitch.tagName).toBe("CANVAS");
    expect(pitch.height).toBeGreaterThan(pitch.width);
    expect(screen.getByRole("button", { name: "Close the game" })).toHaveFocus();
    // The page keeps scrolling normally.
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("grows out of the grass (scaling up from 0), then the match starts", () => {
    setup();
    const region = screen.getByRole("region", { name: /score 3 goals/i });
    expect(region).toHaveClass("starting:scale-y-0", "origin-top", "motion-reduce:transition-none");
    expect(region).not.toHaveAttribute("data-grown");
    act(() => vi.advanceTimersByTime(GROW_MS));
    expect(region).toHaveAttribute("data-grown");
  });

  it("states the final goal in the top corner: First to 3 wins", () => {
    setup();
    expect(document.querySelector("[data-goal-target]")).toHaveTextContent("First to 3 wins");
  });

  it("starts with the 3-2-1 countdown, the score at 0 – 0", () => {
    setup();
    expect(document.querySelector("[data-countdown]")).toHaveTextContent("3");
    expect(document.querySelector("[data-score]")).toHaveTextContent("0 – 0");
    expect(document.querySelector("[data-hint]")).toHaveTextContent(/machine kicks off/i);
  });

  it("blows the whistle when the engine says so", () => {
    setup();
    act(() => fake.emit({ type: "whistle" }));
    expect(whistle).toHaveBeenCalledTimes(1);
  });

  it("tells the visitor how to shoot on their turn", () => {
    setup();
    go("visitor");
    expect(document.querySelector("[data-hint]")).toHaveTextContent(/drag back from a green player/i);

  });

  it("shows GOAL! and the new score", () => {
    setup();
    act(() => {
      Object.assign(fake.engine!, { phase: "goal", score: { visitor: 1, machine: 0 } });
      fake.emit({ type: "goal", team: "visitor" });
    });
    expect(document.querySelector("[data-goal-sign]")).toHaveTextContent("Goal!");
    expect(document.querySelector("[data-score]")).toHaveTextContent("1 – 0");
  });

  it("shows the Winner sign, then reveals the contact details", () => {
    const { onWin } = setup();
    go("won", { visitor: 3, machine: 1 });
    expect(document.querySelector("[data-winner-sign]")).toHaveTextContent("Winner!");
    act(() => vi.advanceTimersByTime(WINNER_MS - 10));
    expect(onWin).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(10));
    expect(onWin).toHaveBeenCalledTimes(1);
  });

  it("reports wins and losses to analytics, with the score", () => {
    window.gtag = vi.fn();
    setup();
    act(() => {
      Object.assign(fake.engine!, { score: { visitor: 3, machine: 1 } });
      fake.emit({ type: "won" });
    });
    expect(window.gtag).toHaveBeenCalledWith("event", "game_win", { visitor_goals: 3, machine_goals: 1 });
    act(() => {
      Object.assign(fake.engine!, { score: { visitor: 2, machine: 3 } });
      fake.emit({ type: "lost" });
    });
    expect(window.gtag).toHaveBeenCalledWith("event", "game_lose", { visitor_goals: 2, machine_goals: 3 });
    delete window.gtag;
  });

  it("offers a new match after a loss", () => {
    setup();
    go("lost", { visitor: 1, machine: 3 });
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(fake.engine!.restart).toHaveBeenCalled();
  });

  it("has no skip link; Close and Escape put the game away", () => {
    const { onClose } = setup();
    expect(screen.queryByRole("button", { name: /skip/i })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Close the game" }));
    fireEvent.keyDown(screen.getByRole("region", { name: /score 3 goals/i }), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
