import { PixelCanvas, fromRows, sprite, type Token } from "../pixel/canvas";

/**
 * Pixel art of the theater curtain (spec 900 US-2): an original scene in the
 * site's palette, after the mood of pixel-art theaters (closed velvet curtain,
 * swagged valance with gold fringe, brown wooden stage, dark blue seats). The
 * colours are balanced like a stage at night: red velvet above, brown wood in
 * the middle, blue-gray audience in front. Most pieces are small tiles that
 * the browser repeats, so the scene fits any screen.
 */

/**
 * Velvet ramp, dark → light: deep creases in `ink`, mostly dark reds, and a
 * thin `red-500` sheen, so the curtain stays red without flooding the screen.
 */
const VELVET: readonly Token[] = ["ink", "red-800", "red-700", "red-600", "red-500"];

/** Widths of the folds across one curtain tile: uneven, like real drapery. */
const FOLDS = [22, 17, 26, 19, 15, 21];
const CURTAIN_W = FOLDS.reduce((a, b) => a + b, 0);

/**
 * Velvet shade at position `t` (0–1) across one fold, lit from the left: a
 * deep crease at the edges, a broad lit crest just left of the middle and a
 * thin sheen on top. A checkered dither blends neighbouring shades.
 */
function fold(t: number, x: number, y: number): Token {
  const crest = Math.sin(Math.PI * t) * (1 - 0.35 * t);
  const level = 0.6 + crest * 2.5 + ((x + y) % 2 ? 0.22 : -0.22);
  if (Math.abs(t - 0.34) < 0.03) return VELVET[4];
  if (t < 0.04) return VELVET[0];
  return VELVET[Math.max(1, Math.min(3, Math.round(level)))];
}

/** The closed curtain's velvet folds (120 × 4), tileable both ways. */
function curtain() {
  const c = new PixelCanvas(CURTAIN_W, 4, { wrapX: true, wrapY: true });
  let start = 0;
  for (const width of FOLDS) {
    for (let i = 0; i < width; i++)
      for (let y = 0; y < 4; y++) c.set(start + i, y, fold(i / width, start + i, y));
    start += width;
  }
  return sprite(c);
}
export const CURTAIN = curtain();

/** The curtain's hem (24 × 7): a dark seam, a gold braid and tassels. */
function hem() {
  const c = new PixelCanvas(24, 7, { wrapX: true });
  for (let x = 0; x < 24; x++) {
    c.set(x, 0, "red-700").set(x, 1, "red-800");
    c.set(x, 2, x % 2 ? "gold-500" : "gold-600").set(x, 3, "gold-700");
  }
  for (let x = 1; x < 24; x += 3) {
    c.set(x, 4, "gold-600").set(x, 5, "gold-500");
    if (x % 2) c.set(x, 6, "gold-700");
  }
  return sprite(c);
}
export const HEM = hem();

/** One swag of the valance, in art pixels. */
const SWAG_W = 44;
const VALANCE_H = 30;

/**
 * The valance across the top (44 × 30): a gold rail, then a deep swag of
 * velvet hanging in a curve, with curved folds that follow its edge, trimmed
 * with a gold fringe and a big tassel where two swags meet. Below the swag
 * it is transparent, so the curtain shows through.
 */
function valance() {
  const c = new PixelCanvas(SWAG_W, VALANCE_H, { wrapX: true });
  const bands: Token[] = ["red-700", "red-600", "red-600", "red-500", "red-600", "red-700"];
  for (let x = 0; x < SWAG_W; x++) {
    const bottom = 12 + Math.round(11 * Math.sin((Math.PI * x) / SWAG_W));
    for (let y = 3; y < bottom; y++) {
      const depth = bottom - y;
      let token = depth <= 1 ? "red-800" : bands[(depth - 2) % bands.length];
      // The swag bunches up where it hangs from the rail: darker there.
      if (y < 6) token = y < 4 ? "red-800" : "red-700";
      c.set(x, y, token);
    }
    // The fringe along the edge of the swag.
    c.set(x, bottom, x % 2 ? "gold-500" : "gold-600").set(x, bottom + 1, "gold-700");
    if (x % 3 === 0) c.set(x, bottom + 2, "gold-600").set(x, bottom + 3, "gold-700");
  }
  // The rail, with a few bright studs.
  c.rect(0, 0, SWAG_W, 1, "gold-800").rect(0, 1, SWAG_W, 1, "gold-600").rect(0, 2, SWAG_W, 1, "gold-700");
  for (let x = 4; x < SWAG_W; x += 11) c.set(x, 1, "gold-400");
  // A tassel where two swags meet.
  c.stamp(
    [".kk.", "kggk", "kgok", ".kk.", "kggk", "goog", "gggg", "gogo", "g.g.", "d.d."],
    { k: "gold-800", g: "gold-600", o: "gold-400", d: "gold-700" },
    -2,
    11,
  );
  return sprite(c);
}
export const VALANCE = valance();

/** Size of the stage floor sprite, in art pixels. */
const FLOOR_W = 480;
const FLOOR_H = 40;

/**
 * The stage floor (480 × 40), seen from the seats: brown planks whose seams
 * run towards a vanishing point above the middle of the stage, in the
 * curtain's shadow at the back and lit towards the front. It is drawn once,
 * wide enough for big screens, and centred; the floor colour continues past
 * its edges.
 */
