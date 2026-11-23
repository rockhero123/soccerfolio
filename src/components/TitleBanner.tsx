import GrassStrip from "./GrassStrip";
import WoodPlank, { engraved } from "./WoodPlank";

type TitleBannerProps = {
  title: string;
  /** Id for the heading, so its section can be labelled by it. */
  headingId: string;
};

/**
 * A section title banner (spec 001 US-6): a pixel-art wooden sign nailed up on
 * the field, with the `<h2>` burned into the light wood and a strip of pixel
 * grass (`GrassStrip`) growing in front of its bottom edge.
 */
export default function TitleBanner({ title, headingId }: TitleBannerProps) {
  return (
    <div
      data-title-banner="wood"
      className="relative mx-auto w-fit min-w-[min(100%,16rem)] px-14 pt-2 pb-6 text-center"
    >
      <WoodPlank>
        <GrassStrip className="absolute inset-x-2 -bottom-[calc(2*var(--px))]" />
      </WoodPlank>
      <h2
        id={headingId}
        className={`relative font-heading text-4xl leading-none tracking-wide uppercase md:text-5xl ${engraved}`}
      >
        {title}
      </h2>
    </div>
  );
}
