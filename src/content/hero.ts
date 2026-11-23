import { site } from "./site";

/**
 * Hero content (spec 002).
 */
export const hero = {
  name: site.name,
  nickname: "Richi",
  role: site.role,
  // Final copy from the owner: first paragraph of the profile in his CV.
  intro:
    "Software Engineer with seven years of experience crafting intuitive, user-centered interfaces across the logistics, entertainment, and tourism industries. At a leading software development consultancy, he contributed to projects for clients including Disney, delivering creative solutions that balance aesthetics with usability.",
  portrait: {
    label:
      "Cartoon portrait of Ricardo Martinez as a speedy vintage soccer player in a yellow Colombia shirt, with a roguish grin",
  },
} as const;
