import CharacterSprite from "./parts/CharacterSprite";

/** An old tree with a scowling face in its trunk and branch arms. Pixel art (spec 001 US-4). */
export default function FaceTree({ className }: { className?: string }) {
  return <CharacterSprite name="face-tree" className={className} />;
}
