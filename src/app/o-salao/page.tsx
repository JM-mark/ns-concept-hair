import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import MapCard from "@/components/MapCard";
import Button from "@/components/Button";
import { Fade } from "@/components/motion";
import { SITE } from "@/content/site";
import { photosFor } from "@/content/photos";

export const metadata: Metadata = {
  title: { absolute: "O salão: espaço acolhedor em Indaiatuba | NS Concept Hair" },
  description: "Conheça o NS Concept Hair, salão em Indaiatuba (SP): um espaço acolhedor no 2º andar, pensado para você chegar como é. Veja o espaço e como chegar.",
  alternates: { canonical: "o-salao/" },
};

export default function OSalaoPage() {
  const espaco = photosFor("salao-detalhes");
  const e = SITE.endereco;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ nome: "O Salão", path: "o-salao/" }])} />
      <PageHero
        label="O Salão"
        lines={["Feito para você", "ser cuidada."]}
        intro="Transformando autoestima com exclusividade, em um espaço acolhedor pensado para você chegar como é."
      />

      <section className="on-light bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <Fade as="p" className="eyebrow mb-8">
            A marca
          </Fade>
          <Fade as="p" className="font-display text-[clamp(22px,2.6vw,36px)] leading-[1.25] text-ink" delay={0.05}>
            NS vem de Netto Sillva, diretor criativo do salão.
          </Fade>
          <Fade as="p" className="mx-auto mt-8 max-w-xl text-[19px] font-light leading-[1.5] text-bronze-deep" delay={0.1}>
            Mega Hair, coloração, visagismo, tratamentos, unhas e sobrancelhas, em um ambiente onde cada atendimento começa por uma conversa.
          </Fade>
        </div>
      </section>

      {espaco.length > 0 && <Gallery photos={espaco} />}

      <section className="bg-ink py-20 md:py-28" aria-labelledby="como-chegar">
        <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <h2 id="como-chegar" className="font-display text-[clamp(22px,3vw,44px)] leading-[1.05]">
              Como chegar
            </h2>
            <address className="mt-8 not-italic text-[17px] leading-relaxed text-ivory/90">
              {e.rua}
              <br />
              {e.complemento} · {e.bairro}
              <br />
              {e.cidade}/{e.uf}, {e.cep}
            </address>
            <p className="mt-4 text-[15px] text-champagne/80">O salão fica no 2º andar. {SITE.horarioResumo}.</p>
            <div className="mt-8">
              <Button href={SITE.rotaMaps} variant="primary">
                Como chegar
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MapCard mapHeight="h-[360px]" detalhes={false} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
