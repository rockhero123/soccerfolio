import { fromRows, sprite } from "../pixel/canvas";

/** A four-point magic sparkle (7 × 7). */
export const SPARKLE = sprite(
  fromRows(
    ["...g...", "...g...", "..gwg..", "ggwWwgg", "..gwg..", "...g...", "...g..."],
    { g: "gold-500", w: "gold-400", W: "paper-100" },
  ),
);

/** A small sparkle (5 × 5). */
export const SPARKLE_SMALL = sprite(
  fromRows(["..g..", ".gwg.", "gwWwg", ".gwg.", "..g.."], {
    g: "gold-500",
    w: "gold-400",
    W: "paper-100",
  }),
);

/** The gold crest with a red gem at the top of the mirror (17 × 8). */
export const CREST = sprite(
  fromRows(
    [
      ".......kkk.......",
      "......kgGgk......",
      "..kk.kgrRrgk.kk..",
      ".kgGkgrRRrrgkGgk.",
      "kgGggkgrrrgkgggrk",
      ".kggggkgggkgggk..",
      "..kkkkkkkkkkkkk..",
      ".................",
    ],
    { k: "gold-800", g: "gold-600", G: "gold-400", r: "red-600", R: "red-400" },
  ),
);

/** A gold corner stud with a little gem (5 × 5). */
export const STUD = sprite(
  fromRows([".kkk.", "kgGgk", "kGrgk", "kgggk", ".kkk."], {
    k: "gold-800",
    g: "gold-600",
    G: "gold-400",
    r: "water-500",
  }),
);

/** Painted shine on the glass: two stepped diagonal streaks (16 × 16). */
export const SHINE = sprite(
  fromRows(
    [
      "......ww...ww...",
      ".....ww...ww....",
      "....ww...ww.....",
      "...ww...ww......",
      "..ww...ww.......",
      ".ww...ww........",
      "ww...ww.........",
      "w...ww..........",
      "...ww...........",
      "..ww............",
      ".ww.............",
      "ww..............",
      "w...............",
    ],
    { w: "paper-100" },
  ),
);

/** A round rivet for the role nameplate (3 × 3). */
export const RIVET = sprite(
  fromRows([".k.", "kwk", ".k."], { k: "stone-700", w: "stone-400" }),
);
