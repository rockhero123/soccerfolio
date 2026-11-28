import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/**
 * Loads Google Analytics 4 (gtag.js) after the page is interactive, only when
 * a measurement ID is configured (`NEXT_PUBLIC_GA_ID`). Page views are
 * counted automatically; the game's events are sent with `track()`.
 */
export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
