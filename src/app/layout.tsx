import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { SITE } from "@/content/site";
import { hairSalonJsonLd } from "@/lib/jsonld";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Thread from "@/components/Thread";

// Uma família só (Archivo): títulos em largura expandida (125%) peso 300; texto em largura normal peso 400.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
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
    <html lang="pt-BR" className={archivo.variable}>
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
        <Thread />
        <MobileBar />
        <PageTransition />
        <Cursor />
      </body>
    </html>
  );
}
