"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects as allProjects, type Project } from "@/content/projects";

const HASH_PREFIX = "#project-";

const link =
  "rounded-pill border-outline border-ink bg-parchment px-4 py-1.5 font-heading text-ink hover:bg-cartoon-yellow focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cartoon-yellow";

/** The project whose detail is asked for in the URL (`#project-<slug>`), if any. */
function projectFromHash(list: Project[]): Project | undefined {
  if (typeof window === "undefined") return undefined;
  const hash = window.location.hash;
  if (!hash.startsWith(HASH_PREFIX)) return undefined;
  const slug = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return list.find((p) => p.slug === slug);
}

/**
 * The project detail modal (spec 006 US-2). It opens when the URL points at a
 * project (`#project-<slug>`, the link every card sets), so details can be
 * linked to, and it is a native modal `<dialog>`: focus moves inside and stays
 * there, the page behind is inert, and Escape closes it.
 *
 * It shows the title, full description, date, client, category, tech, the
 * live/repo links that exist and the portrait images (or the preview when a
 * project has none). The content scrolls inside the panel while the page
 * behind stays still. The X button, Escape and a click on the backdrop close
 * it, and focus returns to the card that opened it.
 */
export default function ProjectModal({
  projects = allProjects,
}: {
  projects?: Project[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [project, setProject] = useState<Project | undefined>(undefined);

  useEffect(() => {
    const sync = () => setProject(projectFromHash(projects));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [projects]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
      // Start keyboard users on the Close button, inside the dialog.
      closeRef.current?.focus();
    }
  }, [project]);

  /** Clear the URL, unlock the page and give focus back to the card. */
  const close = useCallback(() => {
    const dialog = dialogRef.current;
    const slug = project?.slug;
    if (dialog?.open) dialog.close();
    document.documentElement.style.overflow = "";
    history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
    setProject(undefined);
    if (slug) {
      document
        .querySelector<HTMLAnchorElement>(`a[href="${HASH_PREFIX}${slug}"]`)
        ?.focus();
    }
  }, [project]);

  const images = project
    ? project.portraits.length > 0
      ? project.portraits
      : [project.image]
    : [];
  const titleId = project ? `project-modal-title-${project.slug}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      data-project-modal={project?.slug ?? ""}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the <dialog> itself, outside the panel.
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto max-h-[min(90dvh,56rem)] w-[min(calc(100vw-2rem),48rem)] overflow-visible bg-transparent p-0 backdrop:bg-ink/70"
    >
      {project && (
        <div
          data-modal-panel=""
          className="relative max-h-[min(90dvh,56rem)] overflow-y-auto overscroll-contain rounded-card border-outline-lg border-ink bg-mint text-ink shadow-[6px_7px_0_var(--color-ink)]"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="sticky top-3 z-10 float-right mt-3 mr-3 grid size-11 place-items-center rounded-full border-outline border-ink bg-parchment shadow-[2px_3px_0_var(--color-ink)] hover:bg-cartoon-yellow focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cartoon-yellow"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="size-5"
            >
              <path
                d="M5 5L19 19M19 5L5 19"
                className="fill-none stroke-ink [stroke-width:calc(var(--stroke-width-outline)*1.2)]"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="px-5 pt-5 pb-7 md:px-8 md:pt-7">
            <p className="font-heading text-sm tracking-wide">
              {project.category}
            </p>
            <h2
              id={titleId}
              className="mt-1 pr-14 font-heading text-3xl md:text-4xl"
            >
              {project.title}
            </h2>

            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-body">
              <dt className="font-semibold">Date</dt>
              <dd>{project.date}</dd>
              <dt className="font-semibold">Client</dt>
              <dd>{project.client}</dd>
            </dl>

            <p className="mt-4 font-body text-lg leading-relaxed">
              {project.description}
            </p>

            <ul aria-label="Tech stack" className="mt-4 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <li
                  key={t}
                  className="rounded-pill border-2 border-ink bg-chalk px-2.5 py-0.5 font-body text-sm font-semibold"
                >
                  {t}
                </li>
              ))}
            </ul>

            {(project.liveUrl || project.repoUrl) && (
              <div className="mt-5 flex flex-wrap gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    Live site
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={link}
                  >
                    Code<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}

            <div data-modal-images="" className="mt-6 flex flex-col gap-4">
              {images.map((image) => (
                <Image
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 768px) 44rem, 92vw"
                  className="h-auto w-full rounded-card border-outline border-ink"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
