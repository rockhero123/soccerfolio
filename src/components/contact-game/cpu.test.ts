import { describe, expect, it } from "vitest";
import { chooseShot } from "./cpu";
import { kickOff } from "./lineup";
import { PITCH, goalScored, isMoving, shoot, step } from "./physics";

const fixed = (value: number) => () => value;

describe("the machine's shot (spec 900 US-3 AC5)", () => {
  it("shoots one of its own pins", () => {
    const shot = chooseShot(kickOff(), fixed(0.5));
    expect(shot.pin.team).toBe("machine");
    expect(shot.power).toBeGreaterThan(0);
    expect(shot.power).toBeLessThanOrEqual(1);
  });

  it("with a perfect aim, sends the ball towards the visitor's goal", () => {
    const world = kickOff();
    const shot = chooseShot(world, fixed(0.5), 0);
    shoot(shot.pin, shot.dx, shot.dy, shot.power);
    const start = world.ball.y;
    for (let i = 0; i < 240 * 3 && isMoving(world); i++) {
      step(world, 1 / 240);
      if (goalScored(world.ball)) break;
    }
    expect(world.ball.y).toBeGreaterThan(start);
  });

  it("its aiming error never makes it miss the ball altogether", () => {
    for (const r of [0, 0.999]) {
      const world = kickOff();
      const shot = chooseShot(world, fixed(r), 1);
      shoot(shot.pin, shot.dx, shot.dy, shot.power);
      const ballStart = { ...world.ball };
      for (let i = 0; i < 240 * 2; i++) step(world, 1 / 240);
      expect(Math.hypot(world.ball.x - ballStart.x, world.ball.y - ballStart.y)).toBeGreaterThan(1);
    }
  });

  it("aims within the pitch", () => {
    const shot = chooseShot(kickOff(), fixed(0.2));
    expect(shot.pin.x).toBeGreaterThan(0);
    expect(shot.pin.x).toBeLessThan(PITCH.w);
  });
});
