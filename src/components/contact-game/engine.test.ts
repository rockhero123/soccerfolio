import { describe, expect, it, vi } from "vitest";
import { contactGame } from "@/content/contactGame";
import { COUNT_S, FULL_DRAG, GOAL_S, GameEngine, MACHINE_AIM_S, type GameEvent } from "./engine";
import { PITCH } from "./physics";

function setup() {
  const events: GameEvent[] = [];
  const engine = new GameEngine({
    goalsToWin: contactGame.goalsToWin,
    rand: () => 0.5,
    error: 0,
    onEvent: (e) => events.push(e),
  });
  return { engine, events };
}

/** Runs the engine until `done` or a time limit. */
function runUntil(engine: GameEngine, done: () => boolean, seconds = 20) {
  for (let t = 0; t < seconds && !done(); t += 1 / 60) engine.update(1 / 60);
}

/** Puts the ball in front of the top goal and a green pin behind it. */
function setUpScoringChance(engine: GameEngine) {
  const pin = engine.world.pins.find((p) => p.team === "visitor")!;
  engine.world.pins.forEach((p) => {
    if (p !== pin) {
      p.x = p.team === "machine" ? 8 : 112;
      p.y = PITCH.h - 10;
    }
  });
  engine.world.ball.x = PITCH.w / 2;
  engine.world.ball.y = 30;
  pin.x = PITCH.w / 2;
  pin.y = 60;
  return pin;
}

describe("GameEngine — countdown and kick-off (spec 900 US-3 AC4)", () => {
  it("counts 3, 2, 1, blows the whistle, and the machine aims first", () => {
    const { engine, events } = setup();
    expect(engine.phase).toBe("countdown");
    expect(engine.count).toBe(3);
    engine.update(COUNT_S + 0.01);
    expect(engine.count).toBe(2);
    engine.update(COUNT_S);
    expect(engine.count).toBe(1);
    expect(events.some((e) => e.type === "whistle")).toBe(false);
    engine.update(COUNT_S);
    expect(events.some((e) => e.type === "whistle")).toBe(true);
    expect(engine.phase).toBe("machine-aim");
    expect(engine.turn).toBe("machine");
  });

  it("the machine shows its aiming arrow, then shoots", () => {
    const { engine } = setup();
    engine.update(3 * COUNT_S + 0.01);
    engine.update(MACHINE_AIM_S / 2);
    expect(engine.aim?.pin.team).toBe("machine");
    expect(engine.aim!.power).toBeGreaterThan(0);
    engine.update(MACHINE_AIM_S);
    expect(engine.phase).toBe("moving");
    expect(engine.aim).toBeNull();
  });

  it("when everything stops, it is the visitor's turn", () => {
    const { engine } = setup();
    runUntil(engine, () => engine.phase === "visitor");
    expect(engine.phase).toBe("visitor");
    expect(engine.turn).toBe("visitor");
  });
});

describe("GameEngine — the visitor's shot (spec 900 US-3 AC5)", () => {
  it("drags back from a green pin to aim, and releases to shoot", () => {
    const { engine } = setup();
    runUntil(engine, () => engine.phase === "visitor");
    const pin = engine.world.pins.find((p) => p.team === "visitor")!;
    expect(engine.pointerDown(pin.x, pin.y)).toBe(true);
    engine.pointerMove(pin.x, pin.y + FULL_DRAG); // pull down: aim up
    expect(engine.aim!.dy).toBeCloseTo(-1);
    expect(engine.aim!.power).toBeCloseTo(1);
    engine.pointerUp();
    expect(engine.phase).toBe("moving");
    expect(pin.vy).toBeLessThan(0);
  });

  it("ignores the machine's pins, empty grass and the machine's turn", () => {
    const { engine } = setup();
    const red = engine.world.pins.find((p) => p.team === "machine")!;
    expect(engine.pointerDown(red.x, red.y)).toBe(false); // countdown
    runUntil(engine, () => engine.phase === "visitor");
    expect(engine.pointerDown(red.x, red.y)).toBe(false);
    expect(engine.pointerDown(2, 2)).toBe(false);
  });

  it("a tap is not a shot", () => {
    const { engine } = setup();
    runUntil(engine, () => engine.phase === "visitor");
    const pin = engine.world.pins.find((p) => p.team === "visitor")!;
    engine.pointerDown(pin.x, pin.y);
    engine.pointerMove(pin.x, pin.y + 1);
    engine.pointerUp();
    expect(engine.phase).toBe("visitor");
  });
});

describe("GameEngine — goals and the winner (spec 900 US-3 AC7, AC8)", () => {
  it("a goal is shown, the pieces go back, and the team that conceded shoots", () => {
    const { engine, events } = setup();
    runUntil(engine, () => engine.phase === "visitor");
    const pin = setUpScoringChance(engine);
    engine.pointerDown(pin.x, pin.y);
    engine.pointerMove(pin.x, pin.y + FULL_DRAG);
    engine.pointerUp();
    runUntil(engine, () => engine.phase === "goal", 5);
    expect(engine.score).toEqual({ visitor: 1, machine: 0 });
    expect(events).toContainEqual({ type: "goal", team: "visitor" });
    engine.update(GOAL_S + 0.01);
    expect(engine.world.ball.y).toBe(PITCH.h / 2);
    expect(engine.phase).toBe("machine-aim");
  });

  it(`wins at ${contactGame.goalsToWin} goals`, () => {
    const { engine, events } = setup();
    for (let goal = 1; goal <= contactGame.goalsToWin; goal++) {
      runUntil(engine, () => engine.phase === "visitor", 40);
      // Make the machine's shots harmless: skip to the visitor's chance.
      const pin = setUpScoringChance(engine);
      engine.pointerDown(pin.x, pin.y);
      engine.pointerMove(pin.x, pin.y + FULL_DRAG);
      engine.pointerUp();
      runUntil(engine, () => engine.phase === "goal" || engine.phase === "won", 5);
      expect(engine.score.visitor).toBe(goal);
    }
    expect(engine.phase).toBe("won");
    expect(events).toContainEqual({ type: "won" });
  });

  it("restart() starts a new match from 0 – 0", () => {
    const { engine } = setup();
    const onEvent = vi.fn();
    engine.score = { visitor: 1, machine: 3 };
    engine.phase = "lost";
    void onEvent;
    engine.restart();
    expect(engine.score).toEqual({ visitor: 0, machine: 0 });
    expect(engine.phase).toBe("countdown");
  });
});
