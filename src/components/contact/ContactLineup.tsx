import { contactInvite, contactItems, type ContactItem } from "@/content/social";
import ContactSign from "./ContactSign";

/**
 * Chalk-white lettering painted on the dark grass, with a crisp dark pixel
 * edge so it stays readable over the lighter grass speckles.
 */
const grassPaint =
  "text-paper-100 [text-shadow:calc(var(--px)*0.5)_0_0_var(--color-grass-900),calc(var(--px)*-0.5)_0_0_var(--color-grass-900),0_calc(var(--px)*0.5)_0_var(--color-grass-900),0_calc(var(--px)*-0.5)_0_var(--color-grass-900),var(--px)_var(--px)_0_var(--color-grass-900)]";

/**
 * Where a sign stands from 768px: the midfielders lean in towards the middle,
 * close together (a small gap between them); the forwards push out towards
 * the touchlines, pulled in a little from the edges on wide screens.
 */
function placement({ line }: ContactItem, left: boolean) {
  if (line === "midfielders")
    return left ? "md:justify-end md:pr-4" : "md:justify-start md:pl-4";
  return left ? "md:justify-start lg:pl-12" : "md:justify-end lg:pr-12";
}

/**
 * The contact section's content (spec 007 US-1): an invitation painted in
 * white on the dark grass, and the four contact signs lined up like players,
 * two midfielders (phone, email) close together above two forwards
 * (LinkedIn, GitHub) wide apart. On phones the signs stack in one column.
 */
export default function ContactLineup() {
  const seen = new Set<string>();
  return (
    <div
      data-contact-lineup=""
      className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 pb-[calc(8*var(--px))] md:gap-12"
    >
      <p
        data-grass-paint=""
        className={`max-w-2xl text-center font-heading text-3xl leading-tight tracking-wide md:text-4xl ${grassPaint}`}
      >
        {contactInvite}
      </p>
      <ul
        aria-label="Contact details"
        className="grid w-full gap-y-12 md:grid-cols-2 md:gap-x-4 md:gap-y-14"
      >
        {contactItems.map((item) => {
          const left = !seen.has(item.line);
          seen.add(item.line);
          return (
            <li
              key={item.kind}
              data-line={item.line}
              className={`flex justify-center ${placement(item, left)}`}
            >
              <ContactSign item={item} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
