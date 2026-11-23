import CharacterSprite from "./parts/CharacterSprite";

/** A sweet little acorn with a cross-hatched cap and blushing cheeks. Pixel art (spec 001 US-4). */
export default function Acorn({ className }: { className?: string }) {
  return <CharacterSprite name="acorn" className={className} />;
}
