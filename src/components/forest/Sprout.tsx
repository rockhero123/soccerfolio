import CharacterSprite from "./parts/CharacterSprite";

/** A seedling: a round green bulb with two leaves on top. Pixel art (spec 001 US-4). */
export default function Sprout({ className }: { className?: string }) {
  return <CharacterSprite name="sprout" className={className} />;
}
