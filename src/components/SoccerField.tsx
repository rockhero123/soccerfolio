import type { ReactNode } from "react";
import GrassStrip from "./GrassStrip";
import CenterCircle from "./soccer-field/CenterCircle";
import CornerArc from "./soccer-field/CornerArc";
import FieldPaint from "./soccer-field/FieldPaint";
import FieldScatter from "./soccer-field/FieldScatter";
import { markingAttrs, type LineLayer } from "./soccer-field/lines";
import PenaltyArea from "./soccer-field/PenaltyArea";

type SoccerFieldProps = {
  /** The content sections, played on the bright striped grass. */
  children: ReactNode;
  /** Content of the dark-grass contact zone at the bottom of the field. */
  contact?: ReactNode;
};

/**
 * Sizes shared by the markings and the content padding:
 * - `--field-inset`: gap between the field edge and the boundary line
 * - `--field-line`: width of the parchment lines (the ink casing adds the outline token)
 * - `--penalty-w`: width of a penalty area; its height follows the drawing's
 *   400 × 170 ratio (× 0.425), so the content can clear it at any width
 * - `--circle-w`: diameter of the centre circle
 * Widths use container units (`cqw`, the field is the container), so they also
 * work in vertical sizes like padding and min-height.
 */
const fieldVars =
  "@container [--field-inset:1rem] md:[--field-inset:1.5rem] [--field-line:4px] md:[--field-line:5px] [--penalty-w:min(70cqw,26rem)] [--circle-w:min(40cqw,12rem)]";
/**
 * The playing zone is at least tall enough for the halfway line (at its middle)
 * to clear the top penalty area plus the centre circle, so markings never collide.
 */
const playMinHeight =
  "min-h-[calc(2*(var(--field-inset)+var(--penalty-w)*0.425+1rem)+var(--circle-w))]";
/** Padding that keeps content clear of a penalty area (inset + its height + a gap). */
const clearTopPenalty =
  "pt-[calc(var(--field-inset)+var(--penalty-w)*0.425+1.5rem)]";
const clearBottomPenalty =
  "pb-[calc(var(--field-inset)+var(--penalty-w)*0.425+1.5rem)]";
const contentPadding =
  "px-[calc(var(--field-inset)+1rem)] md:px-[calc(var(--field-inset)+2rem)]";

/**
 * Debris lies on top of the lines (z 3), under the forest shade (z 4) and the
 * content (z 10).
 */
function scatterLayer(zone: "play" | "contact") {
  return (
    <div
      aria-hidden="true"
      data-field-markings=""
      className="pointer-events-none absolute inset-0 z-[3] select-none"
    >
      <FieldScatter zone={zone} />
    </div>
  );
}

/** All ink casings sit below all parchment lines; content sits above both. */
const layerZ: Record<LineLayer, string> = { ink: "z-[1]", paint: "z-[2]" };
const LAYERS: LineLayer[] = ["ink", "paint"];
const markingsLayer = "pointer-events-none absolute inset-0 select-none";

/** Thickness of a straight line in each layer: parchment, or parchment plus ink casing. */
const lineThickness: Record<LineLayer, string> = {
  ink: "h-[calc(var(--field-line)+2*var(--stroke-width-outline))] bg-ink",
  paint: "h-(--field-line) bg-parchment",
};
const boundaryLine: Record<LineLayer, string> = {
  ink: "inset-[calc(var(--field-inset)-var(--stroke-width-outline))] border-[length:calc(var(--field-line)+2*var(--stroke-width-outline))] border-ink",
  paint: "inset-(--field-inset) border-(length:--field-line) border-parchment",
};

/**
 * The soccer field that holds all the page content (spec 001 US-3), as in `design/main.jpg`,
 * painted to sit in the Cuphead-style forest:
 * - a mown `pitch` playing zone and a `pitch-dark` contact zone behind a grass edge,
 *   both with a static watercolour wash
 * - bold `parchment` markings with `ink` outlines
 * - fallen forest debris (leaves, stems, twigs, feathers, cartoon grass tufts)
 *   scattered at random over both zones, lying on top of the lines
 * - forest shade falling on the field edges, so the field blends into the forest
 *
 * The field grows with its content. Lines that must stretch (boundary, halfway line)
 * are CSS boxes; shapes that must keep their proportions (penalty areas, centre
 * circle, corner arcs) are SVGs with a fixed viewBox, sized by width only.
 * All markings are decorative and hidden from assistive tech.
 */
