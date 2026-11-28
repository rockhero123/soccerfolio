import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "./analytics";

afterEach(() => {
  delete window.gtag;
});

describe("track (spec 900 US-3 AC10)", () => {
  it("sends the event to Google Analytics when it is loaded", () => {
    window.gtag = vi.fn();
    track("game_win", { visitor_goals: 3 });
    expect(window.gtag).toHaveBeenCalledWith("event", "game_win", { visitor_goals: 3 });
  });

  it("does nothing, and never throws, without Google Analytics", () => {
    expect(() => track("contact_click")).not.toThrow();
    window.gtag = () => {
      throw new Error("blocked");
    };
    expect(() => track("contact_click")).not.toThrow();
  });
});
