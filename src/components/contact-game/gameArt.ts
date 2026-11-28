import { PixelCanvas, rng, type Clump, type Token } from "../pixel/canvas";
import { LEAF } from "../pixel/nature";
import { BALL_R, GOAL_W, PIN_R, PITCH, type Team } from "./physics";

/**
 * Pixel art of the contact game (spec 900 US-3), as token-coloured pixel
 * canvases: the vertical pitch with its goals, the round grass pins with a
 * team ring, the ball and the turn ring. The game draws them on a <canvas>.
 */

/** Margins around the pitch, in art pixels: room for the goals and nets. */
export const MARGIN = { x: 6, y: 14 } as const;
export const ART = { w: PITCH.w + MARGIN.x * 2, h: PITCH.h + MARGIN.y * 2 } as const;

const CHALK = "paper-100";

/** The vertical pitch: striped lawn, chalk lines, goals with nets. */
function pitch() {
  const c = new PixelCanvas(ART.w, ART.h);
  const rand = rng(91);
  const { x: mx, y: my } = MARGIN;
  // Dark grass around the pitch, speckled.
  c.rect(0, 0, ART.w, ART.h, "grass-800");
  for (let i = 0; i < 260; i++)
    c.set(Math.floor(rand() * ART.w), Math.floor(rand() * ART.h), rand() > 0.5 ? "grass-700" : "grass-900");
  // The lawn: mowing stripes across the pitch, speckled blades.
  for (let y = 0; y < PITCH.h; y++) {
    const stripe = Math.floor(y / 19) % 2 ? "grass-500" : "grass-600";
    c.rect(mx, my + y, PITCH.w, 1, stripe);
  }
  for (let i = 0; i < 520; i++) {
    const x = mx + Math.floor(rand() * PITCH.w);
    const y = my + Math.floor(rand() * PITCH.h);
    c.set(x, y, c.get(x, y) === "grass-500" ? "grass-400" : "grass-700");
  }
  // Goals: a net behind each goal line, with posts and a crossbar.
  const gx = mx + PITCH.w / 2 - GOAL_W / 2;
  for (const [top, dir] of [
    [my - 11, 1],
    [my + PITCH.h + 1, -1],
  ] as const) {
    c.rect(gx, top, GOAL_W, 10, "stone-800");
    for (let x = 0; x < GOAL_W; x += 3) c.rect(gx + x, top, 1, 10, "stone-400");
    for (let y = 0; y < 10; y += 3) c.rect(gx, top + y, GOAL_W, 1, "stone-400");
    // The back bar of the net, then the posts.
    c.rect(gx, dir === 1 ? top : top + 9, GOAL_W, 1, CHALK);
    c.rect(gx - 1, top, 1, 10, CHALK).rect(gx + GOAL_W, top, 1, 10, CHALK);
  }
  // Chalk lines, just outside the playing area so pieces sit inside them.
  const line = (x: number, y: number, w: number, h: number) => c.rect(mx + x, my + y, w, h, CHALK);
  line(-1, -1, PITCH.w + 2, 1);
  line(-1, PITCH.h, PITCH.w + 2, 1);
  line(-1, -1, 1, PITCH.h + 2);
  line(PITCH.w, -1, 1, PITCH.h + 2);
  line(0, Math.floor(PITCH.h / 2), PITCH.w, 1);
  // Penalty boxes and goal boxes at both ends.
  for (const top of [true, false]) {
    const box = (w: number, d: number) => {
      const x = PITCH.w / 2 - w / 2;
      const y = top ? 0 : PITCH.h - d;
      line(x, top ? d : y, w, 1);
      line(x, y, 1, d);
      line(x + w - 1, y, 1, d);
    };
    box(64, 28);
    box(36, 11);
    c.set(mx + PITCH.w / 2, my + (top ? 20 : PITCH.h - 21), CHALK);
  }
  // Centre circle and spot.
  const cx = mx + PITCH.w / 2;
  const cy = my + Math.floor(PITCH.h / 2);
  for (let a = 0; a < Math.PI * 2; a += 0.02)
    c.set(Math.round(cx + Math.cos(a) * 18), Math.round(cy + Math.sin(a) * 18), CHALK);
  c.rect(cx - 1, cy - 1, 2, 2, CHALK);
  return c;
}
export const PITCH_ART = pitch();

/** Team rings, dark → light. */
const RING: Record<Team, readonly Token[]> = {
  visitor: ["grass-800", "grass-600", "grass-300", "grass-200"],
  machine: ["red-800", "red-700", "red-600", "red-400"],
};

/**
 * A round pin, lit from the top left, with a dark outline. The visitor's pins
 * are grass inside a thick green ring; the machine's pins are red all over.
 */
