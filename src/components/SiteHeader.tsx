"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import Logo from "./header/Logo";
import { useActiveSection } from "./header/useActiveSection";
import Vine from "./header/Vine";
import PixelArt from "./pixel/PixelArt";
import { CLOSE_ICON, MENU_ICON } from "./sprites/icons";
import WoodPlank, { engraved } from "./WoodPlank";

const SECTION_IDS = site.sections.map((section) => section.id);
const MENU_ID = "site-menu";

const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-red-600";

/**
 * The site header (spec 001 US-7): a pixel-art wooden sign hanging from vines
 * at the top of the screen, fixed while scrolling. It holds the "RM" logo (to
 * `#hero`) and the section links, burned into the light wood.
 *
 * - The link for the section in view gets a pixel `cartoon-red` underline.
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
        className={`border-b-[length:var(--px)] font-heading text-3xl leading-none tracking-wide uppercase ${engraved} ${focusRing} ${
          current
            ? "border-red-600"
            : "border-transparent hover:border-wood-500"
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
        className="pointer-events-auto relative mt-3 [--px:3px]"
      >
        <Vine className="-top-4 left-[16%]" />
        <Vine className="-top-4 right-[16%] -scale-x-100" />
        <div className="relative flex items-center gap-5 px-10 pt-2.5 pb-3 md:gap-8 md:px-12">
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
            <PixelArt art={open ? CLOSE_ICON : MENU_ICON} />
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
