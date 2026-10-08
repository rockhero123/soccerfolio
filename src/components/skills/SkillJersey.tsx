import type { CSSProperties } from "react";
import type { Skill } from "@/content/skills";
import SkillLogoIcon from "./SkillLogoIcon";

/** A cartoon soccer shirt with short sleeves and a round collar, 120 × 128. */
const SHIRT =
  "M38 6Q60 18 82 6L114 22Q119 25 117 30L106 50Q103 55 98 52L94 50V118Q94 124 88 124H32Q26 124 26 118V50L22 52Q17 55 14 50L3 30Q1 25 6 22Z";

/**
 * One skill as a player's jersey (spec 004 US-1): a `pitch-dark` shirt with a
 * bold ink outline, the skill name in `chalk` on the chest (an allowed pair in
 * manifest §6) and the official logo below it on a round parchment badge.
 * The name is real text; the shirt and logo are decorative.
 */
export default function SkillJersey({ skill }: { skill: Skill }) {
  // The name never breaks inside a word: its size follows the longest word,
  // so "JavaScript" shrinks to fit while "React" stays big.
  const longestWord = Math.max(...skill.name.split(" ").map((w) => w.length));
  return (
    <div
      data-skill={skill.name}
      className="relative aspect-[120/128] w-full max-w-[8.5rem] [container-type:inline-size]"
    >
      <svg
        viewBox="0 0 120 128"
        aria-hidden="true"
        focusable="false"
        data-jersey="shirt"
        className="absolute inset-0 size-full overflow-visible drop-shadow-[2px_3px_0_var(--color-ink)]"
      >
        <path
          d={SHIRT}
          className="fill-pitch-dark stroke-ink stroke-outline-lg"
          strokeLinejoin="round"
        />
        {/* Collar, and cuffs running parallel to the sleeve openings. */}
        <path
          d="M38 6Q60 18 82 6"
          className="fill-none stroke-chalk [stroke-width:calc(var(--stroke-width-outline)*1.3)]"
          strokeLinecap="round"
        />
        <path
          d="M7.5 29L17.5 47.5M112.5 29L102.5 47.5"
          className="fill-none stroke-chalk stroke-outline"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-x-[11%] top-[24%] bottom-[8%] flex flex-col items-center justify-start gap-[6cqw] text-center">
        <span
          data-jersey="name"
          style={{ "--chars": Math.max(longestWord, 5) } as CSSProperties}
          className="block w-full font-heading text-[clamp(0.75rem,calc(118cqw/var(--chars)),1.05rem)] leading-[1.05] text-chalk"
        >
          {skill.name}
        </span>
        <span className="grid aspect-square w-[52%] place-items-center rounded-full border-outline border-ink bg-parchment">
          <SkillLogoIcon logo={skill.logo} className="size-[64%]" />
        </span>
      </div>
    </div>
  );
}
