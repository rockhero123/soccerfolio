import type { Metadata } from "next";
import { Jersey_10, Pixelify_Sans } from "next/font/google";
import FilmOverlay from "@/components/FilmOverlay";
import { SKIP_THEATER_SCRIPT } from "@/components/easter-egg/theaterSkip";
import ForestBackground from "@/components/ForestBackground";
import SiteHeader from "@/components/SiteHeader";
import { site } from "@/content/site";
import "./globals.css";

/** Headings: a chunky pixel face that reads like jersey lettering. */
const jersey10 = Jersey_10({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jersey-10",
});

/** Body: a readable pixel face for running text. */
const pixelifySans = Pixelify_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pixelify-sans",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: "Portfolio of Ricardo Martinez, software developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jersey10.variable} ${pixelifySans.variable} h-full`}
      // The script below may set data-skip-theater before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* Hides the theater before paint when tests skip it (spec 900, theaterSkip.ts). */}
        <script dangerouslySetInnerHTML={{ __html: SKIP_THEATER_SCRIPT }} />
      </head>
      <body className="relative isolate min-h-full flex flex-col font-body">
        <ForestBackground />
        <header>
          <a
            href="#main"
            className="sr-only pixel-button bg-paper-200 px-4 py-1 font-heading text-xl uppercase text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]"
          >
            Skip to content
          </a>
          <SiteHeader />
        </header>
        {/* Clear centre of the forest, where the field sits (spec 001 US-2). */}
        <div className="flex flex-1 flex-col gap-6 px-(--forest-side) py-(--forest-band)">
          <main
            id="main"
            tabIndex={-1}
            className="flex flex-1 flex-col outline-none"
          >
            {children}
          </main>
          <footer className="flex justify-center">
            <p className="pixel-button bg-paper-200 px-5 py-0.5 font-heading text-xl tracking-wide text-ink">
              {site.name}
            </p>
          </footer>
        </div>
        <FilmOverlay />
      </body>
    </html>
  );
}
