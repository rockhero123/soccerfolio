import type { SkillLogo } from "@/content/skills";
import PixelArt from "../pixel/PixelArt";
import { BADGES } from "./jerseyArt";

/**
 * One skill's official logo, pixelated on a round parchment badge. Decorative
 * (the skill name is already text next to it). Drawn in `ink`; any cut-outs
 * (Kiro's eyes) in `parchment`.
 */
export default function SkillLogoIcon({
  logo,
  className = "",
}: {
  logo: SkillLogo;
  className?: string;
}) {
  return (
    <PixelArt
      art={BADGES[logo]}
      className={className}
      data={{ "data-skill-logo": logo }}
    />
  );
}
