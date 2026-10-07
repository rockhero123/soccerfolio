import ForestCharacters from "./ForestCharacters";
import ForestBandTile, { BAND_TILE } from "./forest-background/ForestBandTile";
import ForestSideTile, { SIDE_TILE } from "./forest-background/ForestSideTile";
import InkFilter from "./forest-background/InkFilter";

const SIDE_ID = "forest-side-tile";
const BAND_TOP_ID = "forest-band-top-tile";
const BAND_BOTTOM_ID = "forest-band-bottom-tile";
const SIDE_INK_ID = "forest-ink-side";
const BAND_INK_ID = "forest-ink-band";

/** Soft fade on the inner edge of the wide desktop side panels. */
const innerFade =
  "lg:[mask-image:linear-gradient(to_right,black_calc(100%-1.25rem),transparent)]";

/**
 * The enchanted forest page background (spec 001 US-2).
 *
 * Purely decorative hand-coded SVG: a pale, misty backdrop with three depth layers
 * (pale distant trees, mid bark-and-moss trees, dark foreground foliage), painted
 * with a static hand-inked, watercolour filter (one per tile size).
 * It fills its positioned parent (the page body) and leaves a clear centre for the field:
 * - ≥ 1024px: wide forest panels left and right, plus top and bottom bands.
 * - < 1024px: a narrow side border plus top and bottom bands.
 * Panel sizes come from `--forest-side` and `--forest-band` in globals.css.
 */
export default function ForestBackground() {
  return (
    <div
      aria-hidden="true"
      data-testid="forest-background"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-forest-mist select-none"
    >
      <svg width="0" height="0" className="absolute" focusable="false">
        <defs>
          <InkFilter
            id={SIDE_INK_ID}
            width={SIDE_TILE.width}
            height={SIDE_TILE.height}
          />
          <InkFilter
            id={BAND_INK_ID}
            width={BAND_TILE.width}
            height={BAND_TILE.height}
          />
          <ForestSideTile id={SIDE_ID} filterId={SIDE_INK_ID} />
          <ForestBandTile
            id={BAND_TOP_ID}
            edge="top"
            seed={3}
            filterId={BAND_INK_ID}
          />
          <ForestBandTile
            id={BAND_BOTTOM_ID}
            edge="bottom"
            seed={58}
            filterId={BAND_INK_ID}
          />
        </defs>
      </svg>

      <svg
        data-forest-part="side-left"
        className={`absolute inset-y-0 left-0 h-full w-(--forest-side) ${innerFade}`}
        focusable="false"
      >
        <rect width="100%" height="100%" fill={`url(#${SIDE_ID})`} />
      </svg>
      <svg
        data-forest-part="side-right"
        className={`absolute inset-y-0 right-0 h-full w-(--forest-side) -scale-x-100 ${innerFade}`}
        focusable="false"
      >
        <rect width="100%" height="100%" fill={`url(#${SIDE_ID})`} />
      </svg>

      <svg
        data-forest-part="band-top"
        className="absolute inset-x-0 top-0 h-(--forest-band) w-full"
        focusable="false"
      >
        <rect width="100%" height="100%" fill={`url(#${BAND_TOP_ID})`} />
      </svg>
      <svg
        data-forest-part="band-bottom"
        className="absolute inset-x-0 bottom-0 h-(--forest-band) w-full"
        focusable="false"
      >
        <rect width="100%" height="100%" fill={`url(#${BAND_BOTTOM_ID})`} />
      </svg>

      <ForestCharacters />
    </div>
  );
}
