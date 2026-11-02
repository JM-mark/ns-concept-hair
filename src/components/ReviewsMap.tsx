"use client";

import { useEffect, useRef, useState } from "react";
import { REVIEWS } from "@/content/reviews";
import { SITE } from "@/content/site";
import { reduceMotion } from "@/lib/gsap";
import Button from "./Button";
import { PinIcon } from "./Icons";
import { Fade, FillTitle } from "./motion";

/** Uma avaliação por vez, grande e centralizada. Crossfade a cada 7s, setas e pontos. Sem estrelas, nota ou contagem. */
function Slider({ limit }: { limit?: number }) {
  const lista = limit ? REVIEWS.slice(0, limit) : REVIEWS;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [auto, setAuto] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setAuto(!reduceMotion()), 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!auto || paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % lista.length), 7000);
    return () => window.clearInterval(id);
  }, [auto, paused, lista.length, i]);

  const go = (d: number) => setI((v) => (v + d + lista.length) % lista.length);

  return (
    <div
      ref={box}
      className="relative mx-auto max-w-[1000px] text-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Avaliações de clientes"
    >
      <div className="grid" aria-live={auto && !paused ? "off" : "polite"}>
        {lista.map((r, k) => (
          <figure
            key={r.nome}
            className="col-start-1 row-start-1 flex flex-col items-center justify-center px-2 transition-opacity duration-[800ms] ease-in-out md:px-16"
            style={{ opacity: k === i ? 1 : 0, visibility: k === i ? "visible" : "hidden", transitionProperty: "opacity, visibility" }}
            aria-hidden={k !== i}
          >
            <blockquote className="text-[clamp(19px,2.3vw,32px)] font-light leading-[1.4] text-ink">“{r.texto}”</blockquote>
            <figcaption className="label mt-8 text-bronze-deep">
              {r.nome} <span className="ml-3 opacity-80">Avaliação no Google</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-center gap-6">
        <button type="button" onClick={() => go(-1)} aria-label="Avaliação anterior" className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-deep/50 text-bronze-deep transition-colors hover:bg-bronze-deep hover:text-ivory">
          ←
        </button>
        <div className="flex gap-2" role="tablist" aria-label="Escolher avaliação">
          {lista.map((r, k) => (
            <button
              key={r.nome}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Avaliação de ${r.nome}`}
              onClick={() => setI(k)}
              className="flex h-6 w-4 items-center justify-center"
            >
              <span className={`block h-[5px] w-[5px] rounded-full transition-colors ${k === i ? "bg-bronze-deep" : "bg-bronze-deep/30"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(1)} aria-label="Próxima avaliação" className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-deep/50 text-bronze-deep transition-colors hover:bg-bronze-deep hover:text-ivory">
          →
        </button>
      </div>
    </div>
  );
}

/** Avaliações reais do Google (uma por vez) e o endereço com "Como chegar". `/avaliacoes` e `/contato` usam o mapa completo. */
export default function ReviewsMap({ showHeading = true, limit, mapa = "completo" }: { showHeading?: boolean; limit?: number; mapa?: "completo" | "linha" }) {
  const e = SITE.endereco;
  return (
    <section className="on-light relative overflow-hidden bg-sand py-24 md:py-32" aria-labelledby="rev-title">
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        {showHeading && (
          <div className="mb-14 text-center">
            <Fade as="p" className="eyebrow mb-6">
              <span id="rev-title">03 — Avaliações</span>
            </Fade>
            <FillTitle lines={["O que dizem", "nossas clientes"]} className="font-display text-[clamp(26px,3.4vw,50px)] leading-[1.05]" />
            <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="label link-line mt-6 inline-block text-bronze-deep">
              Trechos de avaliações do Google · ver todas
            </a>
          </div>
        )}

        <Slider limit={limit} />

        {mapa === "linha" ? (
          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bronze-deep/30 pt-6 md:flex-row md:items-center">
            <address className="flex gap-3 not-italic">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-bronze-deep" />
              <span className="text-[15px]">
                {e.rua}, <strong className="font-normal">{e.complemento}</strong> · {e.bairro}, {e.cidade}/{e.uf}
              </span>
            </address>
            <Button href={SITE.rotaMaps}>Como chegar</Button>
          </div>
        ) : (
          <div className="mt-20 grid items-end gap-10 md:grid-cols-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] border border-bronze-deep/20 md:col-span-8">
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
                  {e.rua}, <strong className="font-normal">{e.complemento}</strong>
                  <br />
                  {e.bairro}, {e.cidade}/{e.uf}
                </span>
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href={SITE.rotaMaps}>Como chegar</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