export default function SoccerField({ children, contact }: SoccerFieldProps) {
  return (
    <div
      data-testid="soccer-field"
      className={`relative isolate flex flex-1 flex-col overflow-hidden rounded-[1.5rem] border-outline-lg border-ink shadow-[0_0_2rem_1.25rem_color-mix(in_oklab,var(--color-forest-deep)_60%,transparent)] ${fieldVars}`}
    >
      <div
        data-field-zone="play"
        className={`relative flex flex-1 flex-col bg-pitch bg-mowing text-ink ${playMinHeight}`}
      >
        <div
          aria-hidden="true"
          data-field-markings=""
          className={markingsLayer}
        >
          <FieldPaint tone="lighten" />
        </div>
        {LAYERS.map((layer) => (
          <div
            key={layer}
            aria-hidden="true"
            data-field-markings=""
            className={`${markingsLayer} ${layerZ[layer]}`}
          >
            <PenaltyArea
              end="top"
              layer={layer}
              className="absolute top-(--field-inset) left-1/2 w-(--penalty-w) -translate-x-1/2"
            />
            <div
              {...markingAttrs(layer, "halfway-line")}
              className={`absolute inset-x-(--field-inset) top-1/2 -translate-y-1/2 ${lineThickness[layer]}`}
            />
            <CenterCircle
              layer={layer}
              className="absolute top-1/2 left-1/2 w-(--circle-w) -translate-1/2"
            />
          </div>
        ))}
        <div
          data-field-content=""
          className={`relative z-10 flex flex-1 flex-col ${clearTopPenalty} pb-16 ${contentPadding}`}
        >
          {children}
        </div>
        {scatterLayer("play")}
      </div>

      <div
        data-field-zone="contact"
        className="relative bg-pitch-dark bg-mowing text-chalk"
      >
        <div
          aria-hidden="true"
          data-field-markings=""
          className={markingsLayer}
        >
          <FieldPaint tone="darken" />
          <GrassStrip className="absolute inset-x-0 bottom-full h-6 fill-pitch-dark md:h-8" />
        </div>
        {LAYERS.map((layer) => (
          <div
            key={layer}
            aria-hidden="true"
            data-field-markings=""
            className={`${markingsLayer} ${layerZ[layer]}`}
          >
            <PenaltyArea
              end="bottom"
              layer={layer}
              goal
              className="absolute bottom-(--field-inset) left-1/2 w-(--penalty-w) -translate-x-1/2"
            />
          </div>
        ))}
        <div
          data-field-content=""
          className={`relative z-10 pt-12 ${clearBottomPenalty} ${contentPadding}`}
        >
          {contact}
        </div>
        {scatterLayer("contact")}
      </div>

      {LAYERS.map((layer) => (
        <div
          key={layer}
          aria-hidden="true"
          data-field-markings=""
          className={`pointer-events-none absolute inset-0 ${layerZ[layer]}`}
        >
          <div
            {...markingAttrs(layer, "boundary")}
            className={`absolute ${boundaryLine[layer]}`}
          />
          {/* Corner arcs start at the inner edge of the parchment line in both layers. */}
          <div className="absolute inset-[calc(var(--field-inset)+var(--field-line))]">
            <CornerArc corner="top-left" layer={layer} />
            <CornerArc corner="top-right" layer={layer} />
            <CornerArc corner="bottom-left" layer={layer} />
            <CornerArc corner="bottom-right" layer={layer} />
          </div>
        </div>
      ))}

      {/* Forest shade falling on the edges of the field. */}
      <div
        aria-hidden="true"
        data-field-shade=""
        className="pointer-events-none absolute inset-0 z-[4] rounded-[inherit] shadow-[inset_0_0_3rem_color-mix(in_oklab,var(--color-forest-deep)_70%,transparent)]"
      />
    </div>
  );
}
