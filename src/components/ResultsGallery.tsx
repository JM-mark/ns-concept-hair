"use client";

import { useState } from "react";
import { MORE_PAIRS, GALLERY, type ResultCategory } from "@/content/results";
import { SITE } from "@/content/site";
import { asset } from "@/lib/asset";
import BeforeAfter from "./BeforeAfter";
import Button from "./Button";

const FILTROS: { id: ResultCategory | "todos"; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "mega-hair", label: "Mega Hair" },
  { id: "coloracao", label: "Coloração" },
  { id: "corte", label: "Corte" },
  { id: "tratamentos", label: "Tratamentos" },
];

/** Galeria filtrável de resultados reais. Sem itens aprovados, a página leva para o Instagram do salão. */
export default function ResultsGallery() {
  const [f, setF] = useState<ResultCategory | "todos">("todos");
  const pairs = MORE_PAIRS.filter((p) => f === "todos" || p.categoria === f);
  const items = GALLERY.filter((g) => f === "todos" || g.categoria === f);
  const empty = !MORE_PAIRS.length && !GALLERY.length;
  const showFilters = MORE_PAIRS.length + GALLERY.length > 3;

  return (
    <section className="bg-ink pb-28">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {empty ? (
          <div className="max-w-xl border-t border-[var(--line)] pt-10">
            <p className="font-display text-[32px] leading-tight">Os resultados do salão ficam no Instagram.</p>
            <p className="mt-4 text-[16px] text-mute">Acompanhe os trabalhos mais recentes, publicados pela própria equipe.</p>
            <div className="mt-8">
              <Button href={SITE.instagram} variant="primary">
                Ver no Instagram
              </Button>
            </div>
          </div>
        ) : (
          <>
            {showFilters && (
            <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filtrar por serviço">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={f === x.id}
                  onClick={() => setF(x.id)}
                  className={`label h-11 border px-5 text-[11px] transition-colors ${
                    f === x.id ? "border-champagne bg-champagne text-ink" : "border-[var(--line)] text-ivory hover:border-champagne"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            )}
            {pairs.length > 0 && (
              <div className="mb-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
                {pairs.map((p) => (
                  <BeforeAfter key={p.id} pair={p} />
                ))}
              </div>
            )}
            {items.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((g) => (
                  <li key={g.id}>
                    <a href={g.post} target="_blank" rel="noopener noreferrer" data-cursor="view" className="block overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(g.src)} alt={g.alt} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-16">
              <Button href={SITE.instagram}>Ver mais no Instagram</Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
