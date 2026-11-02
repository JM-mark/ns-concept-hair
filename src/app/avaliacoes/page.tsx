import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ReviewsMap from "@/components/ReviewsMap";
import CtaBand from "@/components/CtaBand";
import Button from "@/components/Button";
import { REVIEWS } from "@/content/reviews";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Avaliações",
  description: "O que clientes do NS Concept Hair, em Indaiatuba, escreveram no Google.",
  alternates: { canonical: "avaliacoes/" },
};

export default function AvaliacoesPage() {
  return (
    <>
      <PageHero
        label="Avaliações"
        lines={["Palavras de quem", "já esteve aqui."]}
        intro="Trechos de avaliações publicadas no Google."
      />
      <ReviewsMap showHeading={false} />
      <section className="on-light bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <ul className="grid gap-12 md:grid-cols-2">
            {REVIEWS.map((r) => (
              <li key={r.nome} className="border-t border-[var(--line-dark)] pt-6">
                <blockquote className="text-[22px] font-light leading-snug">“{r.texto}”</blockquote>
                <p className="label mt-5 text-[12px]">
                  {r.nome} <span className="ml-3 text-bronze-deep">Avaliação no Google</span>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-14">
            <Button href={SITE.maps}>Ver todas as avaliações no Google</Button>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
