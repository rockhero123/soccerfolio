/**
 * Depth layers of the forest. Every colour comes from a design token
 * (directly, or mixed from tokens in globals.css) — never from raw hex values.
 */
export type ForestDepth = "distant" | "mid" | "near";

type LayerStyle = {
  /** Fill class for leaves and foliage clumps. */
  leaf: string;
  /** Fill class for trunks and branches. */
  wood: string;
  /** Stroke class in the wood colour (for branches drawn as strokes). */
  woodStroke: string;
  /** Stroke class for outlines. */
  line: string;
  /** Stroke class for inner details (veins, bark lines). */
  detail: string;
  /** Outline width in SVG user units. */
  outline: number;
};

export const layerStyles: Record<ForestDepth, LayerStyle> = {
  // Pale, misty trees far away: soft outlines, washed-out colours.
  distant: {
    leaf: "fill-(--forest-distant-leaf)",
    wood: "fill-(--forest-distant-wood)",
    woodStroke: "stroke-(--forest-distant-wood)",
    line: "stroke-(--forest-distant-line)",
    detail: "stroke-(--forest-distant-line)",
    outline: 2.5,
  },
  // Mid trees: bark trunks and moss crowns with thick ink outlines.
  mid: {
    leaf: "fill-(--forest-mid-leaf)",
    wood: "fill-bark",
    woodStroke: "stroke-bark",
    line: "stroke-ink",
    detail: "stroke-ink",
    outline: 3,
  },
  // Dark foreground foliage closest to the viewer.
  near: {
    leaf: "fill-forest-deep",
    wood: "fill-forest-deep",
    woodStroke: "stroke-forest-deep",
    line: "stroke-ink",
    detail: "stroke-moss",
    outline: 4,
  },
};
