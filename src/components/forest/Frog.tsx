import CharacterSprite from "./parts/CharacterSprite";

/** A wide-mouthed frog with eyes on top of its head. Pixel art (spec 001 US-4). */
export default function Frog({ className }: { className?: string }) {
  return <CharacterSprite name="frog" className={className} />;
}
