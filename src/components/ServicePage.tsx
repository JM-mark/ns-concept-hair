import Link from "next/link";
import { serviceBySlug, serviceHref, type Service } from "@/content/services";
import { photosFor, firstPhoto } from "@/content/photos";
import PageHero from "./PageHero";
import Visual from "./Visual";
import Button from "./Button";
import CtaBand from "./CtaBand";
import Gallery from "./Gallery";
import StepsRow from "./StepsRow";
import Accordion from "./Accordion";
import { Fade } from "./motion";

const h2 = "font-display text-[clamp(20px,2.4vw,32px)] leading-[1.1]";

/** Template único das páginas de serviço, alimentado por src/content/services.ts:
 * hero → o que é → para quem é → como funciona → galeria → perguntas → combina com → CTA. */
export default function ServicePage({ service: s }: { service: Service }) {
  const photos = photosFor(s.fotoKey);
  const agendar = `/agendar/?servico=${s.opcoes[0].id}`;
  const relacionados = s.combinaCom.map((slug) => serviceBySlug(slug)).filter((x): x is Service => !!x);
  return (
    <>
      <PageHero label={`${s.num} · Serviço`} lines={[s.nome]} intro={s.intro}>
        <Button href={agendar} variant="primary">
          {s.slug === "mega-hair" ? "Agendar avaliação" : "Agendar horário"}
        </Button>
      </PageHero>

      {/* O que é */}
      <section className="on-light bg-sand py-20 md:py-28" aria-labelledby="o-que-e">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Visual photo={firstPhoto(s.fotoKey)} label={s.nome} className="aspect-[4/5] w-full" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <h2 id="o-que-e" className={`${h2} mb-8 text-bronze`}>
              O que é
            </h2>
            {s.oQueE.map((p, i) => (
              <Fade as="p" key={i} className="mb-6 max-w-2xl text-[clamp(17px,1.6vw,21px)] font-light leading-[1.55]" delay={i * 0.05}>
                {p}
              </Fade>
            ))}
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {s.pontos.map((p) => (
                <li key={p} className="flex items-start gap-3 border-t border-[var(--line-dark)] pt-3 text-[16px]">
                  <span className="mt-2 inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-bronze-deep" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            {s.opcoes.length > 1 && (
              <div className="mt-12">
                <p className="mb-4 text-[13px] uppercase tracking-[0.08em] text-bronze-deep">Agende por opção</p>
                <div className="flex flex-wrap gap-3">
                  {s.opcoes.map((o) => (
                    <Button key={o.id} href={`/agendar/?servico=${o.id}`}>
                      {o.nome}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="grain relative bg-graphite py-20 md:py-28" aria-labelledby="para-quem">
        <div className="mx-auto max-w-[1440px] px-5 md:px-10">
          <h2 id="para-quem" className={`${h2} mb-12 text-ivory`}>
            Para quem é
          </h2>
          <ul className="grid gap-8 md:grid-cols-3 md:gap-0">
            {s.paraQuem.map((p, i) => (
              <li key={p} className={`border-t border-champagne/30 pt-5 ${i ? "md:border-l md:pl-8" : ""} md:pr-8`}>
                <p className="mb-3 text-[13px] tabular-nums text-champagne">0{i + 1}</p>
                <p className="text-[clamp(17px,1.5vw,20px)] font-light leading-[1.5] text-ivory">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Como funciona */}
      <section className="on-light bg-sand py-20 md:py-28" aria-labelledby="como-funciona">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <h2 id="como-funciona" className={`${h2} mb-12 text-bronze`}>
            Como funciona
          </h2>
          <StepsRow steps={s.etapas} />
        </div>
      </section>

      {photos.length > 1 && <Gallery photos={photos.slice(1)} />}

      {/* Perguntas frequentes */}
      <section className="on-light bg-sand py-20 md:py-28" aria-labelledby="faq">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <h2 id="faq" className={`${h2} mb-10 text-bronze`}>
            Perguntas frequentes
          </h2>
          <Accordion items={s.faq} />
        </div>
      </section>

      {/* Combina com + avaliações */}
      <section className="bg-ink py-16 md:py-20" aria-labelledby="combina">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 md:flex-row md:items-end md:justify-between md:px-10">
          <div>
            <h2 id="combina" className="mb-5 text-[13px] font-normal uppercase tracking-[0.08em] text-champagne">
              Combina com
            </h2>
            <ul className="flex flex-wrap gap-x-10 gap-y-3">
              {relacionados.map((r) => (
                <li key={r.slug}>
                  <Link href={serviceHref(r)} className="link-line font-display text-[clamp(18px,2vw,28px)] text-ivory">
                    {r.nome} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href="/avaliacoes/" className="link-line text-[13px] uppercase tracking-[0.08em] text-champagne">
            Veja o que as clientes dizem →
          </Link>
        </div>
      </section>

      <CtaBand servico={s.opcoes[0].id} />
    </>
  );
}
