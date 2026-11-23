import ForestCharacters from "./ForestCharacters";
import { FOREST } from "./forest-background/pixelForest";
import PixelPattern from "./pixel/PixelPattern";

/**
 * The enchanted forest page background (spec 001 US-2), in detailed pixel art.
 *
 * Purely decorative, procedurally generated pixel tiles (seeded, so they are
 * the same on every render) with three depth layers: a dark understory and
 * shade, rows of clumpy oaks and pines, and bushes, flowers and mossy rocks in
 * front, all on a textured forest floor. Each tile is defined once and repeated.
 * It fills its positioned parent (the page body) and leaves a clear centre for the field:
 * - ≥ 1024px: forest panels left and right, plus top and bottom bands.
 * - < 1024px: a narrow side border plus top and bottom bands.
 * Panel sizes come from `--forest-side` and `--forest-band` in globals.css.
 */
export default function ForestBackground() {
  return (
    <div
      aria-hidden="true"
      data-testid="forest-background"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-leaf-600 select-none"
    >
      <PixelPattern
        id="forest-side-left"
        tile={FOREST.side}
        className="absolute inset-y-0 left-0 h-full w-(--forest-side)"
        data={{ "data-forest-part": "side-left" }}
      />
      <PixelPattern
        id="forest-side-right"
        tile={FOREST.side}
        offsetY={60}
        className="absolute inset-y-0 right-0 h-full w-(--forest-side) -scale-x-100"
        data={{ "data-forest-part": "side-right" }}
      />
      <PixelPattern
        id="forest-band-top"
        tile={FOREST.top}
        className="absolute inset-x-0 top-0 h-(--forest-band) w-full"
        data={{ "data-forest-part": "band-top" }}
      />
      {/* The bottom band shows the bottom of its tile, where its trees stand. */}
      <div
        data-forest-part="band-bottom"
        className="absolute inset-x-0 bottom-0 h-(--forest-band) overflow-hidden"
      >
        <PixelPattern
          id="forest-band-bottom"
          tile={FOREST.bottom}
          className="absolute inset-x-0 bottom-0 h-[calc(72*var(--px))] w-full"
        />
      </div>
      <ForestCharacters />
    </div>
  );
}
