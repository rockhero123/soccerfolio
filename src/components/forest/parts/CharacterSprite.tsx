import PixelArt from "../../pixel/PixelArt";
import { CHARACTERS, type CharacterName } from "../characterArt";

/**
 * Renders one forest character's pixel sprite at the site's pixel size.
 * Decorative: the forest around it is hidden from assistive tech.
 */
export default function CharacterSprite({
  name,
  className = "",
}: {
  name: CharacterName;
  className?: string;
}) {
  return (
    <PixelArt
      art={CHARACTERS[name]}
      className={className}
      data={{ "data-character": name }}
    />
  );
}
