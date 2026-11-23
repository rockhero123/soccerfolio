import CharacterSprite from "./parts/CharacterSprite";

/** A prickly hedgehog with a long pointy snout. Pixel art (spec 001 US-4). */
export default function Hedgehog({ className }: { className?: string }) {
  return <CharacterSprite name="hedgehog" className={className} />;
}
