import Acorn from "./forest/Acorn";
import Bee from "./forest/Bee";
import Bird from "./forest/Bird";
import Caterpillar from "./forest/Caterpillar";
import Daisy from "./forest/Daisy";
import FaceTree from "./forest/FaceTree";
import Frog from "./forest/Frog";
import Hedgehog from "./forest/Hedgehog";
import Ladybug from "./forest/Ladybug";
import Mushroom from "./forest/Mushroom";
import Owl from "./forest/Owl";
import Pinecone from "./forest/Pinecone";
import Snail from "./forest/Snail";
import Sprout from "./forest/Sprout";
import Stump from "./forest/Stump";
import Tulip from "./forest/Tulip";


/**
 * The pixel-art characters living in the forest around the field (spec 001 US-4).
 * - Top band (canopy) and bottom band (ground): ten characters, at every width,
 *   so at least ten stay visible on mobile.
 * - Side panels (≥ 1024px): six more, spread down the whole height of the
 *   page beside the field.
 * The top band and the side panels are scattered, never lined up (uneven
 * gaps, different heights, the side panels staggered against each other);
 * the bottom band stands in a row on the ground.
 * Every group sits inside its forest area (sized by `--forest-band` /
 * `--forest-side`), so characters never overlap the field.
 * Rendered inside `ForestBackground`, so they are decorative and hidden too.
 */
export default function ForestCharacters() {
  return (
    <>
      <div
        data-forest-characters="top"
        className="absolute inset-x-0 top-0 flex h-(--forest-band) items-end justify-between px-2 pb-[calc(3*var(--px))] [--px:2px] md:[--px:3px]"
      >
        {/* Drawn at a smaller pixel size, so they stand clear of the header
            sign; scattered (uneven gaps and heights) so they look natural. The
            three under the sign stay low. */}
        <Acorn className="mb-7 ml-[3%]" />
        <Owl className="mb-1 ml-[7%]" />
        <Bird className="mr-[9%]" />
        <Bee className="mb-2 ml-[2%]" />
        <Caterpillar className="mr-[5%] mb-10" />
      </div>

      <div
        data-forest-characters="bottom"
        className="absolute inset-x-0 bottom-0 flex h-(--forest-band) items-end justify-evenly px-2 pb-2"
      >
        {/* Lined up on the ground, evenly spaced (owner decision). */}
        <Mushroom />
        <Daisy />
        <Snail />
        <Frog />
        <Sprout />
      </div>

      <div
        data-forest-characters="left"
        className="absolute top-(--forest-band) bottom-(--forest-band) left-0 hidden w-(--forest-side) flex-col items-center justify-around py-24 lg:flex"
      >
        {/* Off-centre, at uneven heights: never in a straight column. */}
        <FaceTree className="relative top-0 self-start" />
        <Hedgehog className="relative top-[12rem] mr-2 self-end" />
        <Pinecone className="relative -top-[6rem] ml-6 self-start" />
      </div>

      <div
        data-forest-characters="right"
        className="absolute top-(--forest-band) bottom-(--forest-band) right-0 hidden w-(--forest-side) flex-col items-center justify-around pt-[28rem] pb-12 lg:flex"
      >
        {/* Staggered against the left panel, so no two share a height. */}
        <Stump className="relative top-[4rem] mr-3 self-end" />
        <Tulip className="relative -top-[8rem] ml-4 self-start" />
        <Ladybug className="relative top-[10rem] self-center" />
      </div>
    </>
  );
}
