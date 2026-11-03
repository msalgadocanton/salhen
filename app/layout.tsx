import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Saira_Condensed } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

// Saira Condensed: alternativa web libre a Agency FB, la tipografía del manual corporativo.
const saira = Saira_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-saira", display: "swap" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SALHEN · Mantención y reparaciones para edificios, empresas y hogares en Santiago",
    template: "%s · SALHEN",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#eeefea",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={`${saira.variable} ${plex.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#contenido"
          className="label fixed left-4 top-4 z-[60] -translate-y-24 bg-ink px-4 py-3 text-paper transition-transform focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <MotionProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
