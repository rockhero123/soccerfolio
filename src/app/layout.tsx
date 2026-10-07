import type { Metadata } from "next";
import { Lilita_One, Source_Sans_3 } from "next/font/google";
import FilmOverlay from "@/components/FilmOverlay";
import ForestBackground from "@/components/ForestBackground";
import { site } from "@/content/site";
import "./globals.css";

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lilita-one",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans-3",
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: "Portfolio of Ricardo Martinez, software developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lilitaOne.variable} ${sourceSans3.variable} h-full antialiased`}
    >
      <body className="relative isolate min-h-full flex flex-col font-body">
        <ForestBackground />
        <header>
          <a
            href="#main"
            className="sr-only rounded-pill border-outline border-ink bg-parchment px-4 py-2 font-heading text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60]"
          >
            Skip to content
          </a>
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
            <p className="rounded-pill border-outline border-ink bg-parchment px-5 py-1.5 font-body text-ink">
              {site.name}
            </p>
          </footer>
        </div>
        <FilmOverlay />
      </body>
    </html>
  );
}
