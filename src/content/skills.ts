/**
 * The skills team (spec 004): eleven players in a 1-4-3-3 formation.
 * Order inside each line = left to right on the board.
 */
export type SkillLine = "goalkeeper" | "defenders" | "midfielders" | "forwards";

export type SkillLogo =
  | "javascript"
  | "typescript"
  | "react"
  | "angular"
  | "nodejs"
  | "html"
  | "css"
  | "scss"
  | "mongodb"
  | "kiro"
  | "claude-code";

export type Skill = {
  /** Shown on the jersey. */
  name: string;
  /** Key of the inline SVG logo. */
  logo: SkillLogo;
  line: SkillLine;
};

export const skills: Skill[] = [
  { name: "React", logo: "react", line: "forwards" },
  { name: "Claude Code", logo: "claude-code", line: "forwards" },
  { name: "Kiro Code", logo: "kiro", line: "forwards" },
  { name: "JavaScript", logo: "javascript", line: "midfielders" },
  { name: "TypeScript", logo: "typescript", line: "midfielders" },
  { name: "Angular", logo: "angular", line: "midfielders" },
  { name: "CSS", logo: "css", line: "defenders" },
  { name: "SCSS", logo: "scss", line: "defenders" },
  { name: "MongoDB", logo: "mongodb", line: "defenders" },
  { name: "Node.js", logo: "nodejs", line: "defenders" },
  { name: "HTML", logo: "html", line: "goalkeeper" },
];
