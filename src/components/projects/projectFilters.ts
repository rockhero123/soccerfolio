import type { Project, ProjectCategory } from "@/content/projects";

export const ALL = "All" as const;
export type ProjectFilter = typeof ALL | ProjectCategory;

/** "All", then every category used by the projects, in order of first appearance. */
export function filterOptions(projects: Project[]): ProjectFilter[] {
  return [ALL, ...new Set(projects.map((p) => p.category))];
}

/** The projects shown for a filter ("All" shows every project). */
export function filterProjects(
  projects: Project[],
  filter: ProjectFilter,
): Project[] {
  return filter === ALL
    ? projects
    : projects.filter((p) => p.category === filter);
}

/** What screen readers hear after a filter change, e.g. "3 projects". */
export function countLabel(count: number): string {
  return `${count} ${count === 1 ? "project" : "projects"}`;
}
