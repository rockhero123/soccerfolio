import { hero } from "@/content/hero";
import WoodPlank, { engravedReadable } from "./WoodPlank";

/**
 * The hero's introduction sign (spec 002 US-3): a pixel-art wooden plank like
 * the section title banners, coming out from behind the enchanted mirror, with
 * the introduction burned into the light wood — `ink` on light wood, ≥ 6:1 —
 * at a comfortable reading size, with a light-wood halo around each letter so
 * the board seams never cross the strokes.
 */
export default function IntroSign() {
  return (
    <div
      data-intro-sign=""
      className="relative -mt-10 w-full max-w-[40rem] px-12 pt-20 pb-14 md:mt-0 md:-ml-12 md:py-14 md:pr-16 md:pl-24"
    >
      <WoodPlank />
      <p
        className={`relative font-body text-xl leading-relaxed font-medium md:text-2xl ${engravedReadable}`}
      >
        {hero.intro}
      </p>
    </div>
  );
}
