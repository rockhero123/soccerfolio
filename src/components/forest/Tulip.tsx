import CharacterSprite from "./parts/CharacterSprite";

/** A snappy red tulip with a toothy grin. Pixel art (spec 001 US-4). */
export default function Tulip({ className }: { className?: string }) {
  return <CharacterSprite name="tulip" className={className} />;
}
