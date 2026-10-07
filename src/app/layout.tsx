import type { Metadata } from "next";
import { Lilita_One, Source_Sans_3 } from "next/font/google";
import FilmOverlay from "@/components/FilmOverlay";
import ForestBackground from "@/components/ForestBackground";
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
  title: "Ricardo Martinez — Software Developer",
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
        {/* Clear centre of the forest, where the field sits (spec 001 US-2). */}
        <div className="flex flex-1 flex-col px-(--forest-side) py-(--forest-band)">
          {children}
        </div>
        <FilmOverlay />
      </body>
    </html>
  );
}
