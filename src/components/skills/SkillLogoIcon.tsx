import type { SkillLogo } from "@/content/skills";
import { SKILL_LOGOS } from "./skillLogos";

/**
 * One skill's official logo, inline and decorative (the skill name is already
 * text next to it). Drawn in `ink`; any cut-outs (Kiro's eyes) in `parchment`.
 */
export default function SkillLogoIcon({
  logo,
  className = "",
}: {
  logo: SkillLogo;
  className?: string;
}) {
  const { viewBox, d, cut } = SKILL_LOGOS[logo];
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      data-skill-logo={logo}
      className={`block ${className}`}
    >
      <path d={d} className="fill-ink" />
      {cut && <path d={cut} className="fill-parchment" />}
    </svg>
  );
}
