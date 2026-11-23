import type { ReactNode } from "react";
import GrassStrip from "./GrassStrip";
import CenterCircle from "./soccer-field/CenterCircle";
import CornerArc from "./soccer-field/CornerArc";
import FieldPaint from "./soccer-field/FieldPaint";
import FieldScatter from "./soccer-field/FieldScatter";
import { markingAttrs, markingShadow } from "./soccer-field/lines";
import PenaltyArea from "./soccer-field/PenaltyArea";

type SoccerFieldProps = {
  /** The content sections, played on the bright striped grass. */
  children: ReactNode;
  /** Content of the dark-grass contact zone at the bottom of the field. */
  contact?: ReactNode;
  /** Decoration across the top of the playing zone, over the lawn and its markings (e.g. the waterfall). */
  crown?: ReactNode;
};

/**
 * Sizes shared by the markings and the content padding, all in art pixels
 * (`--px`), so the pixel markings line up with the CSS lines:
 * - `--field-inset`: gap between the field edge and the boundary line
 * - `--field-line`: width of the chalk lines (two art pixels)
 * - `--penalty-w` / `--penalty-h`: size of a penalty-area drawing (goal line
 *   included, 6 art pixels below its top)
 * - `--circle-w`: diameter of the centre circle
 */
const fieldVars =
  "[--field-inset:calc(5*var(--px))] [--field-line:calc(2*var(--px))] [--penalty-w:calc(96*var(--px))] [--penalty-h:calc(48*var(--px))] [--circle-w:calc(48*var(--px))]";
/**
 * The playing zone is at least tall enough for the halfway line (at its middle)
 * to clear the top penalty area plus the centre circle, so markings never collide.
 */
const playMinHeight =
  "min-h-[calc(2*(var(--field-inset)+var(--penalty-h)+1rem)+var(--circle-w))]";
/** Padding that keeps content clear of a penalty area (inset + its height + a gap). */
const clearTopPenalty = "pt-[calc(var(--field-inset)+var(--penalty-h)+1.5rem)]";
const clearBottomPenalty =
  "pb-[calc(var(--field-inset)+var(--penalty-h)+1.5rem)]";
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

/** Chalk markings sit above the lawn (z 2), with their crisp drop shadow. */
const markingsLayer = `pointer-events-none absolute inset-0 z-[2] select-none ${markingShadow}`;

/** Places a penalty drawing so its goal line sits on the boundary line. */
const goalLineOffset = "calc(var(--field-inset) - 6 * var(--px))";

/**
 * The soccer field that holds all the page content (spec 001 US-3), as in
 * `design/main.jpg`, drawn as detailed pixel art in the forest:
 * - a mown, striped `pitch` lawn for the playing zone and a `pitch-dark` lawn for
 *   the contact zone behind a strip of pixel grass
 * - chalky `parchment` pixel markings with a crisp shadow
 * - fallen forest debris (leaves, twigs, clovers, flowers, pebbles) scattered
 *   over both zones, lying on top of the lines
 * - a notched pixel border and a band of forest shade along the edges
 *
 * Content in both zones is centred and at most 1100px wide (spec 001 US-6), with
 * responsive padding that also keeps it clear of the markings.
 *
 * The field grows with its content. Lines that must stretch (boundary, halfway
 * line) are CSS boxes; shapes (penalty areas, centre circle, corner arcs) are
 * pixel sprites at the site's pixel size. All markings are decorative.
 */
export default function SoccerField({
  children,
  contact,
  crown,
}: SoccerFieldProps) {
  return (
    <div
      data-testid="soccer-field"
      className={`relative isolate flex flex-1 flex-col shadow-[0_calc(var(--px)*-1)_0_0_var(--color-leaf-900),0_var(--px)_0_0_var(--color-leaf-900),calc(var(--px)*-1)_0_0_0_var(--color-leaf-900),var(--px)_0_0_0_var(--color-leaf-900)] ${fieldVars}`}
    >
      <div
        data-field-zone="play"
        className={`relative flex flex-1 flex-col overflow-hidden bg-pitch text-ink ${playMinHeight}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <FieldPaint zone="play" />
        </div>
        <div aria-hidden="true" data-field-markings="" className={markingsLayer}>
          <PenaltyArea
            end="top"
            className="absolute left-1/2 -translate-x-1/2"
            style={{ top: goalLineOffset }}
          />
          <div
            {...markingAttrs("halfway-line")}
            className="absolute inset-x-(--field-inset) top-1/2 h-(--field-line) -translate-y-1/2 bg-paper-100"
          />
          <CenterCircle className="absolute top-1/2 left-1/2 -translate-1/2" />
        </div>
        <div
          data-field-content=""
          className={`relative z-10 flex flex-1 flex-col ${clearTopPenalty} pb-16 ${contentPadding}`}
        >
          <div className="mx-auto w-full max-w-[68.75rem]">{children}</div>
        </div>
        {scatterLayer("play")}
        {/* No stacking layer of its own: the crown's art sets its own z-index (above
            the lawn's scatter, below the forest shade) and controls can sit above the content. */}
        {crown && (
          <div className="pointer-events-none absolute inset-0">{crown}</div>
        )}
      </div>

      <div
        data-field-zone="contact"
        className="relative bg-pitch-dark text-chalk"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <FieldPaint zone="contact" />
        </div>
        <GrassStrip className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-2*var(--px))] z-[1]" />
        <div aria-hidden="true" data-field-markings="" className={markingsLayer}>
          <PenaltyArea
            end="bottom"
            goal
            className="absolute left-1/2 -translate-x-1/2"
            style={{ bottom: goalLineOffset }}
          />
        </div>
        <div
          data-field-content=""
          className={`relative z-10 pt-12 ${clearBottomPenalty} ${contentPadding}`}
        >
          <div className="mx-auto w-full max-w-[68.75rem]">{contact}</div>
        </div>
        {scatterLayer("contact")}
      </div>

      <div aria-hidden="true" data-field-markings="" className={markingsLayer}>
        <div
          {...markingAttrs("boundary")}
          className="absolute inset-(--field-inset) border-(length:--field-line) border-paper-100"
        />
        {/* Corner arcs start at the inner edge of the chalk line. */}
        <div className="absolute inset-[calc(var(--field-inset)+var(--field-line))]">
          <CornerArc corner="top-left" />
          <CornerArc corner="top-right" />
          <CornerArc corner="bottom-left" />
          <CornerArc corner="bottom-right" />
        </div>
      </div>

      {/* Forest shade on the edges of the field: two crisp bands, no blur. */}
      <div
        aria-hidden="true"
        data-field-shade=""
        className="pointer-events-none absolute inset-0 z-[4] shadow-[inset_0_0_0_var(--px)_color-mix(in_oklab,var(--color-leaf-900)_45%,transparent),inset_0_0_0_calc(var(--px)*2)_color-mix(in_oklab,var(--color-leaf-900)_20%,transparent)]"
      />
    </div>
  );
}
