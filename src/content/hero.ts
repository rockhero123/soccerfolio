import { site } from "./site";

/**
 * Hero content (spec 002).
 */
export const hero = {
  name: site.name,
  nickname: "Richi",
  role: site.role,
  // From the owner's CV (cv_source_data/, professional profile), condensed
  // for the sign.
  intro:
    "Software Engineer with seven years of experience crafting user-centred interfaces for logistics, entertainment and tourism, including projects for Disney. Works with AI-assisted tools like Claude Code and Kiro, Spec-Driven Development, LangGraph agents and MCP integrations.",
  portrait: {
    label:
      "Pixel-art portrait of Ricardo Martinez as a speedy soccer player in a yellow Colombia shirt, with a roguish grin",
  },
} as const;
