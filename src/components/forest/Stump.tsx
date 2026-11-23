import CharacterSprite from "./parts/CharacterSprite";

/** A grumpy tree stump with rings on top and a sprout on the side. Pixel art (spec 001 US-4). */
export default function Stump({ className }: { className?: string }) {
  return <CharacterSprite name="stump" className={className} />;
}
