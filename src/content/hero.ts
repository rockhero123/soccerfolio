import { site } from "./site";

/**
 * Hero content (spec 002). The intro text is added by US-3.
 */
export const hero = {
  name: site.name,
  nickname: "Richi",
  role: site.role,
  portrait: {
    label:
      "Cartoon portrait of Ricardo Martinez as a speedy vintage soccer player in a yellow Colombia shirt, with a roguish grin",
  },
} as const;
