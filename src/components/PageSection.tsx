import type { ReactNode } from "react";
import TitleBanner from "./TitleBanner";

type PageSectionProps = {
  id: string;
  title: string;
  /** Banner tone for the grass the section sits on (see `TitleBanner`). */
  tone?: "dark" | "bright";
  children?: ReactNode;
};

/**
 * One page section (spec 001 US-6): a `<section id>` that starts with its `<h2>`
 * on a title banner and is labelled by it.
 */
export default function PageSection({
  id,
  title,
  tone = "dark",
  children,
}: PageSectionProps) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="flex flex-col gap-6"
    >
      <TitleBanner title={title} headingId={headingId} tone={tone} />
      {children}
    </section>
  );
}
