import { PixelCanvas, sprite, type Token } from "../pixel/canvas";
import { LEAF } from "../pixel/nature";
import { cheeks, eye, eyes, grin, smile } from "./face";

/**
 * The sixteen forest characters (spec 001 US-4) as original pixel art: each
 * body is built from shaded shapes lit from the top left, outlined in dark
 * wood, and then given an exaggerated face (big pie-cut eyes, brows, grins).
 */

const OUTLINE: Token = "wood-900";

const WOOD = ["wood-800", "wood-700", "wood-600", "wood-500", "wood-400"];
const RED = ["red-800", "red-700", "red-600", "red-500", "red-400"];
const GOLD = ["gold-800", "gold-700", "gold-600", "gold-500", "gold-400"];
const PAPER = ["paper-500", "paper-400", "paper-300", "paper-200", "paper-100"];
const GREEN = ["leaf-700", "leaf-600", "leaf-500", "leaf-400", "leaf-300", "leaf-200"];
const LIGHT_WOOD = ["wood-500", "wood-400", "wood-300", "wood-200"];
const WING = ["water-400", "water-300", "water-200", "paper-100"];
const DARK = ["ink", "stone-900", "stone-800", "stone-700"];

/** Builds a character: `body` paints the shapes, then the outline, then `face`. */
function character(
  width: number,
  height: number,
  body: (c: PixelCanvas) => void,
  face: (c: PixelCanvas) => void,
) {
  const c = new PixelCanvas(width, height);
  body(c);
  c.outline(OUTLINE);
  face(c);
  return sprite(c);
}

/** A stern, wise old owl with ear tufts and enormous ringed eyes. */
const owl = character(
  22,
  26,
  (c) => {
    c.stamp(["k.....", "kk....", "kkk..."], { k: "wood-600" }, 3, 1);
    c.stamp([".....k", "....kk", "...kkk"], { k: "wood-700" }, 13, 1);
    c.ball(11, 14, 8.5, 10, WOOD);
    c.ball(11, 18, 5, 5.5, PAPER);
    for (const [x, y] of [[8, 16], [12, 16], [10, 19], [14, 19], [8, 21], [12, 21]])
      c.set(x, y, "wood-500").set(x + 1, y + 1, "wood-500");
    c.ball(7, 10, 3.5, 3.5, GOLD).ball(15, 10, 3.5, 3.5, GOLD);
    c.rect(7, 24, 3, 1, "gold-600").rect(13, 24, 3, 1, "gold-600");
  },
  (c) => {
    eye(c, 5, 8, { w: 4, h: 4, brow: "angry", side: "left" });
    eye(c, 13, 8, { w: 4, h: 4, brow: "angry", side: "right" });
    c.stamp(["oo", "oo", ".o"], { o: "gold-700" }, 10, 13);
  },
);

/** A round red bird with a huge, worried pair of eyes. */
const bird = character(
  24,
  19,
  (c) => {
    c.stamp(["k...", "kk..", "kkk.", ".kkk"], { k: "red-700" }, 0, 6);
    c.ball(11, 10, 8, 7, RED);
    c.ball(12, 13, 4.5, 3.5, PAPER);
    c.ball(7, 11, 3.5, 2.5, ["red-800", "red-700", "red-600"]);
    c.stamp(["oo..", "oooo", "oo.."], { o: "gold-600" }, 19, 9);
    c.rect(9, 17, 1, 2, "gold-700").rect(13, 17, 1, 2, "gold-700");
  },
  (c) => {
    eyes(c, 9, 5, 1, { w: 4, h: 5, look: 1, brow: "worried" });
    cheeks(c, 8, 17, 11);
  },
);

/** A plump, grinning bumblebee with glassy wings. */
const bee = character(
  24,
  19,
  (c) => {
    c.ball(8, 4, 3.5, 3, WING).ball(14, 3, 3.5, 3, WING);
    c.ball(12, 12, 9, 6, GOLD);
    for (const x of [13, 14, 18, 19])
      for (let y = 5; y < 19; y++) c.tint(x, y, y > 13 ? "ink" : "stone-900");
    c.set(22, 12, "ink").set(23, 12, "ink");
    c.line(6, 7, 4, 2, "ink").line(10, 7, 10, 2, "ink");
  },
  (c) => {
    eye(c, 4, 9, { w: 3, h: 4 });
    eye(c, 9, 9, { w: 3, h: 4 });
    grin(c, 4, 14, 7);
  },
);

