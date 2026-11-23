import CharacterSprite from "./parts/CharacterSprite";

/** A shy pinecone with a sprig of needles. Pixel art (spec 001 US-4). */
export default function Pinecone({ className }: { className?: string }) {
  return <CharacterSprite name="pinecone" className={className} />;
}
