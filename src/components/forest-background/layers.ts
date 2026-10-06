/**
 * Depth layers of the forest. Every colour comes from a design token (directly,
 * or a forest colour mixed from tokens in globals.css) and every outline width
 * comes from the SOC-2 outline tokens — never from raw hex values or numbers.
 */
export type ForestDepth = "distant" | "mid" | "near";

type LayerStyle = {
  /** Fill classes for leaves and foliage clumps: base, painted shadow and highlight. */
  leaf: string;
  leafShade: string;
  leafLight: string;
  /** Fill classes for trunks: base, painted shadow and highlight. */
  wood: string;
  woodShade: string;
  woodLight: string;
  /** Stroke class in the wood colour (for branches drawn as strokes). */
  woodStroke: string;
  /** Stroke class for outlines. */
  line: string;
  /** Fill class for the offset ink shape that thickens the shadow side of outlines. */
  inkWeight: string | null;
  /** Stroke class for inner details (veins, bark lines). */
  detail: string;
  /** Outline width utility (SOC-2 token). */
  outline: string;
  /** The same outline token as a CSS variable, for derived widths. */
  outlineVar: string;
};

/** Thin inner detail lines: 60 % of the regular outline token. */
export const detailWidth =
  "[stroke-width:calc(var(--stroke-width-outline)*0.6)]";

export const layerStyles: Record<ForestDepth, LayerStyle> = {
  // Pale, misty trees far away: soft outlines, washed-out colours.
  distant: {
    leaf: "fill-forest-distant-leaf",
    leafShade: "fill-forest-distant-shade",
    leafLight: "fill-forest-mist",
    wood: "fill-forest-distant-wood",
    woodShade: "fill-forest-distant-shade",
    woodLight: "fill-forest-mist",
    woodStroke: "stroke-forest-distant-wood",
    line: "stroke-forest-distant-line",
    inkWeight: null,
    detail: "stroke-forest-distant-line",
    outline: "stroke-outline",
    outlineVar: "var(--stroke-width-outline)",
  },
  // Mid trees: bark trunks and moss crowns with thick ink outlines.
  mid: {
    leaf: "fill-forest-mid-leaf",
    leafShade: "fill-forest-mid-shade",
    leafLight: "fill-forest-mid-light",
    wood: "fill-bark",
    woodShade: "fill-forest-bark-shade",
    woodLight: "fill-forest-bark-light",
    woodStroke: "stroke-bark",
    line: "stroke-ink",
    inkWeight: "fill-ink",
    detail: "stroke-ink",
    outline: "stroke-outline",
    outlineVar: "var(--stroke-width-outline)",
  },
  // Dark foreground foliage closest to the viewer.
  near: {
    leaf: "fill-forest-deep",
    leafShade: "fill-forest-deep-shade",
    leafLight: "fill-forest-deep-light",
    wood: "fill-forest-deep",
    woodShade: "fill-forest-deep-shade",
    woodLight: "fill-forest-deep-light",
    woodStroke: "stroke-forest-deep",
    line: "stroke-ink",
    inkWeight: "fill-ink",
    detail: "stroke-moss",
    outline: "stroke-outline-lg",
    outlineVar: "var(--stroke-width-outline-lg)",
  },
};

/** Offset of the ink-weight shape: outlines get heavier on the lower right, like a brush. */
export const INK_WEIGHT_OFFSET = "translate(2 2.5)";