/** A long caterpillar with a toothy, cheeky grin. */
const caterpillar = character(
  31,
  17,
  (c) => {
    for (const x of [4, 9, 14, 19]) {
      c.ball(x, 11, 3.5, 3.5, GREEN);
      c.set(x - 1, 15, "ink").set(x + 1, 15, "ink");
    }
    c.ball(25, 8, 5, 5.5, GREEN);
    c.line(22, 3, 20, 0, "ink").line(28, 3, 30, 0, "ink");
    c.set(20, 0, "red-500").set(30, 0, "red-500");
  },
  (c) => {
    eyes(c, 21, 5, 1, { w: 3, h: 4, look: 1 });
    grin(c, 22, 10, 6);
  },
);

/** A sweet little acorn with a cross-hatched cap. */
const acorn = character(
  16,
  23,
  (c) => {
    c.rect(7, 0, 2, 3, "wood-700");
    c.ball(8, 6, 7, 3.5, WOOD);
    for (let y = 3; y < 10; y++)
      for (let x = 1; x < 16; x++) if ((x + y) % 3 === 0) c.tint(x, y, "wood-800");
    c.ball(8, 14, 5.5, 7, ["wood-700", "wood-500", "wood-400", "gold-600", "gold-500"]);
  },
  (c) => {
    eye(c, 3, 11, { w: 3, h: 4 });
    eye(c, 10, 11, { w: 3, h: 4 });
    smile(c, 6, 17, 4);
    cheeks(c, 2, 12, 16);
  },
);

/** A red-capped toadstool with white spots and a big grin on its stem. */
const mushroom = character(
  22,
  25,
  (c) => {
    c.ball(11, 17, 5, 6.5, PAPER);
    c.ball(11, 9, 10, 7.5, RED);
    for (let y = 12; y < 18; y++) for (let x = 0; x < 22; x++) if (x < 6 || x > 16) c.set(x, y, undefined);
    c.rect(2, 12, 18, 1, "paper-400").rect(3, 13, 16, 1, "paper-500");
    c.disc(6, 6, 1.5, "paper-100").disc(14, 4, 2, "paper-100").disc(10, 9, 1, "paper-200").disc(17, 9, 1.2, "paper-200");
  },
  (c) => {
    eye(c, 7, 15, { w: 3, h: 4 });
    eye(c, 12, 15, { w: 3, h: 4 });
    grin(c, 8, 20, 6);
  },
);

/** A daisy with a face in its golden heart. */
const daisy = character(
  22,
  31,
  (c) => {
    c.rect(10, 15, 2, 15, "leaf-600").rect(10, 15, 1, 15, "leaf-500");
    c.ball(6, 23, 4, 1.8, LEAF).ball(16, 20, 4, 1.8, LEAF);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      c.ball(11 + Math.cos(a) * 6.5, 9 + Math.sin(a) * 6.5, 2.6, 2.6, PAPER);
    }
    c.ball(11, 9, 5, 5, GOLD);
  },
  (c) => {
    eye(c, 7, 6, { w: 3, h: 3 });
    eye(c, 12, 6, { w: 3, h: 3 });
    smile(c, 9, 11, 4);
  },
);

/** A dreamy snail with eyes on stalks and a spiral shell. */
const snail = character(
  28,
  19,
  (c) => {
    c.ball(13, 15, 12, 2.8, PAPER);
    c.ball(5, 10, 4.5, 5.5, PAPER);
    c.line(3, 5, 2, 2, "paper-400").line(7, 5, 8, 2, "paper-400");
    c.ball(17, 8, 8, 7.5, ["violet-800", "violet-600", "violet-400", "pink-300"]);
    for (let y = 0; y < 19; y++)
      for (let x = 9; x < 26; x++) {
        const d = Math.hypot(x + 0.5 - 17.5, y + 0.5 - 8.5);
        const a = Math.atan2(y + 0.5 - 8.5, x + 0.5 - 17.5);
        // An Archimedean spiral line across the shell.
        const s = (d - (a + Math.PI) * 0.9) % 5.6;
        if (s > 0 && s < 1.1 && d < 7.5) c.tint(x, y, "violet-800");
      }
  },
  (c) => {
    eye(c, 0, 0, { w: 3, h: 3 });
    eye(c, 7, 0, { w: 3, h: 3 });
    smile(c, 3, 12, 4);
    c.set(2, 10, "pink-500").set(8, 10, "pink-500");
  },
);

