import CharacterSprite from "./parts/CharacterSprite";

/** A daisy with a smiling face in its golden heart. Pixel art (spec 001 US-4). */
export default function Daisy({ className }: { className?: string }) {
  return <CharacterSprite name="daisy" className={className} />;
}
