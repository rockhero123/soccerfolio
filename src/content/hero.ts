import { site } from "./site";

/**
 * Hero content (spec 002).
 */
export const hero = {
  name: site.name,
  nickname: "Richi",
  role: site.role,
  // TODO(owner): placeholder introduction, cleaned up from the first draft in
  // spec 002 — replace with the final copy (spec 002 open question).
  intro:
    "Student in the ninth semester of Interactive Media Design at Icesi University, interested in design and development, human–computer interaction (HCI) projects and mobile design.",
  portrait: {
    label:
      "Cartoon portrait of Ricardo Martinez as a speedy vintage soccer player in a yellow Colombia shirt, with a roguish grin",
  },
} as const;
