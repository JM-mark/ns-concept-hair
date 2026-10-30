import { HOME_PAIRS, type ResultCategory } from "@/content/results";
import BeforeAfter from "./BeforeAfter";
import Button from "./Button";
import { SplitTitle } from "./motion";

/**
 * Antes e depois reais. Se não houver nenhum par aprovado, a seção não existe.
 * Pedir ao salão fotos de antes e depois autorizadas pelas clientes.
 */
export default function ResultsSection({ categoria, limit = 3, link = true }: { categoria?: ResultCategory; limit?: number; link?: boolean }) {
  const pairs = HOME_PAIRS.filter((p) => !categoria || p.categoria === categoria).slice(0, limit);
  if (!pairs.length) return null;
  return (
    <section className="bg-ink py-24 md:py-36" aria-labelledby="res-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <p className="label mb-6 text-champagne">Resultados</p>
        <SplitTitle
          lines={["Antes e depois,", <em key="e" className="italic-champagne">de verdade.</em>]}
          className="mb-14 font-display text-[clamp(40px,6vw,92px)]"
        />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pairs.map((p) => (
            <BeforeAfter key={p.id} pair={p} />
          ))}
        </div>
        {link && (
          <div className="mt-14">
            <Button href="/resultados/">Ver todos os resultados</Button>
          </div>
        )}
      </div>
    </section>
  );
}
