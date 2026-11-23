import CharacterSprite from "./parts/CharacterSprite";

/** A long caterpillar with a toothy, cheeky grin. Pixel art (spec 001 US-4). */
export default function Caterpillar({ className }: { className?: string }) {
  return <CharacterSprite name="caterpillar" className={className} />;
}
