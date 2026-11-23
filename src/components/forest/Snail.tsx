import CharacterSprite from "./parts/CharacterSprite";

/** A dreamy snail with eyes on stalks and a spiral shell. Pixel art (spec 001 US-4). */
export default function Snail({ className }: { className?: string }) {
  return <CharacterSprite name="snail" className={className} />;
}