/** A wide-mouthed frog with eyes on top of its head. */
const frog = character(
  26,
  21,
  (c) => {
    c.ball(13, 13, 11, 7, GREEN);
    c.ball(7, 6, 4, 4, GREEN).ball(19, 6, 4, 4, GREEN);
    c.ball(13, 16, 6, 3.5, ["leaf-400", "leaf-300", "leaf-200", "gold-400"]);
    c.ball(3, 18, 3, 2, GREEN).ball(23, 18, 3, 2, GREEN);
  },
  (c) => {
    eye(c, 5, 4, { w: 4, h: 4, look: -1 });
    eye(c, 17, 4, { w: 4, h: 4, look: 1 });
    grin(c, 6, 11, 14);
    cheeks(c, 3, 21, 12);
  },
);

/** A seedling: a round green bulb with two leaves on top. */
const sprout = character(
  18,
  27,
  (c) => {
    c.rect(8, 4, 2, 8, "leaf-600");
    c.ball(5, 4, 4, 2.5, LEAF).ball(13, 3, 4, 2.5, LEAF);
    c.ball(9, 17, 7, 7.5, GREEN);
    c.set(5, 25, "wood-700").set(12, 25, "wood-700").set(4, 26, "wood-700").set(13, 26, "wood-700");
  },
  (c) => {
    eye(c, 4, 14, { w: 3, h: 4 });
    eye(c, 11, 14, { w: 3, h: 4 });
    smile(c, 7, 20, 4);
    cheeks(c, 3, 13, 19);
  },
);

/** An old tree with a scowling face in its trunk and branch arms. */
const faceTree = character(
  36,
  58,
  (c) => {
    c.stroke(10, 33, 2, 26, 1, "wood-600").stroke(26, 35, 34, 29, 1, "wood-600");
    for (let y = 18; y < 54; y++)
      for (let x = 9; x < 27; x++) {
        const share = (x - 9) / 18;
        c.set(x, y, share < 0.2 ? "wood-400" : share < 0.55 ? "wood-500" : share < 0.85 ? "wood-600" : "wood-700");
        if ((x * 7 + y * 3) % 11 === 0) c.set(x, y, "wood-700");
      }
    c.stamp(["rr..............rr", "rrrr..........rrrr"], { r: "wood-600" }, 9, 54);
    c.clumps(
      [
        { x: 9, y: 11, r: 7 },
        { x: 27, y: 11, r: 7 },
        { x: 18, y: 7, r: 9 },
        { x: 13, y: 16, r: 6 },
        { x: 24, y: 17, r: 6 },
      ],
      LEAF,
      77,
    );
    c.ball(23, 46, 2, 2.5, ["wood-900", "wood-800", "wood-700"]);
  },
  (c) => {
    eye(c, 12, 27, { w: 5, h: 6, brow: "angry", side: "left" });
    eye(c, 19, 27, { w: 5, h: 6, brow: "angry", side: "right" });
    grin(c, 12, 37, 12);
  },
);

/** A prickly hedgehog with a long pointy snout. */
const hedgehog = character(
  27,
  17,
  (c) => {
    c.ball(15, 10, 11, 6.5, WOOD);
    for (let x = 6; x < 26; x += 2) {
      const top = 10 - Math.round(Math.sqrt(Math.max(0, 1 - ((x - 15) / 11) ** 2)) * 6.5);
      c.set(x, top - 1, "wood-700").set(x + 1, top - 2, "wood-800");
    }
    for (let y = 4; y < 16; y++) for (let x = 6; x < 26; x++) if ((x + y * 2) % 5 === 0) c.tint(x, y, "wood-800");
    c.ball(5, 12, 4.5, 3.5, PAPER);
    c.set(8, 16, "wood-800").set(20, 16, "wood-800");
  },
  (c) => {
    c.rect(0, 11, 2, 2, "ink");
    eye(c, 5, 8, { w: 3, h: 3, look: -1 });
    smile(c, 2, 14, 3);
  },
);

