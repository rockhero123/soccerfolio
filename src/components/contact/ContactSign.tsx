import type { ContactItem } from "@/content/social";
import PixelArt from "../pixel/PixelArt";
import WoodPlank from "../WoodPlank";
import { CONTACT_ICONS } from "./contactArt";
import LeafGarland from "./LeafGarland";

/**
 * One contact sign (spec 007 US-1): its own light pixel wooden plank with a
 * garland of leaves at its foot, showing a pixel icon, the label and the
 * value burned into the wood in `ink`. The whole sign is one link.
 */
export default function ContactSign({ item }: { item: ContactItem }) {
  const { kind, label, value, href, external } = item;
  return (
    <a
      href={href}
      data-contact={kind}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group relative block w-full max-w-[19rem] px-8 pt-5 pb-9 text-ink hover:-translate-y-[var(--px)] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600 motion-reduce:hover:translate-y-0"
    >
      <WoodPlank>
        <LeafGarland className="absolute inset-x-0 -bottom-[calc(7*var(--px))] h-[calc(12*var(--px))]" />
      </WoodPlank>
      <span className="relative flex items-center gap-3">
        <span className="pixel-button grid shrink-0 place-items-center bg-paper-200 p-[calc(2*var(--px))]">
          <PixelArt
            art={CONTACT_ICONS[kind]}
            data={{ "data-contact-icon": kind }}
          />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="font-heading text-2xl leading-none tracking-wide uppercase">
            {label}
          </span>
          <span className="font-body text-base font-medium [overflow-wrap:anywhere] group-hover:underline">
            {breakable(value)}
          </span>
        </span>
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** Lets long values (the email, the URLs) wrap after "@" and "/" first. */
function breakable(value: string) {
  return value
    .split(/(?<=[@/])/)
    .flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]));
}
