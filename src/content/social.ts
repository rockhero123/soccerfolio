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

export type ContactKind = "phone" | "email" | "linkedin" | "github";

export type ContactItem = {
  kind: ContactKind;
  /** Visible label, e.g. "Email". */
  label: string;
  /** Visible value, e.g. the address. */
  value: string;
  href: string;
  /** Opens in a new tab. */
  external: boolean;
};

/** The contact items on the board, in order (spec 007 US-1). */
export const contactItems: readonly ContactItem[] = [
  {
    kind: "phone",
    label: "Phone",
    value: social.phone.label,
    href: social.phone.href,
    external: false,
  },
  {
    kind: "email",
    label: "Email",
    value: social.email,
    href: `mailto:${social.email}`,
    external: false,
  },
  {
    kind: "linkedin",
    label: "LinkedIn",
    value: social.linkedin.replace(/^https:\/\/www\./, ""),
    href: social.linkedin,
    external: true,
  },
  {
    kind: "github",
    label: "GitHub",
    value: social.github.replace(/^https:\/\//, ""),
    href: social.github,
    external: true,
  },
];
