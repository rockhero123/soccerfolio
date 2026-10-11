import Image from "next/image";
import type { Project } from "@/content/projects";
import GrassStrip from "../GrassStrip";

const link =
  "relative z-10 rounded-pill border-outline border-ink bg-parchment px-3 py-1 font-heading text-sm text-ink underline-offset-2 hover:bg-cartoon-yellow focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-cartoon-yellow";

/**
 * One project card (spec 006 US-1): preview image, title, summary, tech tags
 * and the live / repository links that exist, on a `mint` surface with an ink
 * outline and tall grass along its bottom edge.
 *
 * The whole card opens the project's detail view: the title is a link to
 * `#project-<slug>` whose hit area is stretched over the card, so there are no
 * nested interactive elements and the live/repo links (raised above it) still
 * work on their own.
 */
export default function ProjectCard({ project }: { project: Project }) {
  const { slug, title, summary, tech, image, liveUrl, repoUrl } = project;
  return (
    <article
      data-project={slug}
      className="group relative flex h-full flex-col rounded-card border-outline-lg border-ink bg-mint pb-8 text-ink shadow-[4px_5px_0_var(--color-ink)] transition-transform hover:-translate-y-1 has-[a[data-open]:focus-visible]:outline-3 has-[a[data-open]:focus-visible]:outline-offset-4 has-[a[data-open]:focus-visible]:outline-cartoon-yellow motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="overflow-hidden rounded-t-[calc(var(--radius-card)-4px)] border-b-outline border-ink">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="lazy"
          sizes="(min-width: 1280px) 18rem, (min-width: 768px) 21rem, 24rem"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-4 pt-3">
        <h3 className="font-heading text-xl">
          <a
            href={`#project-${slug}`}
            data-open=""
            aria-label={`${title} — view details`}
            className="outline-none after:absolute after:inset-0 after:rounded-card"
          >
            {title}
          </a>
        </h3>
        <p className="font-body text-[0.95rem] leading-relaxed">{summary}</p>
        <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <li
              key={t}
              className="rounded-pill border-2 border-ink bg-chalk px-2 py-0.5 font-body text-xs font-semibold"
            >
              {t}
            </li>
          ))}
        </ul>
        {(liveUrl || repoUrl) && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Live site
                <span className="sr-only">
                  {" "}
                  of {title} (opens in a new tab)
                </span>
              </a>
            )}
            {repoUrl && (
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={link}
              >
                Code
                <span className="sr-only">
                  {" "}
                  of {title} (opens in a new tab)
                </span>
              </a>
            )}
          </div>
        )}
      </div>
      <GrassStrip className="pointer-events-none absolute inset-x-1 -bottom-1 h-7 fill-pitch-dark" />
    </article>
  );
}
