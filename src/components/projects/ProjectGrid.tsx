import { projects as allProjects, type Project } from "@/content/projects";
import ProjectCard from "./ProjectCard";

/**
 * The projects grid (spec 006 US-1): one card per project from
 * `src/content/projects.ts` — 1 column on phones, 2 from 768px, 3 from 1280px, in compact cards.
 */
export default function ProjectGrid({
  projects = allProjects,
}: {
  projects?: Project[];
}) {
  return (
    <ul
      data-project-grid=""
      className="mx-auto grid max-w-sm grid-cols-1 gap-6 md:max-w-2xl md:grid-cols-2 xl:max-w-[58rem] xl:grid-cols-3"
    >
      {projects.map((project) => (
        <li key={project.slug}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}
