"use client";

import { useState } from "react";
import { SERVICES } from "@/content/services";
import Button from "./Button";
import HairStrands from "./HairStrands";
import { Fade, SplitTitle } from "./motion";

/** Bloco de agendamento da Home: card de vidro com o seletor de serviço; "Continuar" abre /agendar com o serviço escolhido. */
export default function BookHome() {
  const opcoes = SERVICES.map((s) => ({ id: s.opcoes[0].id, nome: s.slug === "mega-hair" ? "Avaliação de Mega Hair" : s.nome }));
  const [sel, setSel] = useState(opcoes[0].id);

  return (
    <section className="relative overflow-hidden bg-espresso py-24 md:py-36" aria-labelledby="book-title">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
        <HairStrands className="h-full w-full" color="var(--champagne)" opacity={0.18} />
      </div>
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="glass w-full max-w-[560px] p-7 md:p-10">
          <Fade as="p" className="eyebrow mb-6">
            Agendamento
          </Fade>
          <SplitTitle
            as="h2"
            lines={["Agende sua", <em key="e" className="italic-champagne">experiência</em>]}
            className="font-display text-[clamp(40px,5vw,64px)] font-medium"
          />
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
      </div>
    </section>
  );
}
