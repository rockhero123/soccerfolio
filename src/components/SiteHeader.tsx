"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import Logo from "./header/Logo";
import { useActiveSection } from "./header/useActiveSection";
import Vine from "./header/Vine";
import WoodPlank, { engraved } from "./WoodPlank";

const SECTION_IDS = site.sections.map((section) => section.id);
const MENU_ID = "site-menu";

const focusRing =
  "rounded-[6px] outline-none focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-cartoon-yellow";

/**
 * The site header (spec 001 US-7): a hand-drawn wooden sign hanging from vines
 * at the top of the screen, fixed while scrolling. It holds the "RM" logo (to
 * `#hero`) and the section links, engraved in the wood.
 *
 * - The link for the section in view gets a `cartoon-yellow` underline.
 * - Below 768px the links fold into a hamburger menu that opens and closes with
 *   mouse, touch and keyboard, closes on Esc or a click outside, and after a
 *   link is chosen.
 * - Smooth scrolling and the scroll offset under the sign are CSS (globals.css).
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const navRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const link = (href: string, label: string, onPick?: () => void) => {
    const current = active === href.slice(1);
    return (
      <a
        href={href}
        onClick={onPick}
        aria-current={current ? "location" : undefined}
        className={`border-b-4 pb-0.5 font-heading text-xl tracking-wider ${engraved} ${focusRing} ${
          current
            ? "border-cartoon-yellow"
            : "border-transparent hover:border-forest-bark-light"
        }`}
      >
        {label}
      </a>
    );
  };

  return (
    <div
      data-site-header=""
      className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center"
    >
      <nav
        ref={navRef}
        aria-label="Main"
        className="pointer-events-auto relative mt-3"
      >
        <Vine className="-top-3 left-[16%]" />
        <Vine className="-top-3 right-[16%] -scale-x-100" />
        <div className="relative flex items-center gap-5 px-10 pt-1.5 pb-3 md:gap-7">
          <WoodPlank />
          <a
            href="#hero"
            aria-label={`RM – ${site.name}, back to the top`}
            className={`relative ${focusRing}`}
          >
            <Logo />
          </a>
          <ul className="relative hidden items-center gap-6 md:flex">
            {site.nav.map(({ href, label }) => (
              <li key={href}>{link(href, label)}</li>
            ))}
          </ul>
          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((isOpen) => !isOpen)}
            className={`relative grid size-10 place-items-center md:hidden ${focusRing}`}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              focusable="false"
              className="size-7 overflow-visible"
            >
              <path
                d={open ? "M5 5L19 19M19 5L5 19" : "M4 6H20M4 12H20M4 18H20"}
                className="fill-none stroke-parchment [stroke-width:calc(var(--stroke-width-outline)*1.2)]"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div
          id={MENU_ID}
          hidden={!open}
          className="absolute top-full left-1/2 mt-3 w-56 -translate-x-1/2 md:hidden"
        >
          <div className="relative px-10 py-5">
            <WoodPlank />
            <ul className="relative flex flex-col items-center gap-3">
              {site.nav.map(({ href, label }) => (
                <li key={href}>{link(href, label, () => setOpen(false))}</li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
