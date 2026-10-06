import type { ReactNode } from "react";
import GrassStrip from "./GrassStrip";
import CenterCircle from "./soccer-field/CenterCircle";
import CornerArc from "./soccer-field/CornerArc";
import PenaltyArea from "./soccer-field/PenaltyArea";

type SoccerFieldProps = {
  /** The content sections, played on the bright striped grass. */
  children: ReactNode;
  /** Content of the dark-grass contact zone at the bottom of the field. */
  contact?: ReactNode;
};

/**
 * Sizes shared by the markings and the content padding:
 * - `--field-inset`: gap between the field edge and the chalk boundary
 * - `--penalty-w`: width of a penalty area; its height follows the drawing's
 *   400 × 170 ratio (× 0.425), so the content can clear it at any width
 * - `--circle-w`: diameter of the centre circle
 * Widths use container units (`cqw`, the field is the container), so they also
 * work in vertical sizes like padding and min-height.
 */
const fieldVars =
  "@container [--field-inset:1rem] md:[--field-inset:1.5rem] [--penalty-w:min(70cqw,26rem)] [--circle-w:min(40cqw,12rem)]";
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
const contentPadding = "px-[calc(var(--field-inset)+1rem)] md:px-[calc(var(--field-inset)+2rem)]";

/**
 * The soccer field that holds all the page content (spec 001 US-3), as in `design/main.jpg`:
 * a bright, mown `pitch` playing zone and a `pitch-dark` contact zone behind a grass edge.
 *
 * The field grows with its content. Lines that must stretch (boundary, halfway line)
 * are CSS borders; shapes that must keep their proportions (penalty areas, centre
 * circle, corner arcs) are SVGs with a fixed viewBox, sized by width only.
 * All markings are decorative and hidden from assistive tech.
 */
export default function SoccerField({ children, contact }: SoccerFieldProps) {
  return (
    <div
      data-testid="soccer-field"
      className={`relative isolate flex flex-1 flex-col overflow-hidden rounded-card border-outline-lg border-ink ${fieldVars}`}
    >
      <div
        data-field-zone="play"
        className={`relative flex flex-1 flex-col bg-pitch bg-mowing text-ink ${playMinHeight}`}
      >
        <div
          aria-hidden="true"
          data-field-markings=""
          className="pointer-events-none absolute inset-0 select-none"
        >
          <PenaltyArea
            end="top"
            className="absolute top-(--field-inset) left-1/2 w-(--penalty-w) -translate-x-1/2"
          />
          <div
            data-marking="halfway-line"
            className="absolute inset-x-(--field-inset) top-1/2 -translate-y-1/2 border-t-outline border-chalk"
          />
          <CenterCircle className="absolute top-1/2 left-1/2 w-(--circle-w) -translate-1/2" />
        </div>
        <div
          className={`relative z-10 flex flex-1 flex-col ${clearTopPenalty} pb-16 ${contentPadding}`}
        >
          {children}
        </div>
      </div>

      <div
        data-field-zone="contact"
        className="relative bg-pitch-dark bg-mowing text-chalk"
      >
        <div
          aria-hidden="true"
          data-field-markings=""
          className="pointer-events-none absolute inset-0 select-none"
        >
          <GrassStrip className="absolute inset-x-0 bottom-full h-6 fill-pitch-dark md:h-8" />
          <PenaltyArea
            end="bottom"
            goal
            className="absolute bottom-(--field-inset) left-1/2 w-(--penalty-w) -translate-x-1/2"
          />
        </div>
        <div
          className={`relative z-10 pt-12 ${clearBottomPenalty} ${contentPadding}`}
        >
          {contact}
        </div>
      </div>

      <div
        aria-hidden="true"
        data-marking="boundary"
        className="pointer-events-none absolute inset-(--field-inset) border-outline border-chalk"
      >
        <CornerArc corner="top-left" />
        <CornerArc corner="top-right" />
        <CornerArc corner="bottom-left" />
        <CornerArc corner="bottom-right" />
      </div>
    </div>
  );
}
