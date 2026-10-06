/** Thin ink details (brows, mouths, hatching) inside a character's bold silhouette. */
export const detail = "stroke-outline";

/** Stalks and branch arms: an ink casing under a coloured core. */
export const stalkCasing =
  "fill-none stroke-ink [stroke-width:calc(var(--stroke-width-outline-lg)*2)]";
export const stalkCore =
  "fill-none [stroke-width:calc(var(--stroke-width-outline-lg)*1.1)]";

/** No outline, for painted accents such as cheeks and highlights. */
export const noStroke = "stroke-none";
