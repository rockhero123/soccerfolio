/**
 * Colours debris may use in each field zone, as literal Tailwind classes.
 * Content can sit on top of any piece, so every fill keeps the zone's text readable
 * (WCAG AA, checked in SoccerField.contrast.test.ts):
 * - bright grass, `ink` text: light, dry and autumn tones
 * - dark grass, `chalk` text: red, bark and shaded tones
 * Ink outlines are thin line art and are not counted as backgrounds.
 */
export type Zone = "play" | "contact";

type Palette = {
  leaves: string[];
  /** Stroke class for twig wood. */
  twig: string;
  /** Stroke class for stem stalks and fill class for their leaflets. */
  stalk: string;
  leaflet: string;
  /** Fill class for grass tufts. */
  tuft: string;
  /** Feathers and clover only drift onto the bright grass. */
  feather?: { vane: string; tip: string };
  clover?: string;
};

export const ZONE_PALETTE: Record<Zone, Palette> = {
  play: {
    leaves: [
      "fill-moss",
      "fill-cartoon-yellow",
      "fill-forest-mid-light",
      "fill-forest-distant-wood",
    ],
    twig: "stroke-forest-bark-light",
    stalk: "stroke-moss",
    leaflet: "fill-forest-mid-light",
    tuft: "fill-forest-mid-leaf",
    feather: { vane: "fill-parchment", tip: "fill-cartoon-yellow" },
    clover: "fill-moss",
  },
  contact: {
    leaves: ["fill-cartoon-red", "fill-forest-mid-shade", "fill-bark"],
    twig: "stroke-bark",
    stalk: "stroke-forest-mid-shade",
    leaflet: "fill-forest-mid-shade",
    tuft: "fill-forest-deep",
  },
};

/** Opacity of the ink shading painted on one half of every leaf. */
export const LEAF_SHADE = 0.18;
