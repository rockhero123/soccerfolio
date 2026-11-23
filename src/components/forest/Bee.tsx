import CharacterSprite from "./parts/CharacterSprite";

/** A plump, grinning bumblebee with glassy wings. Pixel art (spec 001 US-4). */
export default function Bee({ className }: { className?: string }) {
  return <CharacterSprite name="bee" className={className} />;
}