/** A shy pinecone with a sprig of needles. */
const pinecone = character(
  16,
  25,
  (c) => {
    c.ball(8, 14, 6, 9, WOOD);
    for (let y = 6; y < 24; y++)
      for (let x = 1; x < 16; x++) {
        const row = Math.floor(y / 3);
        if (y % 3 === 2) c.tint(x, y, "wood-800");
        else if ((x + row * 2) % 4 === 0) c.tint(x, y, "wood-800");
        else if (y % 3 === 0 && (x + row * 2) % 4 === 1) c.tint(x, y, "wood-400");
      }
    c.stamp([".g.g.", "g.g.g", ".ggg.", "..g.."], { g: "leaf-500" }, 6, 0);
  },
  (c) => {
    eye(c, 3, 10, { w: 3, h: 4, brow: "worried", side: "left" });
    eye(c, 10, 10, { w: 3, h: 4, brow: "worried", side: "right" });
    smile(c, 6, 16, 4);
  },
);

/** A grumpy tree stump with rings on top and a sprout on the side. */
const stump = character(
  28,
  23,
  (c) => {
    for (let y = 5; y < 19; y++)
      for (let x = 2; x < 26; x++) {
        const share = (x - 2) / 24;
        c.set(x, y, share < 0.2 ? "wood-400" : share < 0.6 ? "wood-500" : share < 0.85 ? "wood-600" : "wood-700");
        if (x % 5 === 0 && (y + x) % 3 !== 0) c.set(x, y, "wood-700");
      }
    c.stamp(["rr....................rr", "rrrr................rrrr"], { r: "wood-600" }, 2, 19);
    c.ball(14, 5, 12, 3.8, LIGHT_WOOD);
    for (const [rx, ry] of [[8, 2.5], [4.5, 1.5]])
      for (let x = 0; x < 28; x++)
        for (let y = 0; y < 10; y++) {
          const d = ((x + 0.5 - 14.5) / rx) ** 2 + ((y + 0.5 - 5.5) / ry) ** 2;
          if (d > 0.8 && d < 1.2) c.tint(x, y, "wood-500");
        }
    c.stamp([".g.", "ggg", ".g."], { g: "leaf-400" }, 22, 0);
  },
  (c) => {
    eye(c, 7, 10, { w: 4, h: 4, brow: "angry", side: "left" });
    eye(c, 17, 10, { w: 4, h: 4, brow: "angry", side: "right" });
    grin(c, 9, 15, 10);
  },
);

/** A snappy red tulip with a toothy grin. */
const tulip = character(
  18,
  35,
  (c) => {
    c.rect(8, 15, 2, 18, "leaf-600").rect(8, 15, 1, 18, "leaf-500");
    c.ball(4, 25, 3.5, 6, LEAF).ball(14, 23, 3.5, 6, LEAF);
    c.ball(9, 9, 7.5, 7, RED);
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 18; x++) {
        const nearPoint = [3, 9, 15].some((p) => Math.abs(x - p) <= y * 0.9);
        if (!nearPoint) c.set(x, y, undefined);
      }
  },
  (c) => {
    eye(c, 4, 6, { w: 3, h: 4, brow: "angry", side: "left" });
    eye(c, 11, 6, { w: 3, h: 4, brow: "angry", side: "right" });
    grin(c, 5, 11, 8);
  },
);

/** A shiny ladybug peeking out with big white eyes. */
const ladybug = character(
  23,
  17,
  (c) => {
    c.ball(13, 8, 9, 7, RED);
    for (let y = 1; y < 16; y++) c.tint(13, y, "ink");
    for (const [x, y] of [[9, 5], [17, 5], [9, 11], [17, 11]]) c.disc(x, y, 1.4, "ink");
    c.ball(4, 9, 4, 4.5, DARK);
    for (const x of [8, 13, 18]) c.set(x, 16, "ink");
  },
  (c) => {
    eye(c, 0, 6, { w: 3, h: 3, look: -1 });
    eye(c, 5, 6, { w: 3, h: 3, look: -1 });
    c.rect(2, 11, 3, 1, "pink-500");
  },
);

export const CHARACTERS = {
  owl,
  bird,
  bee,
  caterpillar,
  acorn,
  mushroom,
  daisy,
  snail,
  frog,
  sprout,
  "face-tree": faceTree,
  hedgehog,
  pinecone,
  stump,
  tulip,
  ladybug,
} as const;

export type CharacterName = keyof typeof CHARACTERS;
