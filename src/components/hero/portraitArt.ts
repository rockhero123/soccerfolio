import { PixelCanvas, sprite, type Token } from "../pixel/canvas";

/**
 * The hero portrait of Ricardo (spec 002 US-1) as a Stardew-style pixel bust:
 * short dark hair with a quiff that breaks out of the circle, strong brows (one
 * cocked), dark eyes, big ears, a moustache and a partial beard along the jaw,
 * a toothy smirk, and the yellow Colombia shirt with a round collar. A green
 * sunburst sits behind him; speed lines and smoke puffs show he is fast.
 */

/** The circle the portrait is clipped to, in art pixels. */
export const PORTRAIT_CIRCLE = { cx: 30, cy: 31, r: 20 } as const;

const W = 60;
const H = 56;

const SKIN = ["skin-700", "skin-600", "skin-500", "skin-400"];
/** The shirt: cartoon-yellow (`gold-600`) with a lighter lit side. */
const GOLD = ["gold-700", "gold-600", "gold-600", "gold-500"];
const HAIR = ["ink", "hair", "hair", "stone-800"];

const insideCircle = (x: number, y: number) => {
  const { cx, cy, r } = PORTRAIT_CIRCLE;
  return Math.hypot(x + 0.5 - cx, y + 0.5 - cy) <= r;
};

/** The sunburst, shirt, neck, head and face: everything clipped to the circle. */
function bust() {
  const c = new PixelCanvas(W, H);
  const { cx, cy } = PORTRAIT_CIRCLE;
  // Sunburst: 12 alternating wedges of green.
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const a = Math.atan2(y + 0.5 - cy, x + 0.5 - cx) + Math.PI;
      const wedge = Math.floor((a / (Math.PI * 2)) * 12) % 2;
      c.set(x, y, wedge ? "grass-400" : "grass-300");
    }
  // Speed lines streaking across the background.
  for (const [x, y, len] of [[11, 22, 7], [9, 26, 9], [12, 30, 5]])
    c.rect(x, y, len, 1, "paper-100");

  // Shirt: broad yellow shoulders with shading and a blue-and-red collar.
  c.ball(30, 53, 18, 10, GOLD);
  c.rect(12, 50, 36, 6, "gold-600");
  c.ball(30, 51, 15, 6, GOLD);
  for (let x = 22; x <= 38; x++) {
    const dip = Math.round(4 - ((x - 30) / 8) ** 2 * 4);
    c.set(x, 42 + dip, "water-700").set(x, 43 + dip, "red-600");
  }
  // Neck with a shadow under the jaw.
  c.rect(26, 37, 9, 7, "skin-500").rect(26, 37, 9, 2, "skin-700").rect(33, 39, 2, 5, "skin-600");
  for (let x = 23; x <= 37; x++) {
    const dip = Math.round(4 - ((x - 30) / 8) ** 2 * 4);
    for (let y = 44 + dip; y < 46 + dip; y++) c.set(x, y, "gold-500");
  }

  // Big ears.
  c.ball(19, 27, 2.5, 3.5, SKIN).ball(41, 27, 2.5, 3.5, SKIN);
  c.set(19, 27, "skin-700").set(19, 28, "skin-700").set(41, 27, "skin-700").set(41, 28, "skin-700");
  // Head: a broad, square-jawed face.
  c.ball(30, 26, 10, 12, SKIN);
  c.rect(21, 28, 19, 6, "skin-500");
  c.rect(21, 28, 2, 6, "skin-400").rect(37, 28, 3, 6, "skin-600");
  // Partial beard along the jaw: stubble dithered into the skin.
  for (let y = 27; y < 39; y++)
    for (let x = 18; x < 43; x++) {
      const skin = c.get(x, y)?.startsWith("skin");
      if (!skin) continue;
      const edge = [[-2, 0], [2, 0], [0, 2], [-1, 2], [1, 2]].some(
        ([dx, dy]) => !c.get(x + dx, y + dy)?.startsWith("skin"),
      );
      const jaw = y > 34 || (edge && y > 30);
      if (jaw) c.set(x, y, (x + y) % 3 === 0 ? "skin-700" : "hair");
    }
  return c;
}

