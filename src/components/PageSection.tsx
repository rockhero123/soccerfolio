import type { ReactNode } from "react";
import TitleBanner from "./TitleBanner";

type PageSectionProps = {
  id: string;
  title: string;
  /**
   * Keep the `<h2>` for screen readers and the page outline, but draw no
   * wooden banner: the section's own content stands in for it (the contact
   * section's CONTACT ingot, spec 900 US-3).
   */
  titleHidden?: boolean;
  children?: ReactNode;
};

/**
 * One page section (spec 001 US-6): a `<section id>` that starts with its `<h2>`
 * engraved on a wooden title banner and is labelled by it. Generous padding
 * separates sections, and a clear gap separates the banner from the content.
 */
export default function PageSection({ id, title, titleHidden = false, children }: PageSectionProps) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex scroll-mt-4 flex-col gap-10 py-10 md:gap-14 md:py-16"
    >
      {titleHidden ? (
        <h2 id={headingId} className="sr-only">
          {title}
        </h2>
      ) : (
        <TitleBanner title={title} headingId={headingId} />
      )}
      {children}
    </section>
  );
}
