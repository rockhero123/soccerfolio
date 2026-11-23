import { contactItems, social } from "@/content/social";
import PixelArt from "../pixel/PixelArt";
import WoodPlank from "../WoodPlank";
import { CONTACT_ICONS } from "./contactArt";
import CopyEmailButton from "./CopyEmailButton";
import LeafGarland from "./LeafGarland";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600";

/** Lets long values (the email, the URLs) wrap after "@" and "/" first. */
function breakable(value: string) {
  return value
    .split(/(?<=[@/])/)
    .flatMap((part, i) => (i ? [<wbr key={i} />, part] : [part]));
}

const button = `pixel-button px-4 py-1 font-heading text-2xl leading-tight tracking-wide uppercase text-ink ${focusRing}`;

/**
 * The contact board (spec 007 US-1): a light pixel wooden plank with a garland
 * of leaves along its foot, standing in the dark-grass contact zone. Burned
 * into the wood in `ink`: an invitation, Ricardo's phone, email, LinkedIn and
 * GitHub (each with a small pixel icon), and the email actions.
 */
export default function ContactBoard() {
  return (
    <div
      data-contact-board=""
      className="relative mx-auto mb-[calc(8*var(--px))] w-full max-w-4xl px-7 pt-10 pb-14 md:px-16 md:pt-12 md:pb-16"
    >
      <WoodPlank>
        <LeafGarland className="absolute inset-x-0 -bottom-[calc(7*var(--px))] h-[calc(12*var(--px))]" />
      </WoodPlank>
      <div className="relative flex flex-col items-center gap-7 text-ink">
        <p className="max-w-xl text-center font-body text-xl leading-relaxed font-medium md:text-2xl">
          Want to build something together, or just talk football? Pick a
          path and say hello.
        </p>
        <ul aria-label="Contact details" className="grid w-full max-w-xl gap-4 lg:max-w-none lg:grid-cols-2 lg:gap-x-8">
          {contactItems.map(({ kind, label, value, href, external }) => (
            <li key={kind}>
              <a
                href={href}
                data-contact={kind}
                {...(external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className={`group flex items-center gap-3 ${focusRing}`}
              >
                <span className="pixel-button grid shrink-0 place-items-center bg-paper-200 p-[calc(2*var(--px))]">
                  <PixelArt art={CONTACT_ICONS[kind]} data={{ "data-contact-icon": kind }} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-heading text-2xl leading-none tracking-wide uppercase">
                    {label}
                  </span>
                  <span className="font-body text-base font-medium [overflow-wrap:anywhere] group-hover:underline">
                    {breakable(value)}
                  </span>
                </span>
                {external && <span className="sr-only"> (opens in a new tab)</span>}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-start justify-center gap-x-5 gap-y-3">
          <a
            href={`mailto:${social.email}`}
            data-contact-primary=""
            className={`${button} bg-gold-500 hover:bg-gold-400`}
          >
            Send an email
          </a>
          <CopyEmailButton
            email={social.email}
            className={`${button} bg-paper-200 hover:bg-paper-100`}
          />
        </div>
      </div>
    </div>
  );
}