/** Brows, eyes, nose, moustache and the toothy smirk. */
function face(c: PixelCanvas) {
  // Strong brows: the left one level and scowling, the right one cocked.
  c.rect(22, 21, 6, 2, "hair").set(27, 22, "hair").set(22, 20, "hair");
  c.rect(32, 20, 6, 2, "hair").set(32, 22, "hair").set(37, 19, "hair");
  // Eyes: white, dark iris with a pie-cut glint, a lid line above.
  for (const x of [23, 33]) {
    c.rect(x, 23, 4, 3, "paper-100");
    c.rect(x + 1, 23, 2, 3, "hair").set(x + 2, 23, "paper-100");
    c.rect(x, 22, 4, 1, "ink");
  }
  // Nose: a lit side and a shadow side.
  c.rect(30, 25, 1, 4, "skin-400").rect(31, 26, 1, 3, "skin-700").set(29, 29, "skin-700").set(32, 29, "skin-700");
  // Moustache.
  c.rect(25, 30, 11, 2, "hair").set(24, 31, "hair").set(36, 31, "hair").set(30, 30, "skin-700");
  // Smirk: clenched teeth, the right corner pulled up.
  c.rect(26, 32, 9, 3, "ink");
  c.rect(27, 33, 7, 1, "paper-100");
  c.set(29, 33, "stone-400").set(31, 33, "stone-400");
  c.rect(35, 31, 1, 2, "ink").set(36, 30, "ink");
  c.rect(28, 35, 4, 1, "skin-700");
}

/** Short dark hair with a quiff that breaks out above the circle. */
function hair(c: PixelCanvas) {
  c.ball(30, 14, 11, 5, HAIR);
  // Sideburns down to the ears, and a straight hairline above the brows.
  for (let y = 15; y < 24; y++) {
    c.rect(19, y, 2, 1, "hair").rect(40, y, 2, 1, "hair");
  }
  c.rect(20, 16, 21, 2, "hair");
  // The quiff: tufts sticking up and out.
  c.stamp(
    [
      "....k......k.....",
      "...kh.....khk....",
      "..khh...kkhhk..k.",
      ".khhhk.khhhhhkkhk",
      "khhhhhkhhhhhhhhhk",
    ],
    { k: "ink", h: "hair" },
    21,
    6,
  );
  // A highlight on the hair.
  c.rect(25, 11, 5, 1, "stone-700").rect(24, 12, 2, 1, "stone-700");
}

function portrait() {
  const inner = bust();
  face(inner);
  const c = new PixelCanvas(W, H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) if (insideCircle(x, y)) c.set(x, y, inner.get(x, y));
  // The frame: a dark ring with a light inner rim.
  const { cx, cy, r } = PORTRAIT_CIRCLE;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
      if (d > r && d <= r + 1.6) c.set(x, y, "wood-900");
      else if (d > r - 1 && d <= r) c.set(x, y, "paper-100");
    }
  const top = new PixelCanvas(W, H);
  hair(top);
  top.outline("ink");
  c.draw(top);

  // Excitement marks above his head.
  for (const [x0, y0, x1, y1] of [[12, 6, 15, 9], [10, 13, 13, 14], [48, 6, 45, 9], [50, 13, 47, 14]] as const)
    c.line(x0, y0, x1, y1, "ink");
  // Smoke puffs bursting out at the bottom of the circle.
  const smoke = new PixelCanvas(W, H);
  const puffs: [number, number, number][] = [
    [8, 49, 4], [14, 52, 3.5], [5, 44, 2.5], [2, 52, 2],
    [52, 49, 4], [46, 52, 3.5], [55, 44, 2.5], [58, 52, 2],
  ];
  const ramp: Token[] = ["stone-400", "stone-300", "stone-200", "paper-100"];
  for (const [x, y, r] of puffs) smoke.ball(x, y, r, r * 0.85, ramp);
  smoke.outline("stone-600");
  c.draw(smoke);
  return c;
}

/** The finished portrait sprite. */
export const PORTRAIT = sprite(portrait());

/** The highest row of hair pixels (the top of the quiff), in art pixels. */
export const HAIR_TOP = 6;
