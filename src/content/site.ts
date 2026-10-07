/**
 * Site-wide content (spec 001). Section titles are placeholders until the
 * section specs replace them (002 hero, 004 skills, 006 projects, 007 contact).
 */
export const site = {
  name: "Ricardo Martinez",
  shortName: "RM",
  role: "Software Engineer",
  nav: [
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ],
  sections: [
    { id: "hero", title: "Introduction" },
    { id: "skills", title: "Skills" },
    { id: "projects", title: "Projects" },
    { id: "contact", title: "Contact" },
  ],
} as const;

export type SectionId = (typeof site.sections)[number]["id"];
