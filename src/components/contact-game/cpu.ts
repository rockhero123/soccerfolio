import { PITCH, type Body, type World } from "./physics";

export type Shot = { pin: Body; dx: number; dy: number; power: number };

/** The goal the machine attacks: the visitor's, at the bottom. */
const TARGET = { x: PITCH.w / 2, y: PITCH.h + 6 };

/** Distance from point (px, py) to the segment a → b. */
function segmentDistance(ax: number, ay: number, bx: number, by: number, px: number, py: number) {
  const vx = bx - ax;
  const vy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy || 1)));
  return Math.hypot(ax + vx * t - px, ay + vy * t - py);
}

/**
 * The machine's shot (spec 900 US-3 AC5): for each of its pins, aim at the
 * "ghost ball" point behind the ball on the line to the visitor's goal, and
 * pick the nearest pin with a clear, straight-on shot. A random error on the
 * angle (never enough to miss the ball) keeps it beatable. `rand` returns numbers in [0, 1).
 */
export function chooseShot(world: World, rand: () => number = Math.random, error = 0.16): Shot {
  const { ball } = world;
  const mine = world.pins.filter((p) => p.team === "machine");
  const toGoal = { x: TARGET.x - ball.x, y: TARGET.y - ball.y };
  const toGoalLen = Math.hypot(toGoal.x, toGoal.y) || 1;
  const gx = toGoal.x / toGoalLen;
  const gy = toGoal.y / toGoalLen;

  let best: { pin: Body; tx: number; ty: number; score: number } | undefined;
  for (const pin of mine) {
    // Hit the ball on the side away from the goal, so it rolls towards it.
    const tx = ball.x - gx * (pin.r + ball.r);
    const ty = ball.y - gy * (pin.r + ball.r);
    const dx = tx - pin.x;
    const dy = ty - pin.y;
    const dist = Math.hypot(dx, dy) || 1;
    // How straight-on the hit is: 1 = pushing the ball right at the goal.
    const straight = (dx / dist) * gx + (dy / dist) * gy;
    // Anything in the way (other pins) spoils the shot.
    const blocked = world.pins.some(
      (other) =>
        other !== pin && segmentDistance(pin.x, pin.y, tx, ty, other.x, other.y) < other.r + pin.r,
    );
    const score = straight * 2 - dist / 45 - (blocked ? 3 : 0);
    if (!best || score > best.score) best = { pin, tx, ty, score };
  }
  const { pin, tx, ty } = best!;
  const dist = Math.hypot(tx - pin.x, ty - pin.y);
  const aimed = Math.atan2(ty - pin.y, tx - pin.x) + (rand() * 2 - 1) * error;
  // The error never makes it miss the ball altogether: keep the path within
  // a glancing hit of the ball's centre.
  const toBall = Math.atan2(ball.y - pin.y, ball.x - pin.x);
  const ballDist = Math.hypot(ball.x - pin.x, ball.y - pin.y);
  const window = Math.asin(Math.min(1, ((pin.r + ball.r) * 0.8) / ballDist));
  let off = Math.atan2(Math.sin(aimed - toBall), Math.cos(aimed - toBall));
  off = Math.max(-window, Math.min(window, off));
  const angle = toBall + off;
  const power = Math.min(1, 0.55 + dist / 260 + rand() * 0.15);
  return { pin, dx: Math.cos(angle), dy: Math.sin(angle), power };
}
