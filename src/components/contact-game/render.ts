import type { PixelCanvas } from "../pixel/canvas";
import type { GameEngine } from "./engine";
import { ART, BALL_ART, MARGIN, PIN_ART, PITCH_ART, TURN_RING } from "./gameArt";
import type { Team } from "./physics";

/**
 * Draws the contact game on a <canvas> (spec 900 US-3): the pixel art is
 * rendered once into off-screen canvases at `SCALE` screen pixels per art
 * pixel, then each frame places the pieces on whole art pixels, so the game
 * stays crisp pixel art while the physics run smoothly underneath.
 */

/** Canvas pixels per art pixel. */
export const SCALE = 5;

/** Resolves a design token to a CSS colour (tokens only, no raw hex). */
export type Palette = (token: string) => string;

export function makePalette(root: Element): Palette {
  const styles = getComputedStyle(root);
  const cache = new Map<string, string>();
  return (token) => {
    let value = cache.get(token);
    if (value === undefined) {
      value = styles.getPropertyValue(`--color-${token}`).trim();
      cache.set(token, value);
    }
    return value;
  };
}

function bake(art: PixelCanvas, color: Palette): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = art.width * SCALE;
  out.height = art.height * SCALE;
  const ctx = out.getContext("2d");
  if (!ctx) return out;
  for (let y = 0; y < art.height; y++)
    for (let x = 0; x < art.width; x++) {
      const token = art.get(x, y);
      if (!token) continue;
      ctx.fillStyle = color(token);
      ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
    }
  return out;
}

export type Baked = {
  pitch: HTMLCanvasElement;
  pins: Record<Team, HTMLCanvasElement>;
  rings: Record<Team, HTMLCanvasElement>;
  ball: HTMLCanvasElement;
};

export function bakeArt(color: Palette): Baked {
  return {
    pitch: bake(PITCH_ART, color),
    pins: { visitor: bake(PIN_ART.visitor, color), machine: bake(PIN_ART.machine, color) },
    rings: { visitor: bake(TURN_RING.visitor, color), machine: bake(TURN_RING.machine, color) },
    ball: bake(BALL_ART, color),
  };
}

/** Screen position of an art-pixel sprite centred on (x, y) in pitch coordinates. */
const at = (x: number, y: number, half: number) => [
  (Math.round(x) + MARGIN.x - half) * SCALE,
  (Math.round(y) + MARGIN.y - half) * SCALE,
];

/** The aiming arrow: a chunky pixel line with a head, its length the power. */
function arrow(ctx: CanvasRenderingContext2D, engine: GameEngine, color: Palette) {
  const { aim } = engine;
  if (!aim) return;
  const { pin, dx, dy, power } = aim;
  const len = 4 + power * 34;
  const tip = pin.r + 2 + len;
  const fill = color(pin.team === "visitor" ? "gold-400" : "red-400");
  const edge = color("ink");
  const dot = (d: number, size: number, style: string) => {
    const [x, y] = at(pin.x + dx * d, pin.y + dy * d, 0);
    ctx.fillStyle = style;
    ctx.fillRect(x - (size * SCALE) / 2, y - (size * SCALE) / 2, size * SCALE, size * SCALE);
  };
  for (let d = pin.r + 2; d <= tip; d += 1) dot(d, 4, edge);
  for (let d = pin.r + 2; d <= tip; d += 1) dot(d, 2, fill);
  // The head: a small triangle of pixels across the end.
  const px = -dy;
  const py = dx;
  for (let k = -4; k <= 4; k++) {
    const back = Math.abs(k) * 1.2;
    const [x, y] = at(pin.x + dx * (tip - back) + px * k, pin.y + dy * (tip - back) + py * k, 0);
    ctx.fillStyle = edge;
    ctx.fillRect(x - SCALE * 1.5, y - SCALE * 1.5, SCALE * 3, SCALE * 3);
    ctx.fillStyle = fill;
    ctx.fillRect(x - SCALE, y - SCALE, SCALE * 2, SCALE * 2);
  }
}

/** Draws one frame. `time` (seconds) makes the turn rings blink. */
export function drawGame(
  ctx: CanvasRenderingContext2D,
  engine: GameEngine,
  art: Baked,
  color: Palette,
  font: string,
  time: number,
) {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(art.pitch, 0, 0);

  // The ball's trail: fading chalk pixels.
  engine.trail.forEach((p, i) => {
    const [x, y] = at(p.x, p.y, 1);
    ctx.globalAlpha = ((i + 1) / engine.trail.length) * 0.45;
    ctx.fillStyle = color("paper-100");
    ctx.fillRect(x, y, SCALE * 3, SCALE * 3);
  });
  ctx.globalAlpha = 1;

  const { pins, ball } = engine.world;
  // Turn rings: the visitor's whole team blinks on their turn; the machine's aiming pin glows.
  const blink = Math.floor(time * 2.5) % 2 === 0;
  for (const pin of pins) {
    const mine =
      (engine.phase === "visitor" && pin.team === "visitor" && (blink || engine.aim?.pin === pin)) ||
      (engine.phase === "machine-aim" && engine.aim?.pin === pin);
    if (mine) {
      const [x, y] = at(pin.x, pin.y, pin.r + 2);
      ctx.drawImage(art.rings[pin.team!], x, y);
    }
  }
  for (const pin of pins) {
    const [x, y] = at(pin.x, pin.y, pin.r);
    ctx.drawImage(art.pins[pin.team!], x, y);
  }
  {
    const [x, y] = at(ball.x, ball.y, ball.r);
    ctx.drawImage(art.ball, x, y);
  }
  arrow(ctx, engine, color);

  // Names under the pins, small, in chalk with a dark edge.
  ctx.font = `${Math.round(SCALE * 3.4)}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";
  ctx.lineWidth = SCALE * 0.9;
  ctx.strokeStyle = color("ink");
  ctx.fillStyle = color("paper-100");
  for (const pin of pins) {
    const x = (pin.x + MARGIN.x) * SCALE;
    const y = (pin.y + MARGIN.y + pin.r + 1) * SCALE;
    ctx.strokeText(pin.name!, x, y);
    ctx.fillText(pin.name!, x, y);
  }
}

export const CANVAS = { w: ART.w * SCALE, h: ART.h * SCALE } as const;

/** Converts a pointer position on the canvas element to pitch coordinates. */
export function toPitch(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * ART.w - MARGIN.x,
    y: ((clientY - rect.top) / rect.height) * ART.h - MARGIN.y,
  };
}
