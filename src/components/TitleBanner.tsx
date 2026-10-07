import GrassStrip from "./GrassStrip";

type TitleBannerProps = {
  title: string;
  /** Id for the heading, so its section can be labelled by it. */
  headingId: string;
  /**
   * `dark`: a `pitch-dark` banner with `chalk` text, for the bright grass.
   * `bright`: a `pitch` banner with `ink` text, for the dark contact grass.
   * Both pairs are allowed text colours in manifest §6.
   */
  tone?: "dark" | "bright";
};

const tones = {
  dark: { banner: "bg-pitch-dark text-chalk", grass: "fill-forest-deep" },
  bright: { banner: "bg-pitch text-ink", grass: "fill-pitch-dark" },
} as const;

/**
 * A section title banner (spec 001 US-6): a rubber-hose sign with a bold ink
 * outline and a cartoon drop shadow, with a strip of grass growing along its
 * bottom edge (`GrassStrip`, from `design_2.ai.pdf`).
 */
export default function TitleBanner({
  title,
  headingId,
  tone = "dark",
}: TitleBannerProps) {
  const t = tones[tone];
  return (
    <div
      data-title-banner={tone}
      className={`relative mx-auto w-fit min-w-[min(100%,16rem)] overflow-hidden rounded-card border-outline border-ink px-8 pt-2 pb-6 text-center shadow-[4px_4px_0_var(--color-ink)] ${t.banner}`}
    >
      <h2
        id={headingId}
        className="font-heading text-2xl tracking-wide md:text-3xl"
      >
        {title}
      </h2>
      <GrassStrip className={`absolute inset-x-0 bottom-0 h-4 ${t.grass}`} />
    </div>
  );
}