function floor() {
  const c = new PixelCanvas(FLOOR_W, FLOOR_H);
  const mid = FLOOR_W / 2;
  for (let y = 0; y < FLOOR_H; y++) {
    const token = y < 2 ? "wood-800" : y < 4 ? "wood-600" : "wood-500";
    c.rect(0, y, FLOOR_W, 1, token);
    // Seams: 14 px apart at the back, 30 px at the front.
    const gap = 14 + (16 * y) / (FLOOR_H - 1);
    for (let k = -18; k <= 18; k++) {
      const x = Math.round(mid + (k + 0.5) * gap);
      c.set(x, y, y < 4 ? "wood-900" : "wood-800");
    }
  }
  return sprite(c);
}
export const FLOOR = floor();

/**
 * The front edge of the stage (8 × 9), tileable: a lit orange lip, then a
 * striped wooden skirt with a dark scalloped hem, as in old theaters.
 */
function lip() {
  const c = new PixelCanvas(8, 9, { wrapX: true });
  c.rect(0, 0, 8, 1, "wood-300").rect(0, 1, 8, 1, "wood-400");
  for (let y = 2; y < 7; y++)
    for (let x = 0; x < 8; x++) c.set(x, y, x % 4 === 0 ? "wood-800" : x % 4 === 3 ? "wood-700" : "wood-600");
  c.rect(0, 7, 8, 1, "wood-800").rect(1, 8, 6, 1, "wood-800");
  return sprite(c);
}
export const LIP = lip();

/** Seat back size and the tile (two staggered rows), in art pixels. */
const SEAT_W = 22;
const SEAT_H = 12;
const SEATS_W = 24;
const SEATS_H = 20;

/** The shade of a rounded seat back at (x, y), its top-left corner at (0, 0). */
function seatShade(x: number, y: number): Token | undefined {
  if (x < 0 || x >= SEAT_W || y < 0 || y >= SEAT_H) return undefined;
  const fromMid = Math.abs(x + 0.5 - SEAT_W / 2) / (SEAT_W / 2);
  const top = Math.round(5 * (1 - Math.sqrt(Math.max(0, 1 - fromMid ** 2))));
  if (y < top) return undefined;
  // The rim of the seat back, catching the stage light in the middle.
  if (y === top) return Math.abs(x + 0.5 - SEAT_W / 2) < 4 ? "water-700" : "water-800";
  if (x === 0 || x === SEAT_W - 1) return "stone-800";
  if (y === top + 1) return "stone-800";
  return y >= SEAT_H - 3 ? "stone-900" : "water-900";
}

/**
 * Rows of dark blue seat backs seen from behind (24 × 20), each row half a
 * seat across from the one before and overlapping it like scales, so the
 * nearer row always hides the bottom of the row behind. Tileable both ways.
 */
function seats() {
  const c = new PixelCanvas(SEATS_W, SEATS_H, { wrapX: true, wrapY: true });
  c.rect(0, 0, SEATS_W, SEATS_H, "stone-900");
  // Row A starts at y = 0, row B half a tile lower and half a seat across.
  const rows: [number, number][] = [
    [1, 0],
    [1 + SEATS_W / 2, SEATS_H / 2],
  ];
  for (let y = 0; y < SEATS_H; y++)
    for (let x = 0; x < SEATS_W; x++) {
      // The front-most row covering this pixel wins: the one whose top is lowest.
      let best: { token: Token; top: number } | undefined;
      for (const [rx, ry] of rows)
        for (const dy of [0, SEATS_H])
          for (const dx of [0, -SEATS_W, SEATS_W]) {
            const top = ry - dy;
            const token = seatShade(x - rx - dx, y - top);
            if (token && (!best || top > best.top)) best = { token, top };
          }
      if (best) c.set(x, y, best.token);
    }
  return sprite(c);
}
export const SEATS = seats();

/** A pixel soccer ball (12 × 12): a centre pentagon and patches at the rim, shaded on its lower right. */
const BALL_CANVAS = fromRows(
  [
    "....kkkk....",
    "..kkkkkkkk..",
    ".kwwwkkwwwk.",
    ".kwwwwwwwsk.",
    "kwwwwkkwwwsk",
    "kkwwkkkkwwsk",
    "kkwwkkkkwssk",
    "kwwwwkkwwssk",
    ".kwwwwwwssk.",
    ".kkwwwwsskk.",
    "..kkkssskk..",
    "....kkkk....",
  ],
  { k: "ink", w: "paper-100", s: "stone-300" },
);
export const BALL = sprite(BALL_CANVAS);

/**
 * The crest at the centre of the valance (23 × 23): a gold medallion with a
 * bright rim, shaded on its lower right, with the match ball in the middle.
 */
function crest() {
  const c = new PixelCanvas(23, 23);
  c.ball(11, 11, 9.5, 9.5, ["gold-700", "gold-600", "gold-500", "gold-400"]);
  c.disc(11.5, 11.5, 7, "gold-700");
  c.disc(11.5, 11.5, 6.4, "red-700");
  c.draw(BALL_CANVAS, 6, 6);
  c.outline("gold-800");
  return sprite(c);
}
export const CREST = crest();
