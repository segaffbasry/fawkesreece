import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";

// Display face: Montserrat. gather.ai sets every heading in Montserrat Light (computed style, weight 300), and it is
// also the closest open match to the Gotham used in the Fawkes & Reece wordmark. Used for the preloader, hero and
// section headlines only.
const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-latin-300-normal.woff2", weight: "300" },
    { path: "./fonts/montserrat-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/montserrat-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-display", display: "swap",
});
// UI and body: Raleway, the family fawkesandreece.co.uk loads for all of its text (Redux Google Fonts, 100–900).
const raleway = localFont({
  src: [
    { path: "./fonts/raleway-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/raleway-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/raleway-latin-500-normal.woff2", weight: "500" },
    { path: "./fonts/raleway-latin-600-normal.woff2", weight: "600" },
    { path: "./fonts/raleway-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-body", display: "swap",
});

export const metadata: Metadata = {
  title: "Fawkes & Reece | Construction Recruitment Agency",
  description: "Supplying White Collar, Blue Collar and Executive Search to all areas of construction, house building, rail and infrastructure nationwide.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#000000" };

// Runs before first paint so the homepage is held behind the preloader with no flash. Reduced motion and every other
// route skip it. The safety net hands the page over at 2.4 s whatever happens (the intro itself lasts 1.8 s).
// It also adds `motion` (unless reduced motion is on) so reveal targets are hidden from the first frame, not after
// hydration.
const intro = `(function(){var d=document.documentElement,r=matchMedia("(prefers-reduced-motion: reduce)").matches;if(!r)d.classList.add("motion");function done(){d.classList.remove("is-loading");delete d.dataset.logo;d.dataset.intro="done"}if(location.pathname!=="/"||r){done();return}d.classList.add("is-loading");setTimeout(function(){if(d.dataset.intro!=="done"){done();document.dispatchEvent(new Event("intro:done"))}},2400)})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB" className={`${montserrat.variable} ${raleway.variable}`} suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: intro }} />
      <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
      <noscript><style>{".loader{display:none!important}[data-heading],[data-lines],[data-fade],[data-card],[data-image],[data-hero]{opacity:1!important;transform:none!important;clip-path:none!important;visibility:visible!important}"}</style></noscript>
    </head>
    <body>{children}</body>
  </html>;
}
