import GrassStrip from "./GrassStrip";
import WoodPlank, { engraved } from "./WoodPlank";

type TitleBannerProps = {
  title: string;
  /** Id for the heading, so its section can be labelled by it. */
  headingId: string;
};

/**
 * A section title banner (spec 001 US-6): a cartoon wooden plank, nailed up in
 * the forest, with the `<h2>` engraved into the wood and grass (`GrassStrip`,
 * from `design_2.ai.pdf`) growing in front of its bottom edge.
 */
export default function TitleBanner({ title, headingId }: TitleBannerProps) {
  return (
    <div
      data-title-banner="wood"
      className="relative mx-auto w-fit min-w-[min(100%,16rem)] px-12 pt-3 pb-7 text-center"
    >
      <WoodPlank>
        <GrassStrip className="absolute inset-x-3 -bottom-1 h-5 fill-pitch-dark" />
      </WoodPlank>
      <h2
        id={headingId}
        className={`relative font-heading text-2xl tracking-wider md:text-3xl ${engraved}`}
      >
        {title}
      </h2>
    </div>
  );
}
