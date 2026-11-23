import CharacterSprite from "./parts/CharacterSprite";

/** A red-capped toadstool with white spots and a big grin on its stem. Pixel art (spec 001 US-4). */
export default function Mushroom({ className }: { className?: string }) {
  return <CharacterSprite name="mushroom" className={className} />;
}
