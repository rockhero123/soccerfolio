import { describe, expect, it } from "vitest";
import { ART, BALL_ART, INGOT, PIN_ART, PITCH_ART, ingot } from "./gameArt";
import { PIN_R } from "./physics";

const tokens = (c: { width: number; height: number; get(x: number, y: number): string | undefined }) => {
  const set = new Set<string>();
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const t = c.get(x, y);
    if (t) set.add(t);
  }
  return set;
};

describe("contact game art (spec 900 US-3)", () => {
  it("the pitch is vertical, with lawn stripes, chalk lines and nets", () => {
    expect(ART.h).toBeGreaterThan(ART.w);
    const t = tokens(PITCH_ART);
    for (const token of ["grass-500", "grass-600", "paper-100", "stone-400"]) expect(t.has(token)).toBe(true);
  });

  it("pins are round: green pins are grass in a green ring, red pins are red all over", () => {
    for (const team of ["visitor", "machine"] as const) {
      const pin = PIN_ART[team];
      expect(pin.width).toBe(PIN_R * 2 + 1);
      expect(pin.get(0, 0)).toBeUndefined();
      expect(pin.get(PIN_R, 0)).toBe("ink");
    }
    expect(PIN_ART.visitor.get(PIN_R, PIN_R)).toMatch(/^grass-/);
    expect([...tokens(PIN_ART.visitor)].some((t) => t.startsWith("red-"))).toBe(false);
    // Red all over: no grass anywhere, the centre is red too.
    expect(PIN_ART.machine.get(PIN_R, PIN_R)).toMatch(/^red-/);
    expect([...tokens(PIN_ART.machine)].some((t) => t.startsWith("grass-"))).toBe(false);
  });

  it("the ball is white with dark patches", () => {
    const t = tokens(BALL_ART);
    expect(t.has("paper-100")).toBe(true);
    expect(t.has("ink")).toBe(true);
  });

  it("the ingot is gold with leaves around it", () => {
    const art = ingot();
    expect(art.width).toBe(INGOT.w);
    const t = tokens(art);
    for (const token of ["gold-400", "gold-600", "gold-800", "leaf-900"]) expect(t.has(token)).toBe(true);
  });
});
