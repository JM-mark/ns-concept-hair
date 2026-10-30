import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import "./globals.css";
import { SITE } from "@/content/site";
import { hairSalonJsonLd } from "@/lib/jsonld";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: "NS Concept Hair | Salão de beleza em Indaiatuba", template: "%s | NS Concept Hair" },
  description: SITE.descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.nome,
    title: "NS Concept Hair | Salão de beleza em Indaiatuba",
    description: SITE.descricao,
    images: [{ url: "og.jpg", width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="label fixed left-4 top-4 z-[300] -translate-y-24 bg-champagne px-4 py-3 text-ink focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(hairSalonJsonLd) }} />
        <SmoothScroll />
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
        <MobileBar />
        <PageTransition />
        <Cursor />
      </body>
    </html>
  );
}
