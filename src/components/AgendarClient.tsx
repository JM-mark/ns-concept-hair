"use client";

import { useState } from "react";
import { EMPTY, formatDia, horarioTexto, servicosTexto, type Booking } from "@/lib/booking";
import { SITE } from "@/content/site";
import BookingStepper from "./BookingStepper";

const linha = (rot: string, val: string) => (
  <div className="flex items-baseline justify-between gap-6 border-t border-champagne/20 py-3">
    <dt className="text-[12px] uppercase tracking-[0.12em] text-champagne/80">{rot}</dt>
    <dd className={`text-right text-[15px] ${val === "—" ? "text-ivory/40" : "text-ivory"}`}>{val}</dd>
  </div>
);

/** Stepper + resumo ao vivo: painel à direita no desktop; barra fixa no rodapé no celular. */
export default function AgendarClient() {
  const [b, setB] = useState<Booking>(EMPTY);
  const servico = b.servicos.length ? servicosTexto(b) : "—";
  const data = b.data ? formatDia(b.data) : "—";
  const hora = b.data ? horarioTexto(b) : "—";
  const e = SITE.endereco;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="glass w-full max-w-[620px] p-6 md:p-10 lg:col-span-7">
          <BookingStepper onChange={setB} />
        </div>

        <aside className="hidden lg:col-span-4 lg:col-start-9 lg:block" aria-label="Resumo do pedido">
          <div className="sticky top-28 rounded-[4px] border border-champagne/20 bg-graphite/70 p-8">
            <p className="text-[13px] uppercase tracking-[0.08em] text-champagne">Seu pedido</p>
            <dl className="mt-6">
              {linha("Serviço", servico)}
              {linha("Data", data)}
              {linha("Horário", hora)}
            </dl>
            <p className="mt-6 text-[13px] leading-relaxed text-ivory/60">O salão confirma o horário pelo WhatsApp.</p>
            <div className="mt-8 border-t border-champagne/20 pt-6 text-[14px] leading-relaxed text-ivory/80">
              <p className="mb-2 text-[12px] uppercase tracking-[0.12em] text-champagne/80">Onde</p>
              {e.rua} — {e.complemento}
              <br />
              <span className="text-champagne/75">
                {e.bairro} · {e.cidade}/{e.uf}
              </span>
              <p className="mb-2 mt-5 text-[12px] uppercase tracking-[0.12em] text-champagne/80">Horário do salão</p>
              <span className="text-champagne/75">Ter a sex 8h–19h · Sáb 8h–18h</span>
            </div>
          </div>
        </aside>
      </div>

      {/* celular: resumo em barra fixa */}
      {b.servicos.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-champagne/30 bg-ink/95 px-5 py-3 backdrop-blur-[12px] lg:hidden" role="status" aria-label="Resumo do pedido">
          <p className="truncate text-[14px] text-ivory">{servico}</p>
          <p className="truncate text-[12px] text-champagne/80">
            {data} · {hora}
          </p>
        </div>
      )}
    </>
  );
}
