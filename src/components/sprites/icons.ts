import { fromRows, sprite } from "../pixel/canvas";

/** Pixel hamburger icon: three bars (9 × 9). */
export const MENU_ICON = sprite(
  fromRows(
    [
      "#########",
      "#########",
      ".........",
      ".........",
      "#########",
      "#########",
      ".........",
      ".........",
      "#########",
    ],
    { "#": "ink" },
  ),
);

/** Pixel close icon: a chunky X (9 × 9). */
export const CLOSE_ICON = sprite(
  fromRows(
    [
      "##.....##",
      "###...###",
      ".###.###.",
      "..#####..",
      "...###...",
      "..#####..",
      ".###.###.",
      "###...###",
      "##.....##",
    ],
    { "#": "ink" },
  ),
);
