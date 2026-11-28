import { describe, expect, it } from "vitest";
import {
  BALL_R,
  GOAL_W,
  MAX_SHOT,
  PIN_R,
  PITCH,
  collide,
  goalScored,
  isMoving,
  shoot,
  step,
  type Body,
  type World,
} from "./physics";

const body = (x: number, y: number, r = PIN_R, mass = 2, vx = 0, vy = 0): Body => ({ x, y, vx, vy, r, mass });
const ball = (x: number, y: number, vx = 0, vy = 0) => body(x, y, BALL_R, 1, vx, vy);
const run = (world: World, seconds: number) => {
  for (let t = 0; t < seconds; t += 1 / 240) step(world, 1 / 240);
};

describe("physics — pool-like collisions (spec 900 US-3 AC6)", () => {
  it("keeps momentum in a collision and loses only a little energy", () => {
    const a = body(0, 0, PIN_R, 2, 100, 0);
    const b = body(9, 0, BALL_R, 1);
    const before = { p: a.mass * a.vx + b.mass * b.vx, e: 0.5 * a.mass * a.vx ** 2 };
    expect(collide(a, b)).toBe(true);
    const p = a.mass * a.vx + b.mass * b.vx;
    const e = 0.5 * a.mass * a.vx ** 2 + 0.5 * b.mass * b.vx ** 2;
    expect(p).toBeCloseTo(before.p, 6);
    expect(e).toBeLessThan(before.e);
    expect(e).toBeGreaterThan(before.e * 0.8);
    // The lighter ball flies off faster than the pin that hit it.
    expect(b.vx).toBeGreaterThan(a.vx);
    expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThanOrEqual(PIN_R + BALL_R - 1e-9);
  });

  it("a glancing hit sends the ball off at an angle, like pool", () => {
    const a = body(0, 0, PIN_R, 2, 100, 0);
    const b = body(8, 4, BALL_R, 1);
    collide(a, b);
    expect(b.vx).toBeGreaterThan(0);
    expect(b.vy).toBeGreaterThan(0);
  });

  it("bounces off the side walls, losing some speed", () => {
    const world: World = { pins: [body(10, 50, PIN_R, 2, -150, 0)], ball: ball(60, 95) };
    run(world, 0.2);
    expect(world.pins[0].vx).toBeGreaterThan(0);
    expect(world.pins[0].x).toBeGreaterThanOrEqual(PIN_R);
  });

  it("slides to a stop with friction", () => {
    const world: World = { pins: [], ball: ball(60, 95, 0, 0) };
    shoot(world.ball, 1, 0, 0.3);
    expect(isMoving(world)).toBe(true);
    run(world, 8);
    expect(isMoving(world)).toBe(false);
  });

  it("shoots along the aim, at a share of the fastest shot", () => {
    const pin = body(0, 0);
    shoot(pin, 3, 4, 0.5);
    expect(pin.vx).toBeCloseTo(0.3 * MAX_SHOT);
    expect(pin.vy).toBeCloseTo(0.4 * MAX_SHOT);
  });
});

describe("physics — goals", () => {
  it("lets the ball into the top goal mouth: a goal for the visitor", () => {
    const world: World = { pins: [], ball: ball(PITCH.w / 2, 20, 0, -260) };
    let scorer = null;
    for (let i = 0; i < 240 && !scorer; i++) {
      step(world, 1 / 240);
      scorer = goalScored(world.ball);
    }
    expect(scorer).toBe("visitor");
  });

  it("a ball past the bottom line is a goal for the machine", () => {
    expect(goalScored(ball(PITCH.w / 2, PITCH.h + BALL_R + 1))).toBe("machine");
  });

  it("outside the goal mouth, the goal line is a wall", () => {
    const world: World = { pins: [], ball: ball(10, 20, 0, -260) };
    run(world, 0.3);
    expect(world.ball.y).toBeGreaterThanOrEqual(BALL_R);
    expect(goalScored(world.ball)).toBeNull();
    expect(GOAL_W).toBeLessThan(PITCH.w / 2);
  });

  it("pins never enter a goal", () => {
    const world: World = { pins: [body(PITCH.w / 2, 30, PIN_R, 2, 0, -300)], ball: ball(10, 150) };
    run(world, 0.5);
    expect(world.pins[0].y).toBeGreaterThanOrEqual(PIN_R);
  });
});