function pin(team: Team) {
  const size = PIN_R * 2 + 1;
  const c = new PixelCanvas(size, size);
  const rand = rng(team === "visitor" ? 5 : 9);
  const [dark, mid, light, shine] = RING[team];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const dx = x - PIN_R;
      const dy = y - PIN_R;
      const d = Math.hypot(dx, dy);
      if (d > PIN_R + 0.4) continue;
      const lit = -dx - dy;
      if (d > PIN_R - 0.6) c.set(x, y, "ink");
      else if (team === "machine" || d > PIN_R - 2.6) {
        // The ring (and the whole red pin): lit on the top left, shaded on the bottom right.
        c.set(x, y, lit > 4 ? shine : lit > -2 ? light : lit > -6 ? mid : dark);
      } else {
        // The grass inside: mowing stripes, lit at the top, and a few blades.
        const stripe = Math.floor((y + 1) / 3) % 2 ? "grass-500" : "grass-400";
        const blade = rand() > 0.9;
        c.set(x, y, blade ? (stripe === "grass-400" ? "grass-300" : "grass-600") : stripe);
      }
    }
  return c;
}
export const PIN_ART: Record<Team, PixelCanvas> = { visitor: pin("visitor"), machine: pin("machine") };

/** A ring drawn around the pins of the side whose turn it is. */
function turnRing(token: Token) {
  const R = PIN_R + 2;
  const size = R * 2 + 1;
  const c = new PixelCanvas(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - R, y - R);
      if (d > R - 0.7 && d <= R + 0.3) c.set(x, y, token);
    }
  return c;
}
export const TURN_RING = { visitor: turnRing("gold-400"), machine: turnRing("red-400") };

/** The ball (7 × 7): white with dark patches, shaded on its lower right. */
export const BALL_ART = (() => {
  const rows = [".kkkkk.", "kwwkwwk", "kwkkkws", "kwwkwss", "kkwwwsk", "kwwkssk", ".kkkkk."];
  const c = new PixelCanvas(BALL_R * 2 + 1, BALL_R * 2 + 1);
  return c.stamp(rows, { k: "ink", w: "paper-100", s: "stone-300" });
})();

/**
 * The CONTACT button's gold ingot (78 × 27): a bevelled bar seen slightly
 * from above, lit from the top left with a couple of glints, framed by shaded
 * leaves along its foot and up its ends. The word is real text on top. At
 * 4 px per art pixel the gold bar is the size of a section title banner.
 */
export const INGOT = { w: 78, h: 27 } as const;
/** The ingot's front face, where the label sits (art pixels). */
export const INGOT_FACE = { top: 6, bottom: 23 } as const;

export function ingot() {
  const { w, h } = INGOT;
  const c = new PixelCanvas(w, h);
  const left = 5;
  const right = w - 6;
  // Top face: a trapezoid narrowing to the back.
  for (let y = 1; y < INGOT_FACE.top; y++) {
    const inset = INGOT_FACE.top - y;
    for (let x = left + inset * 1.4; x <= right - inset * 1.4; x++)
      c.set(Math.round(x), y, (Math.round(x) + y) % 5 === 0 ? "gold-500" : "gold-400");
  }
  // Front face, with a lit top band and shaded bottom, darker on the right.
  for (let y = INGOT_FACE.top; y < INGOT_FACE.bottom; y++)
    for (let x = left; x <= right; x++) {
      let token = "gold-600";
      if (y === INGOT_FACE.top) token = "gold-400";
      else if (y === INGOT_FACE.top + 1) token = "gold-500";
      else if (y >= INGOT_FACE.bottom - 2) token = "gold-700";
      if (x >= right - 1 && y > INGOT_FACE.top) token = "gold-700";
      c.set(x, y, token);
    }
  // Glints.
  c.set(left + 8, 3, "paper-100").set(left + 9, 3, "paper-100").set(left + 8, 4, "paper-100");
  c.set(right - 12, INGOT_FACE.top + 1, "paper-100");
  c.outline("gold-800");

  // Leaves along the foot and up both ends.
  const leaves = new PixelCanvas(w, h);
  const rand = rng(33);
  const clumps: Clump[] = [];
  for (let x = 4; x < w - 3; x += 5 + Math.floor(rand() * 3))
    clumps.push({ x, y: h - 3 + rand(), r: 1.9 + rand() * 0.6 });
  for (const x of [2.5, w - 3.5])
    for (let y = 6; y < h - 3; y += 4) clumps.push({ x: x + (rand() - 0.5), y, r: 1.8 + rand() * 0.5 });
  clumps.push({ x: left + 4, y: 1.5, r: 1.6 }, { x: right - 4, y: 1.5, r: 1.6 });
  leaves.clumps(clumps, LEAF, 34);
  // A few tiny flowers in the leaves.
  for (const [x, y] of [[8, h - 3], [Math.round(w / 2), h - 2], [w - 11, h - 3]] as const)
    leaves.set(x, y, "pink-300").set(x + 1, y, "gold-400");
  leaves.outline("leaf-900");
  return c.draw(leaves);
}
