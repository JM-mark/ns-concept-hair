import type { Service } from "@/content/services";
import { photosFor, firstPhoto } from "@/content/photos";
import PageHero from "./PageHero";
import Visual from "./Visual";
import Button from "./Button";
import CtaBand from "./CtaBand";
import Gallery from "./Gallery";
import { Fade } from "./motion";

/** Template único de página de serviço, alimentado por src/content/services.ts. */
export default function ServicePage({ service: s }: { service: Service }) {
  const photos = photosFor(s.fotoKey);
  const agendar = `/agendar/?servico=${s.opcoes[0].id}`;
  return (
    <>
      <PageHero label={`${s.num} · Serviço`} lines={[s.nome]} intro={s.intro}>
        <Button href={agendar} variant="primary">
          {s.slug === "mega-hair" ? "Agendar avaliação" : "Agendar horário"}
        </Button>
      </PageHero>

      <section className="on-light bg-ivory py-24 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Visual photo={firstPhoto(s.fotoKey)} num={s.num} label={s.nome} className="aspect-[4/5] w-full !bg-sand !text-ink" sizes="(min-width:1024px) 40vw, 100vw" />
          </div>
          <div className="lg:col-span-7 lg:pt-8">
            {s.paragrafos.map((p, i) => (
              <Fade as="p" key={i} className="mb-6 max-w-2xl font-display text-[clamp(22px,2.6vw,34px)] leading-[1.3]" delay={i * 0.05}>
                {p}
              </Fade>
            ))}
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {s.pontos.map((p) => (
                <li key={p} className="flex items-start gap-3 border-t border-[var(--line-dark)] pt-3 text-[16px]">
                  <span className="mt-2 inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-champagne-deep" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            {s.etapas && (
              <ol className="mt-14 grid gap-6 sm:grid-cols-2">
                {s.etapas.map((e, i) => (
                  <li key={e.titulo} className="border-t border-[var(--line-dark)] pt-4">
                    <span className="label text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                    <p className="mt-1 font-display text-2xl">{e.titulo}</p>
                    <p className="mt-1 text-[15px] text-mute">{e.texto}</p>
                  </li>
                ))}
              </ol>
            )}
            {s.opcoes.length > 1 && (
              <div className="mt-14">
                <p className="label mb-4 text-champagne-deep">Agende por opção</p>
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

      {photos.length > 1 && <Gallery photos={photos.slice(1)} />}

      <section className="bg-ink py-24 md:py-32" aria-labelledby="faq">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <h2 id="faq" className="label mb-10 !font-sans text-champagne">
            Perguntas frequentes
          </h2>
          {s.faq.map((f) => (
            <details key={f.q} className="group border-t border-[var(--line)] py-5 last:border-b">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-6 font-display text-[22px] md:text-[28px]">
                {f.q}
                <span className="relative block h-3 w-3 shrink-0" aria-hidden="true">
                  <span className="absolute left-0 top-1/2 h-px w-full bg-champagne" />
                  <span className="absolute left-1/2 top-0 h-full w-px bg-champagne transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="mt-3 max-w-xl text-[16px] text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CtaBand servico={s.opcoes[0].id} />
    </>
  );
}
