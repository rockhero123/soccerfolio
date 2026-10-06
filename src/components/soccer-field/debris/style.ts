/** Ink outline for fallen debris: a little finer than the main outline token. */
export const debrisOutline =
  "stroke-ink [stroke-width:calc(var(--stroke-width-outline)*0.8)]";

/** Woody strokes (twigs, stems) are drawn as an ink casing under a coloured core. */
export const woodCasing =
  "fill-none stroke-ink [stroke-width:calc(var(--stroke-width-outline)*2.4)]";
export const woodCore =
  "fill-none [stroke-width:calc(var(--stroke-width-outline)*1.2)]";

/** Places a debris piece: its origin at (x, y), turned by `angle` degrees. */
export function place(x: number, y: number, angle: number): string {
  return `translate(${x} ${y}) rotate(${angle})`;
}
