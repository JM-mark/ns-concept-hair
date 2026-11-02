import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import { Fade } from "@/components/motion";
import { SITE } from "@/content/site";
import { photosFor } from "@/content/photos";

export const metadata: Metadata = {
  title: "O Salão",
  description: "Conheça o NS Concept Hair, em Indaiatuba: beleza, cuidado e experiência em cada detalhe. Espaço LGBTQ+ friendly.",
  alternates: { canonical: "o-salao/" },
};

export default function OSalaoPage() {
  const espaco = photosFor("salao-detalhes");
  return (
    <>
      <PageHero
        label="O Salão"
        lines={["Transformando autoestima", "com exclusividade."]}
        intro="Beleza, cuidado e experiência em cada detalhe. Um espaço feito para você ser cuidada."
      />

      <section className="on-light bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[900px] px-5 text-center md:px-10">
          <Fade as="p" className="eyebrow mb-8">
            A marca
          </Fade>
          <Fade as="p" className="font-display text-[clamp(24px,3vw,40px)] leading-[1.2] text-bronze" delay={0.05}>
            NS vem de Netto Sillva, diretor criativo do salão.
          </Fade>
          <Fade as="p" className="mx-auto mt-8 max-w-xl text-[20px] text-bronze-deep" delay={0.1}>
            Seu espaço para ser cuidada: Mega Hair, coloração, visagismo, tratamentos, unhas e sobrancelhas, com exclusividade e atenção a cada detalhe.
          </Fade>
        </div>
      </section>

      {espaco.length > 0 && <Gallery photos={espaco} />}

      <section className="grain relative bg-graphite py-24 md:py-32">
        <div className="mx-auto max-w-[900px] px-5 text-center md:px-10">
          <p className="eyebrow mb-6">Para todas as pessoas</p>
          <p className="text-[clamp(22px,2.6vw,34px)] font-light leading-[1.3]">{SITE.lgbt}. Aqui você chega como é e sai se sentindo cuidada.</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
