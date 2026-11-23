import CharacterSprite from "./parts/CharacterSprite";

/** A round red bird with a huge, worried pair of eyes. Pixel art (spec 001 US-4). */
export default function Bird({ className }: { className?: string }) {
  return <CharacterSprite name="bird" className={className} />;
}
