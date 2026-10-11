"use client";

import { useState } from "react";
import { projects as allProjects, type Project } from "@/content/projects";
import ProjectGrid from "./ProjectGrid";
import {
  ALL,
  countLabel,
  filterOptions,
  filterProjects,
  type ProjectFilter,
} from "./projectFilters";

const base =
  "rounded-pill border-outline border-ink px-4 py-1.5 font-heading text-base shadow-[2px_3px_0_var(--color-ink)] transition-transform focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cartoon-yellow motion-reduce:transition-none";
// Both states are allowed text pairs in manifest §6.
const active = "bg-pitch-dark text-chalk";
const inactive =
  "bg-parchment text-ink hover:-translate-y-0.5 hover:bg-cartoon-yellow";

/**
 * The projects grid with category filters (spec 006 US-3): "All" and one button
 * per category in `src/content/projects.ts`. The active filter is highlighted
 * and has `aria-pressed="true"`, and the number of projects shown is announced
 * politely to screen readers.
 */
export default function ProjectBrowser({
  projects = allProjects,
}: {
  projects?: Project[];
}) {
  const [filter, setFilter] = useState<ProjectFilter>(ALL);
  const [announcement, setAnnouncement] = useState("");
  const visible = filterProjects(projects, filter);

  const choose = (next: ProjectFilter) => {
    setFilter(next);
    setAnnouncement(countLabel(filterProjects(projects, next).length));
  };

  return (
    <div className="flex flex-col gap-6">
      <div
        role="group"
        aria-label="Filter projects by category"
        data-project-filters=""
        className="flex flex-wrap justify-center gap-2.5"
      >
        {filterOptions(projects).map((option) => {
          const pressed = option === filter;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={pressed}
              onClick={() => choose(option)}
              className={`${base} ${pressed ? active : inactive}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p
        role="status"
        aria-live="polite"
        data-filter-status=""
        className="sr-only"
      >
        {announcement}
      </p>
      <ProjectGrid projects={visible} />
    </div>
  );
}
