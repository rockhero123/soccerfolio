import GrassStrip from "./GrassStrip";

type TitleBannerProps = {
  title: string;
  /** Id for the heading, so its section can be labelled by it. */
  headingId: string;
};

/** Plank outline and shading, drawn in a 200 × 60 box that stretches to the title. */
const PLANK =
  "M5 9Q60 3 120 6T196 7L198 31Q199 45 196 53Q120 58 70 55T3 54Q1 40 2 28Z";

/** A round nail head hammered into the plank. */
function nail(side: "left" | "right") {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`absolute top-1/2 size-3 -translate-y-1/2 ${side === "left" ? "left-2.5" : "right-2.5"}`}
      focusable="false"
    >
      <circle
        cx="6"
        cy="6"
        r="4.5"
        className="fill-forest-bark-shade stroke-ink stroke-outline"
      />
      <circle cx="4.6" cy="4.6" r="1.4" className="fill-forest-bark-light" />
    </svg>
  );
}

/**
 * A section title banner (spec 001 US-6): a cartoon wooden plank, nailed up in
 * the forest, with the `<h2>` engraved into the wood and grass (`GrassStrip`,
 * from `design_2.ai.pdf`) growing in front of its bottom edge.
 *
 * The engraving is light `parchment` (fresh wood inside the cut) on `bark`, an
 * allowed text pair in manifest §6; the shadow and lip of the cut only frame the
 * letters. Light highlights stay out from behind the text.
 */
export default function TitleBanner({ title, headingId }: TitleBannerProps) {
  return (
    <div
      data-title-banner="wood"
      className="relative mx-auto w-fit min-w-[min(100%,16rem)] px-12 pt-3 pb-7 text-center"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <svg
          viewBox="0 0 200 60"
          preserveAspectRatio="none"
          data-wood="plank"
          className="absolute inset-0 size-full overflow-visible drop-shadow-[4px_4px_0_var(--color-ink)]"
          focusable="false"
        >
          <path d={PLANK} className="fill-bark" />
          {/* Darker grain and a shaded underside. */}
          <path
            d="M3 44Q70 49 120 46T197 44L196 53Q120 58 70 55T3 54Z"
            className="fill-forest-bark-shade"
            fillOpacity={0.55}
          />
          <path
            d="M12 21Q60 17 108 22T190 20M16 35Q78 39 128 34T188 37M24 47Q92 45 172 48"
            className="fill-none stroke-forest-bark-shade [stroke-width:calc(var(--stroke-width-outline)*0.6)]"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* A thin worn highlight along the top edge, above the lettering. */}
          <path
            d="M10 11Q60 6 120 9T190 10"
            className="fill-none stroke-forest-bark-light [stroke-width:calc(var(--stroke-width-outline)*0.6)]"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={PLANK}
            className="fill-none stroke-ink stroke-outline-lg"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        {/* A knot in the wood, drawn at a fixed size so it never stretches. */}
        <svg
          viewBox="0 0 20 12"
          data-wood="knot"
          className="absolute bottom-3 left-[18%] h-3 w-5"
          focusable="false"
        >
          <ellipse
            cx="10"
            cy="6"
            rx="8"
            ry="4.5"
            className="fill-forest-bark-shade stroke-ink stroke-outline"
          />
          <ellipse cx="10" cy="6" rx="3.5" ry="1.8" className="fill-ink" />
        </svg>
        {nail("left")}
        {nail("right")}
        <GrassStrip className="absolute inset-x-3 -bottom-1 h-5 fill-pitch-dark" />
      </div>
      <h2
        id={headingId}
        className="relative font-heading text-2xl tracking-wider text-parchment [text-shadow:-1px_-2px_0_var(--color-ink),1px_1.5px_0_var(--color-forest-bark-light)] md:text-3xl"
      >
        {title}
      </h2>
    </div>
  );
}
