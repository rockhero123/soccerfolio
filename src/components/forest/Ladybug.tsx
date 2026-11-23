import CharacterSprite from "./parts/CharacterSprite";

/** A shiny ladybug peeking out with big white eyes. Pixel art (spec 001 US-4). */
export default function Ladybug({ className }: { className?: string }) {
  return <CharacterSprite name="ladybug" className={className} />;
}
