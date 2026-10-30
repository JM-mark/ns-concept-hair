import Link from "next/link";
import { SERVICES, serviceHref } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import { asset } from "@/lib/asset";
import HairStrands from "./HairStrands";
import { Fade, SplitTitle } from "./motion";

type Cell = { key: string; nome: string; href: string; itens: string[]; agendar: string; foto?: ReturnType<typeof firstPhoto>; num: string };

function cellsFor(variant: "home" | "full"): Cell[] {
  const find = (slug: string) => SERVICES.find((s) => s.slug === slug)!;
  const mk = (slug: string): Cell => {
    const s = find(slug);
    return { key: s.slug, nome: s.nome, href: serviceHref(s), itens: s.pontos.slice(0, 3), agendar: s.opcoes[0].id, foto: firstPhoto(s.vitrineKey), num: s.num };
  };
  const base = ["mega-hair", "coloracao", "corte-e-visagismo", "tratamentos"].map(mk);
  if (variant === "full") return [...base, mk("unhas"), mk("sobrancelhas")];
  // Home: Unhas e Sobrancelhas juntas (sem foto: painel tipográfico)
  return [
    ...base,
    {
      key: "unhas-sobrancelhas",
      nome: "Unhas e sobrancelhas",
      href: serviceHref(find("unhas")),
      itens: ["Unhas", "Design de sobrancelhas", "Junto com outro serviço, se preferir"],
      agendar: find("unhas").opcoes[0].id,
      num: "05",
    },
  ];
}

function ServiceCell({ c }: { c: Cell }) {
  return (
    <li className="group relative bg-ink">
      <div className="relative aspect-[4/3.5] overflow-hidden">
        {c.foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset(c.foto.src800)}
            srcSet={`${asset(c.foto.src800)} 800w, ${asset(c.foto.src)} 2000w`}
            sizes="(min-width:768px) 34vw, 100vw"
            alt={c.foto.alt}
            width={c.foto.w}
            height={c.foto.h}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] group-focus-within:scale-[1.06]"
          />
        ) : (
          <div className="relative h-full w-full bg-graphite">
            <span className="absolute right-6 top-2 font-display text-[clamp(110px,14vw,200px)] italic leading-none text-champagne/20" aria-hidden="true">
              {c.num}
            </span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" aria-hidden="true" />
        <h3 className="absolute bottom-0 left-0 p-6 font-display text-[clamp(30px,3.2vw,46px)] font-medium leading-none text-ivory md:p-8">{c.nome}</h3>

        {/* painel do hover (desktop): sobe de baixo com clip-path */}
        <div className="absolute inset-0 hidden flex-col justify-between bg-espresso/85 p-8 backdrop-blur-[2px] [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-within:[clip-path:inset(0)] group-hover:[clip-path:inset(0)] md:flex">
          <div>
            <h3 className="font-display text-[clamp(28px,2.8vw,40px)] font-medium text-ivory">{c.nome}</h3>
            <ul className="mt-5">
              {c.itens.map((i) => (
                <li key={i} className="border-t border-white/15 py-3 text-[15px] text-ivory/90 last:border-b">
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between">
            <Link href={c.href} className="label link-line text-champagne">
              Ver serviço →
            </Link>
            <Link href={`/agendar/?servico=${c.agendar}`} className="btn btn-ivory label !min-h-[40px] !px-5">
              <span className="btn-clip">Agendar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* celular: informações sempre visíveis abaixo da foto */}
      <div className="border-t border-white/10 p-5 md:hidden">
        <ul className="text-[14px] text-ivory/80">
          {c.itens.map((i) => (
            <li key={i} className="py-1">
              {i}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between">
          <Link href={c.href} className="label link-line text-champagne">
            Ver serviço →
          </Link>
          <Link href={`/agendar/?servico=${c.agendar}`} className="label link-line text-ivory">
            Agendar
          </Link>
        </div>
      </div>
    </li>
  );
}

/** Serviços em grade de borda a borda, sem gap. Home: célula 1 é o texto. /servicos: 6 serviços. */
export default function ServicesGrid({ variant = "home" }: { variant?: "home" | "full" }) {
  const cells = cellsFor(variant);
  return (
    <section className="bg-ink" aria-labelledby={variant === "home" ? "sv-title" : undefined} aria-label={variant === "full" ? "Serviços" : undefined}>
      <ul className="grid grid-cols-1 md:grid-cols-3">
        {variant === "home" && (
          <li className="relative flex aspect-auto flex-col justify-center overflow-hidden bg-ink p-8 md:aspect-[4/3.5] md:p-10">
            <HairStrands className="pointer-events-none absolute -right-10 top-0 h-full w-auto" color="var(--champagne)" opacity={0.15} />
            <div className="relative">
              <Fade as="p" className="eyebrow mb-6">
                Serviços
              </Fade>
              <SplitTitle
                as="h2"
                lines={["Nossos", <em key="e" className="italic-champagne">serviços</em>]}
                className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-[1.02] text-ivory"
              />
              <p id="sv-title" className="mt-5 max-w-xs text-[16px] text-ivory/75">
                Do Mega Hair às sobrancelhas, cada atendimento começa com uma conversa sobre o que você quer.
              </p>
            </div>
          </li>
        )}
        {cells.map((c) => (
          <ServiceCell key={c.key} c={c} />
        ))}
      </ul>
    </section>
  );
}
