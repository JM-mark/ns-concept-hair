"use client";

import { useEffect, useState } from "react";
import { REVIEWS } from "@/content/reviews";
import { SITE } from "@/content/site";
import Button from "./Button";
import { PinIcon } from "./Icons";
import { Fade } from "./motion";

/**
 * Citação grande por vez em crossfade (7s, pausa no hover/foco) + mapa.
 * Sem estrelas com número, sem nota, sem contagem.
 */
export default function ReviewsMap({ showHeading = true }: { showHeading?: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % REVIEWS.length), 7000);
    return () => window.clearInterval(id);
  }, [paused]);

  const e = SITE.endereco;
  return (
    <section className="bg-ink py-24 md:py-36" aria-labelledby="rev-title">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div
          className="lg:col-span-7"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onKeyDown={(ev) => {
            if (ev.key === "ArrowRight") setI((v) => (v + 1) % REVIEWS.length);
            if (ev.key === "ArrowLeft") setI((v) => (v - 1 + REVIEWS.length) % REVIEWS.length);
          }}
        >
          {showHeading && (
            <Fade as="p" className="label mb-10 text-champagne">
              <span id="rev-title">Quem já passou por aqui</span>
            </Fade>
          )}
          <div className="grid" aria-live="polite">
            {REVIEWS.map((r, k) => (
              <figure
                key={r.nome}
                aria-hidden={k !== i}
                className={`[grid-area:1/1] transition-all duration-1000 ease-out ${
                  k === i ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
                }`}
              >
                <blockquote className="font-display text-[clamp(28px,4vw,48px)] italic leading-[1.18] tracking-[-0.01em]">
                  “{r.texto}”
                </blockquote>
                <figcaption className="mt-8">
                  <span className="label text-ivory">{r.nome}</span>
                  <span className="label ml-4 text-[11px] text-champagne">Avaliação no Google</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Escolher avaliação">
            {REVIEWS.map((r, k) => (
              <button
                key={r.nome}
                role="tab"
                aria-selected={k === i}
                aria-label={`Avaliação de ${r.nome}`}
                onClick={() => setI(k)}
                className="flex h-11 w-11 items-center justify-center"
              >
                <span className={`block h-[5px] w-[5px] rotate-45 transition-all duration-500 ${k === i ? "scale-150 bg-champagne" : "bg-mute"}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--line)]">
            <iframe
              title="Mapa: NS Concept Hair, Indaiatuba"
              src={SITE.mapsEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="map-dark absolute inset-0 h-full w-full border-0"
            />
          </div>
          <address className="mt-6 flex gap-3 not-italic">
            <PinIcon className="mt-1 h-5 w-5 shrink-0 text-champagne" />
            <span className="text-[15px] text-ivory/90">
              {e.rua}, <strong className="font-normal text-champagne">{e.complemento}</strong>
              <br />
              {e.bairro}, {e.cidade}/{e.uf}
            </span>
          </address>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={SITE.rotaMaps}>Como chegar</Button>
            <Button href={SITE.maps}>Ver todas as avaliações no Google</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
