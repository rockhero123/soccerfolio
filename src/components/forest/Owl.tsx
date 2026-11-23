import CharacterSprite from "./parts/CharacterSprite";

/** A stern, wise old owl with ear tufts and enormous ringed eyes. Pixel art (spec 001 US-4). */
export default function Owl({ className }: { className?: string }) {
  return <CharacterSprite name="owl" className={className} />;
}
