/**
 * Field lines are drawn in two layers, Cuphead style: a wide `ink` casing first,
 * then a narrower `parchment` line on top. Every marking draws its ink layer below
 * every paint layer, so crossings and junctions read as one continuous painted line.
 *
 * `--field-line` (set on the field) is the width of the cream line; the ink casing
 * adds the outline token on each side. Strokes do not scale with the SVG.
 */
export type LineLayer = "ink" | "paint";

export const lineClass: Record<LineLayer, string> = {
  ink: "fill-none stroke-ink [stroke-width:calc(var(--field-line)+2*var(--stroke-width-outline))]",
  paint: "fill-none stroke-parchment [stroke-width:var(--field-line)]",
};

/** Fill for spots: ink discs under smaller parchment discs. */
export const spotClass: Record<LineLayer, string> = {
  ink: "fill-ink",
  paint: "fill-parchment",
};

/**
 * Only the paint layer carries `data-marking` (what the marking *is*);
 * the ink layer is marked as its casing.
 */
export function markingAttrs(layer: LineLayer, name: string) {
  return layer === "paint"
    ? { "data-marking": name }
    : { "data-marking-ink": name };
}
