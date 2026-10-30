import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Team from "@/components/Team";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import { SITE } from "@/content/site";
import { photosFor } from "@/content/photos";

export const metadata: Metadata = {
  title: "O Salão",
  description: "Conheça o NS Concept Hair, o Netto Sillva e a equipe. Espaço LGBTQ+ friendly em Indaiatuba.",
  alternates: { canonical: "o-salao/" },
};

export default function OSalaoPage() {
  const espaco = photosFor("salao-detalhes");
  return (
    <>
      <PageHero
        label="O Salão"
        lines={["Transformando autoestima", <em key="e" className="italic-champagne">com exclusividade.</em>]}
        intro="Beleza, cuidado e experiência em cada detalhe. Um espaço feito para você ser cuidada."
      />

      <Team titulo={false} />

      {espaco.length > 0 && <Gallery photos={espaco} />}

      <section className="grain relative bg-graphite py-24 md:py-32">
        <div className="mx-auto max-w-[900px] px-5 text-center md:px-10">
          <p className="label mb-6 text-champagne">Para todas as pessoas</p>
          <p className="font-display text-[clamp(30px,4.5vw,56px)] leading-[1.15]">{SITE.lgbt}. Aqui você chega como é e sai se sentindo cuidada.</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
