import { PixelCanvas, sprite, type Token } from "../pixel/canvas";

const R = [
  "#####.",
  "##..##",
  "##..##",
  "#####.",
  "##.##.",
  "##..##",
  "##..##",
];

const M = [
  "##...##",
  "###.###",
  "#######",
  "##.#.##",
  "##...##",
  "##...##",
  "##...##",
];

/** One bevelled letter block: face, light top/left edge, dark bottom/right edge. */
function block(
  c: PixelCanvas,
  x: number,
  y: number,
  size: number,
  [face, light, shade]: readonly [Token, Token, Token],
  letter: readonly string[],
  ink: Token,
) {
  c.rect(x, y, size, size, "wood-900");
  c.rect(x + 1, y + 1, size - 2, size - 2, face);
  c.rect(x + 1, y + 1, size - 2, 1, light);
  c.rect(x + 1, y + 1, 1, size - 2, light);
  c.rect(x + 1, y + size - 2, size - 2, 1, shade);
  c.rect(x + size - 2, y + 2, 1, size - 3, shade);
  const lx = x + Math.floor((size - letter[0].length) / 2);
  const ly = y + Math.floor((size - letter.length) / 2);
  c.stamp(letter, { "#": ink }, lx, ly);
}

/**
 * The "RM" logo of `design/main.jpg` as pixel art: a parchment R block and a
 * dark-grass M block stepped below it, each bevelled and outlined.
 */
function logo() {
  const size = 12;
  const c = new PixelCanvas(24, 19);
  // A one-pixel drop shadow under both blocks.
  c.rect(1, 1, size, size, "wood-700").rect(12, 7, size, size, "wood-700");
  block(c, 0, 0, size, ["paper-200", "paper-100", "paper-400"], R, "ink");
  block(
    c,
    11,
    6,
    size,
    ["grass-800", "grass-600", "grass-900"],
    M,
    "paper-100",
  );
  return sprite(c);
}

export const LOGO = logo();
