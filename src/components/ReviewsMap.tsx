import { REVIEWS, type Review } from "@/content/reviews";
import { SITE } from "@/content/site";
import Button from "./Button";
import HairStrands from "./HairStrands";
import { PinIcon } from "./Icons";
import { Fade, FillTitle } from "./motion";

function Card({ r }: { r: Review }) {
  return (
    <figure className="rounded-[16px] border border-bronze-deep/15 bg-ivory/50 p-7">
      <span className="block font-display text-[88px] not-italic leading-[0.7] text-bronze" aria-hidden="true">
        “
      </span>
      <blockquote className="mt-2 text-[16px] leading-relaxed text-ink">{r.texto}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bronze-deep font-display text-[18px] text-ivory" aria-hidden="true">
          {r.nome[0]}
        </span>
        <span>
          <span className="eyebrow block !text-[11px] !tracking-[0.25em]">{r.nome}</span>
          <span className="block text-[12px] text-bronze-deep">Avaliação no Google</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Column({ items, dir, dur }: { items: Review[]; dir: "up" | "down"; dur: number }) {
  const anim = dir === "up" ? "col-up" : "col-down";
  return (
    <div className="overflow-hidden motion-reduce:overflow-visible">
      <div className="flex flex-col gap-5 motion-reduce:!animate-none" style={{ animation: `${anim} ${dur}s linear infinite` }}>
        {items.map((r) => (
          <Card key={r.nome} r={r} />
        ))}
        <div className="flex flex-col gap-5 motion-reduce:hidden" aria-hidden="true">
          {items.map((r) => (
            <Card key={`${r.nome}-2`} r={r} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Avaliações reais do Google em 3 colunas rolando em sentidos opostos (loop de ~40s), com pausa no hover/foco e
 * fades de 120px. Sem estrelas, sem nota e sem contagem. No celular, faixa horizontal lenta. Mapa embaixo.
 */
export default function ReviewsMap({ showHeading = true, limit, mapa = "completo" }: { showHeading?: boolean; limit?: number; mapa?: "completo" | "linha" }) {
  const lista = limit ? REVIEWS.slice(0, limit) : REVIEWS;
  const cols = [0, 1, 2].map((c) => lista.filter((_, i) => i % 3 === c));
  const e = SITE.endereco;
  return (
    <section className="on-light relative overflow-hidden bg-sand py-24 md:py-36" aria-labelledby="rev-title">
      <HairStrands className="pointer-events-none absolute -left-16 bottom-0 hidden h-[70%] w-auto md:block" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        {showHeading && (
          <div className="mb-14 max-w-3xl">
            <Fade as="p" className="eyebrow mb-6">
              <span id="rev-title">Avaliações</span>
            </Fade>
            <FillTitle
              lines={["O que dizem", <em key="e" className="italic">nossas clientes</em>]}
              className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-[1.05]"
            />
            <p className="mt-6 text-[17px] text-bronze-deep">Trechos de avaliações publicadas no Google.</p>
            <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="label link-line mt-4 inline-block text-bronze-deep">
              Ver todas no Google
            </a>
          </div>
        )}

        {/* desktop: 3 colunas rolando */}
        <div
          className="group hidden h-[560px] gap-5 md:grid md:grid-cols-3 motion-reduce:h-auto [&:hover_*]:[animation-play-state:paused] [&:focus-within_*]:[animation-play-state:paused]"
          style={{ maskImage: "linear-gradient(to bottom, transparent, #000 90px, #000 calc(100% - 90px), transparent)" }}
          tabIndex={0}
          aria-label="Avaliações de clientes"
        >
          <Column items={cols[0]} dir="down" dur={44} />
          <Column items={cols[1]} dir="up" dur={40} />
          <Column items={cols[2]} dir="down" dur={48} />
        </div>

        {/* celular: faixa horizontal lenta, com pausa no toque */}
        <div className="group overflow-hidden md:hidden">
          <div className="flex w-max gap-4 [animation:marquee_70s_linear_infinite] group-active:[animation-play-state:paused] motion-reduce:!animate-none">
            {lista.map((r) => (
              <div key={r.nome} className="w-[82vw] shrink-0">
                <Card r={r} />
              </div>
            ))}
            {lista.map((r) => (
              <div key={`${r.nome}-2`} className="w-[82vw] shrink-0 motion-reduce:hidden" aria-hidden="true">
                <Card r={r} />
              </div>
            ))}
          </div>
        </div>

        {mapa === "linha" ? (
          <>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-bronze-deep/30 pt-6 md:flex-row md:items-center">
          <address className="flex gap-3 not-italic">
            <PinIcon className="mt-1 h-5 w-5 shrink-0 text-bronze-deep" />
            <span className="text-[15px]">
              {e.rua}, <strong className="font-medium">{e.complemento}</strong> · {e.bairro}, {e.cidade}/{e.uf}
            </span>
          </address>
          <Button href={SITE.rotaMaps}>Como chegar</Button>
        </div>
          </>
        ) : (
          <>
        <div className="mt-20 grid items-end gap-10 md:grid-cols-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[16px] border border-bronze-deep/20 md:col-span-8">
            <iframe
              title="Mapa: NS Concept Hair, Indaiatuba"
              src={SITE.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:sepia(0.35)_saturate(0.8)]"
            />
          </div>
          <div className="md:col-span-4">
            <address className="flex gap-3 not-italic">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-bronze-deep" />
              <span className="text-[15px]">
                {e.rua}, <strong className="font-medium">{e.complemento}</strong>
                <br />
                {e.bairro}, {e.cidade}/{e.uf}
              </span>
            </address>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={SITE.rotaMaps}>Como chegar</Button>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
}
