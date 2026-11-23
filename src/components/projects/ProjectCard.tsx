import Image from "next/image";
import type { Project } from "@/content/projects";
import GrassStrip from "../GrassStrip";

const link =
  "relative z-10 pixel-button bg-gold-500 px-3 py-0.5 font-heading text-xl leading-tight tracking-wide uppercase text-ink hover:bg-gold-400 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600";

/**
 * One project card (spec 006 US-1): preview image, title, summary, tech tags
 * and the live / repository links that exist, in a Stardew-style paper menu
 * box (`ink` on `parchment`, a wooden pixel frame) with pixel grass along its
 * bottom edge.
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
      className="group relative flex h-full flex-col pixel-frame-paper p-[calc(4*var(--px))] pb-[calc(9*var(--px))] text-ink hover:-translate-y-[var(--px)] has-[a[data-open]:focus-visible]:outline-3 has-[a[data-open]:focus-visible]:outline-offset-8 has-[a[data-open]:focus-visible]:outline-red-600 motion-reduce:hover:translate-y-0"
    >
      <div className="overflow-hidden shadow-[0_0_0_var(--px)_var(--color-wood-700)]">
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
      <div className="flex flex-1 flex-col gap-2.5 px-2 pt-3">
        <h3 className="font-heading text-3xl leading-none tracking-wide">
          <a
            href={`#project-${slug}`}
            data-open=""
            aria-label={`${title} — view details`}
            className="outline-none after:absolute after:inset-0"
          >
            {title}
          </a>
        </h3>
        <p className="font-body text-base leading-relaxed">{summary}</p>
        <ul aria-label="Tech stack" className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <li
              key={t}
              className="bg-paper-300 px-1.5 font-body text-sm shadow-[0_0_0_calc(var(--px)*0.5)_var(--color-wood-500)]"
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
      <GrassStrip className="pointer-events-none absolute inset-x-0 -bottom-[calc(2*var(--px))]" />
    </article>
  );
}
