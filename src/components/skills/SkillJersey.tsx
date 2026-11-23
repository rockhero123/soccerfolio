import type { CSSProperties } from "react";
import type { Skill } from "@/content/skills";
import PixelArt from "../pixel/PixelArt";
import { JERSEY, SHIRT } from "./jerseyArt";
import SkillLogoIcon from "./SkillLogoIcon";

/**
 * One skill as a player's jersey (spec 004 US-1), in pixel art: a `pitch-dark`
 * shirt with chalk collar and cuffs, the skill name in `chalk` on the chest
 * (an allowed pair in manifest §6) and the official logo, pixelated, below it
 * on a round parchment badge. The name is real text; the shirt and logo are
 * decorative.
 */
export default function SkillJersey({ skill }: { skill: Skill }) {
  // The name never breaks inside a word: its size follows the longest word,
  // so "JavaScript" shrinks to fit while "React" stays big.
  const longestWord = Math.max(...skill.name.split(" ").map((w) => w.length));
  return (
    <div
      data-skill={skill.name}
      className="relative"
      style={{
        width: `calc(${JERSEY.width} * var(--px))`,
        height: `calc(${JERSEY.height} * var(--px))`,
      }}
    >
      <PixelArt
        art={SHIRT}
        className="absolute inset-0 drop-shadow-[var(--px)_var(--px)_0_color-mix(in_oklab,var(--color-ink)_40%,transparent)]"
        data={{ "data-jersey": "shirt" }}
      />
      <div className="absolute inset-x-[calc(2*var(--px))] top-[calc(5*var(--px))] md:inset-x-[calc(5*var(--px))] bottom-[calc(2*var(--px))] flex flex-col items-center justify-start gap-[var(--px)] text-center">
        <span
          data-jersey="name"
          style={{ "--chars": Math.max(longestWord, 5) } as CSSProperties}
          className="block w-full font-heading text-[clamp(0.75rem,calc(var(--px)*38/var(--chars)),1.35rem)] leading-[0.95] tracking-wide text-chalk"
        >
          {skill.name}
        </span>
        <SkillLogoIcon logo={skill.logo} />
      </div>
    </div>
  );
}
