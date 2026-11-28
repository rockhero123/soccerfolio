/**
 * Physics of the contact game (spec 900 US-3 AC6), in art pixels and seconds:
 * pins and the ball are circles that slide with friction, collide elastically
 * like pool balls and bounce off the pitch walls. Only the ball can enter the
 * goal mouths. Pure functions, no DOM.
 */

export type Team = "visitor" | "machine";

export type Body = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  mass: number;
  /** Pins belong to a team; the ball has none. */
  team?: Team;
  name?: string;
};

export type World = { pins: Body[]; ball: Body };

/** The pitch (inside the touchlines), in art pixels. */
export const PITCH = { w: 120, h: 190 } as const;
/** Width of each goal mouth, centred on the goal line. */
export const GOAL_W = 40;
export const PIN_R = 7;
export const BALL_R = 3;

/** Velocity left after one second of sliding (exponential friction). */
const FRICTION = { pin: 0.32, ball: 0.42 } as const;
/** Bounciness: between bodies (pool-like) and off the walls. */
const RESTITUTION = { body: 0.92, wall: 0.78 } as const;
/** Below this speed (art px/s) a body stops. */
export const STOP_SPEED = 3;
/** Fastest shot, in art px/s. */
export const MAX_SHOT = 320;

export const goalMouth = {
  left: PITCH.w / 2 - GOAL_W / 2,
  right: PITCH.w / 2 + GOAL_W / 2,
};

const inMouth = (x: number) => x > goalMouth.left && x < goalMouth.right;

/** Which side scored if the ball is past a goal line inside a mouth. */
export function goalScored(ball: Body): Team | null {
  if (!inMouth(ball.x)) return null;
  // The machine defends the top goal, so a ball past the top line is the visitor's goal.
  if (ball.y < -ball.r) return "visitor";
  if (ball.y > PITCH.h + ball.r) return "machine";
  return null;
}

function walls(b: Body, isBall: boolean) {
  const e = RESTITUTION.wall;
  if (b.x < b.r) {
    b.x = b.r;
    b.vx = Math.abs(b.vx) * e;
  } else if (b.x > PITCH.w - b.r) {
    b.x = PITCH.w - b.r;
    b.vx = -Math.abs(b.vx) * e;
  }
  // The ball may pass the goal lines inside the mouths; pins never do.
  const open = isBall && inMouth(b.x);
  if (!open) {
    if (b.y < b.r) {
      b.y = b.r;
      b.vy = Math.abs(b.vy) * e;
    } else if (b.y > PITCH.h - b.r) {
      b.y = PITCH.h - b.r;
      b.vy = -Math.abs(b.vy) * e;
    }
  } else {
    // Inside a goal: the back of the net and the side netting stop it.
    const depth = 10;
    if (b.y < -depth) {
      b.y = -depth;
      b.vy = Math.abs(b.vy) * 0.2;
    } else if (b.y > PITCH.h + depth) {
      b.y = PITCH.h + depth;
      b.vy = -Math.abs(b.vy) * 0.2;
    }
  }
  // The posts: the ends of each goal mouth, as small round obstacles.
  if (isBall)
    for (const px of [goalMouth.left, goalMouth.right])
      for (const py of [0, PITCH.h]) collideFixed(b, px, py, 1);
}

/** Bounces a body off a fixed round obstacle (a post). */
function collideFixed(b: Body, x: number, y: number, r: number) {
  const dx = b.x - x;
  const dy = b.y - y;
  const d = Math.hypot(dx, dy);
  const min = b.r + r;
  if (d >= min || d === 0) return;
  const nx = dx / d;
  const ny = dy / d;
  b.x = x + nx * min;
  b.y = y + ny * min;
  const vn = b.vx * nx + b.vy * ny;
  if (vn < 0) {
    b.vx -= (1 + RESTITUTION.wall) * vn * nx;
    b.vy -= (1 + RESTITUTION.wall) * vn * ny;
  }
}

/** Elastic collision between two circles, with a little energy loss. */
export function collide(a: Body, b: Body) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy);
  const min = a.r + b.r;
  if (d >= min) return false;
  const nx = d === 0 ? 1 : dx / d;
  const ny = d === 0 ? 0 : dy / d;
  // Push them apart, the lighter one more.
  const overlap = min - d;
  const total = a.mass + b.mass;
  a.x -= nx * overlap * (b.mass / total);
  a.y -= ny * overlap * (b.mass / total);
  b.x += nx * overlap * (a.mass / total);
  b.y += ny * overlap * (a.mass / total);
  // Exchange momentum along the line between the centres.
  const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
  if (vn >= 0) return true; // already separating
  const j = (-(1 + RESTITUTION.body) * vn) / (1 / a.mass + 1 / b.mass);
  a.vx -= (j * nx) / a.mass;
  a.vy -= (j * ny) / a.mass;
  b.vx += (j * nx) / b.mass;
  b.vy += (j * ny) / b.mass;
  return true;
}

/** Advances the world by `dt` seconds (call with small steps, e.g. 1/240). */
export function step(world: World, dt: number) {
  const bodies = [...world.pins, world.ball];
  for (const b of bodies) {
    const keep = Math.pow(b === world.ball ? FRICTION.ball : FRICTION.pin, dt);
    b.vx *= keep;
    b.vy *= keep;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  for (let i = 0; i < bodies.length; i++)
    for (let j = i + 1; j < bodies.length; j++) collide(bodies[i], bodies[j]);
  for (const b of bodies) {
    walls(b, b === world.ball);
    if (Math.hypot(b.vx, b.vy) < STOP_SPEED) {
      b.vx = 0;
      b.vy = 0;
    }
  }
}

export const isMoving = (world: World) =>
  [...world.pins, world.ball].some((b) => b.vx !== 0 || b.vy !== 0);

/** Shoots a pin: `power` 0–1 of the fastest shot, along (dx, dy). */
export function shoot(pin: Body, dx: number, dy: number, power: number) {
  const len = Math.hypot(dx, dy) || 1;
  const speed = Math.max(0, Math.min(1, power)) * MAX_SHOT;
  pin.vx = (dx / len) * speed;
  pin.vy = (dy / len) * speed;
}
