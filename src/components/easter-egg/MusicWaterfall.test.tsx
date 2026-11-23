import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { easterEgg } from "@/content/easterEgg";
import MusicWaterfall from "./MusicWaterfall";
import { LIFT_MS } from "./TheaterCurtain";
import { SKIP_THEATER_KEY } from "./theaterSkip";

// The YouTube player is never reached in unit tests: the API stays "loading".
vi.mock("./youtube", () => ({
  loadYouTube: () => new Promise(() => {}),
  YOUTUBE_HOST: "https://www.youtube-nocookie.com",
}));

const theater = { drapes: <div data-test-drapes="" />, stalls: <div data-test-stalls="" /> };
const renderPlayer = () => render(<MusicWaterfall scene={<div />} theater={theater} />);
const theaterEl = () => document.querySelector("[data-theater]");

beforeEach(() => {
  sessionStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("MusicWaterfall — the theater (spec 900 US-2 AC6)", () => {
  it("is switched on", () => {
    expect(easterEgg.theater.enabled).toBe(true);
  });

  it("opens the theater on every load, while the video loads", () => {
    renderPlayer();
    expect(theaterEl()).not.toBeNull();
    expect(document.querySelector("[data-music-video]")).not.toBeNull();
    cleanup();
    renderPlayer();
    expect(theaterEl()).not.toBeNull();
  });

  it("keeps the theater while the curtain rises, then removes it", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(theaterEl()).not.toBeNull();
    act(() => vi.advanceTimersByTime(LIFT_MS / 2));
    expect(theaterEl()).not.toBeNull();
    act(() => vi.advanceTimersByTime(LIFT_MS / 2));
    expect(theaterEl()).toBeNull();
  });

  it("stores nothing, so the next load shows the theater again", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "Start" }));
    expect(sessionStorage.length).toBe(0);
  });

  it("Escape also lifts the curtain", () => {
    renderPlayer();
    fireEvent(theaterEl()!, new Event("cancel", { cancelable: true }));
    expect(theaterEl()).toHaveAttribute("data-lifting");
  });

  it("is skipped when tests set the skip key", () => {
    sessionStorage.setItem(SKIP_THEATER_KEY, "1");
    renderPlayer();
    expect(theaterEl()).toBeNull();
  });
});
