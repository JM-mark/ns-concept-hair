import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Visual from "@/components/Visual";
import Button from "@/components/Button";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import { Fade } from "@/components/motion";
import { TEAM } from "@/content/team";
import { SITE } from "@/content/site";
import { firstPhoto, photosFor } from "@/content/photos";

export const metadata: Metadata = {
  title: "O Salão",
  description: "Conheça o NS Concept Hair, o Netto Sillva e a equipe. Espaço LGBTQ+ friendly em Indaiatuba.",
  alternates: { canonical: "o-salao/" },
};

export default function OSalaoPage() {
  const netto = TEAM.find((m) => m.destaque);
  const equipe = TEAM.filter((m) => !m.destaque);
  const espaco = photosFor("salao");
  return (
    <>
      <PageHero
        label="O Salão"
        lines={["Transformando autoestima", <em key="e" className="italic-champagne">com exclusividade.</em>]}
        intro="Beleza, cuidado e experiência em cada detalhe. Um espaço feito para você ser cuidada."
      />

      <section className="on-light bg-ivory py-24 md:py-36">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Visual photo={firstPhoto("equipe")} num="NS" label="Netto Sillva" className="aspect-[4/5] w-full !bg-sand !text-ink" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-7">
            <Fade as="p" className="label mb-6 text-champagne-deep">
              Direção criativa
            </Fade>
            <Fade as="h2" className="font-display text-[clamp(40px,5.5vw,84px)]">
              {netto?.nome}
            </Fade>
            <Fade as="p" className="mt-8 max-w-xl text-[18px] text-mute" delay={0.1}>
              NS é de Netto Sillva, diretor criativo do salão, que antes se chamava Netto Sillva Concept Hair.
            </Fade>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={SITE.instagramDiretor}>Instagram do Netto</Button>
              <Button href="/agendar/" variant="primary">
                Agendar horário
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-24 md:py-36" aria-labelledby="equipe">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 id="equipe" className="label mb-12 !font-sans text-champagne">
            Equipe
          </h2>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((m) => (
              <li key={m.nome} className="border-t border-[var(--line)] py-6">
                <p className="font-display text-[36px] leading-none">{m.nome}</p>
                {/* TODO confirmar função de quem não tem função informada */}
                {m.funcao && <p className="label mt-3 text-[11px] text-champagne">{m.funcao}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {espaco.length > 1 && <Gallery photos={espaco} />}

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
