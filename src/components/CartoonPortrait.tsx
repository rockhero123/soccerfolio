import { hero } from "@/content/hero";
import PixelArt from "./pixel/PixelArt";
import { PORTRAIT, PORTRAIT_CIRCLE } from "./hero/portraitArt";

export { PORTRAIT_CIRCLE };

/**
 * The hero's portrait of Ricardo (spec 002 US-1): an original, static,
 * hand-coded pixel-art bust in the style of a farming-RPG character portrait.
 * He keeps his own features — short dark hair, a moustache and a partial beard
 * along the jaw, strong brows, dark eyes and big ears — with a toothy smirk, in
 * the yellow Colombia shirt. A green sunburst, speed lines, excitement marks
 * and puffs of smoke show he is fast.
 *
 * Everything sits inside a circle except the hair, the excitement marks and
 * the smoke, which break out over its edge. The portrait is meaningful, so it
 * is exposed as one image with a label; the pixels themselves are hidden.
 */
export default function CartoonPortrait({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={hero.portrait.label}
      data-portrait=""
      className={className}
    >
      <PixelArt art={PORTRAIT} />
    </div>
  );
}
