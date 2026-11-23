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
 * - Side panels (≥ 1024px): six more, stacked in the forest beside the field.
 * Every group sits inside its forest area (sized by `--forest-band` /
 * `--forest-side`), so characters never overlap the field.
 * Rendered inside `ForestBackground`, so they are decorative and hidden too.
 */
export default function ForestCharacters() {
  return (
    <>
      <div
        data-forest-characters="top"
        className="absolute inset-x-0 top-0 flex h-(--forest-band) items-end justify-evenly px-2 pb-[calc(3*var(--px))] [--px:2px] md:[--px:3px]"
      >
        {/* Drawn at a smaller pixel size, so they stand clear of the header sign. */}
        <Acorn />
        <Owl />
        <Bird />
        <Bee />
        <Caterpillar />
      </div>

      <div
        data-forest-characters="bottom"
        className="absolute inset-x-0 bottom-0 flex h-(--forest-band) items-end justify-evenly px-2 pb-2"
      >
        <Mushroom />
        <Daisy />
        <Snail />
        <Frog />
        <Sprout />
      </div>

      <div
        data-forest-characters="left"
        className="absolute top-(--forest-band) left-0 hidden w-(--forest-side) flex-col items-center gap-10 pt-8 lg:flex"
      >
        <FaceTree />
        <Hedgehog />
        <Pinecone />
      </div>

      <div
        data-forest-characters="right"
        className="absolute top-(--forest-band) right-0 hidden w-(--forest-side) flex-col items-center gap-10 pt-8 lg:flex"
      >
        <Stump />
        <Tulip />
        <Ladybug />
      </div>
    </>
  );
}
