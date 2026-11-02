"use client";

import { useState } from "react";
import { SERVICES } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import Button from "./Button";
import Visual from "./Visual";
import { Fade, SplitTitle } from "./motion";

/** Agendamento da Home: card de vidro com o seletor de serviço, alinhado ao grid, e uma foto retrato à direita. */
export default function BookHome() {
  const opcoes = SERVICES.map((s) => ({ id: s.opcoes[0].id, nome: s.slug === "mega-hair" ? "Avaliação de Mega Hair" : s.nome }));
  const [sel, setSel] = useState(opcoes[0].id);
  const foto = firstPhoto("home-agendar");

  return (
    <section className="grain relative overflow-hidden bg-espresso py-20 md:py-28" aria-labelledby="book-title">
      <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12">
        <div className="glass w-full p-7 md:p-10 lg:col-span-6 xl:col-span-5">
          <Fade as="p" className="eyebrow mb-6">
            04 — Agendamento
          </Fade>
          <SplitTitle as="h2" lines={["Agende sua", "experiência"]} className="font-display text-[clamp(24px,3.2vw,46px)]" />
          <p id="book-title" className="mt-5 text-[16px] text-ivory/80">
            Escolha o serviço. O salão confirma o horário pelo WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Serviço">
            {opcoes.map((o) => (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={sel === o.id}
                onClick={() => setSel(o.id)}
                className={`min-h-[44px] rounded-full border px-5 text-[14px] transition-colors ${
                  sel === o.id ? "border-champagne bg-champagne text-ink" : "border-white/25 text-ivory hover:border-champagne"
                }`}
              >
                {o.nome}
              </button>
            ))}
          </div>
          <div className="mt-8">
            <Button href={`/agendar/?servico=${sel}`} variant="primary">
              Continuar
            </Button>
          </div>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9">
          <Visual photo={foto} label="Agendamento" className="mx-auto aspect-[4/5] w-full max-w-[460px] lg:max-w-none" sizes="(min-width:1024px) 30vw, 90vw" />
        </div>
      </div>
    </section>
  );
}
