/**
 * Field lines are chalky `parchment` pixel lines, two art pixels wide, with a
 * crisp, one-pixel drop shadow of dark grass, so they look painted on the lawn.
 * The shadow is a CSS filter on each marking layer.
 */
export const markingShadow =
  "[filter:drop-shadow(var(--px)_var(--px)_0_color-mix(in_oklab,var(--color-grass-900)_45%,transparent))]";

/** Width of a straight chalk line (two art pixels). */
export const lineWidth = "calc(2*var(--px))";

/** Marks a marking element with what it is, for tests and styling. */
export function markingAttrs(name: string) {
  return { "data-marking": name };
}
