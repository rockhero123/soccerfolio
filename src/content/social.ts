/**
 * Ricardo's contact details (spec 007), from his CV. The owner chose to show
 * the phone and email publicly.
 */
export const social = {
  phone: { label: "+57 310 591 1019", href: "tel:+573105911019" },
  email: "ricardo.martinezc10@gmail.com",
  linkedin: "https://www.linkedin.com/in/ricardomartinez10",
  github: "https://github.com/rockhero123",
} as const;

/** The invitation painted on the grass above the contact signs. */
export const contactInvite =
  "Want to build something together, or just talk football?";

export type ContactKind = "phone" | "email" | "linkedin" | "github";

/** Where a sign stands in the lineup: two midfielders, then two forwards. */
export type ContactLine = "midfielders" | "forwards";

export type ContactItem = {
  kind: ContactKind;
  /** Visible label, e.g. "Email". */
  label: string;
  /** Visible value, e.g. the address. */
  value: string;
  href: string;
  /** Opens in a new tab. */
  external: boolean;
  line: ContactLine;
};

/**
 * The contact signs, in order (spec 007 US-1): phone and email are the
 * midfielders (top row, close together), LinkedIn and GitHub the forwards
 * (bottom row, wide apart). Within a line, the first one is on the left.
 */
export const contactItems: readonly ContactItem[] = [
  {
    kind: "phone",
    label: "Phone",
    value: social.phone.label,
    href: social.phone.href,
    external: false,
    line: "midfielders",
  },
  {
    kind: "email",
    label: "Email",
    value: social.email,
    href: `mailto:${social.email}`,
    external: false,
    line: "midfielders",
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    value: social.linkedin.replace(/^https:\/\/www\./, ""),
    href: social.linkedin,
    external: true,
    line: "forwards",
  },
  {
    kind: "github",
    label: "GitHub",
    value: social.github.replace(/^https:\/\//, ""),
    href: social.github,
    external: true,
    line: "forwards",
  },
];
