import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Button from "@/components/Button";
import MapCard from "@/components/MapCard";
import { Quote } from "@/components/ReviewsHome";
import { REVIEWS } from "@/content/reviews";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: "Avaliações de clientes | NS Concept Hair, Indaiatuba" },
  description: "O que clientes do NS Concept Hair, salão em Indaiatuba (SP), escreveram no Google sobre o atendimento, o espaço e os resultados. Trechos reais.",
  alternates: { canonical: "avaliacoes/" },
};

// 4 destaques no carrossel; a lista abaixo traz as 12
const DESTAQUES = ["Cinthia N.", "Luciana S.", "Nathalia P.", "Tabatha C."];

export default function AvaliacoesPage() {
  const destaques = REVIEWS.filter((r) => DESTAQUES.includes(r.nome));
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ nome: "Avaliações", path: "avaliacoes/" }])} />
      <PageHero label="Avaliações" lines={["Palavras de quem", "já esteve aqui."]} intro="Trechos de avaliações publicadas no Google." />

      <section className="relative bg-ink pb-24 pt-4 md:pb-32" aria-label="Avaliações em destaque">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7">
            <Quote items={destaques} />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <MapCard />
          </div>
        </div>
      </section>

      <section className="on-light bg-sand py-24 md:py-32" aria-labelledby="todas">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 id="todas" className="font-display mb-14 text-[clamp(20px,2.4vw,32px)] leading-[1.1] text-bronze">
            Todas as avaliações
          </h2>
          <ul className="grid gap-x-20 md:grid-cols-2">
            {REVIEWS.map((r) => (
              <li key={r.nome} className="border-t border-[var(--line-dark)] py-8">
                <blockquote className="text-[clamp(17px,1.5vw,20px)] font-light leading-[1.6]">“{r.texto}”</blockquote>
                <p className="mt-5 text-[11px] uppercase tracking-[0.24em] [font-stretch:125%]">
                  {r.nome} <span className="ml-3 font-light text-bronze-deep">Avaliação no Google</span>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href={SITE.maps}>Ver todas no Google</Button>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
