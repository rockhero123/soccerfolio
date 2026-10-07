"use client";

import { useEffect, useState } from "react";

/**
 * The id of the section currently in view: the last section whose top has
 * passed 40% of the viewport height, or the last section once the reader has
 * scrolled to the bottom of the page. Updates at most once per animation frame on scroll.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      // Only once the reader has scrolled a page taller than the screen.
      const atBottom =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2;
      let current: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) current = section.id;
      }
      if (atBottom && sections.length > 0) current = sections.at(-1)!.id;
      setActive(current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [ids]);

  return active;
}
