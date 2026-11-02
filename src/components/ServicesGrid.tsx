import Link from "next/link";
import { SERVICES, serviceHref } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import { asset } from "@/lib/asset";
import { Fade, SplitTitle } from "./motion";

type Cell = { key: string; nome: string; href: string; itens: string[]; agendar: string; foto?: ReturnType<typeof firstPhoto> };

function cellsFor(variant: "home" | "full"): Cell[] {
  const find = (slug: string) => SERVICES.find((s) => s.slug === slug)!;
  const mk = (slug: string): Cell => {
    const s = find(slug);
    const foto = variant === "full" ? firstPhoto(`list-${s.slug}`) : firstPhoto(s.vitrineKey);
    return { key: s.slug, nome: s.nome, href: serviceHref(s), itens: s.pontos.slice(0, 2), agendar: s.opcoes[0].id, foto };
  };
  const base = ["mega-hair", "coloracao", "corte-e-visagismo", "tratamentos"].map(mk);
  if (variant === "full") return [...base, mk("unhas"), mk("sobrancelhas")];
  return [
    ...base,
    {
      key: "unhas-sobrancelhas",
      nome: "Unhas e sobrancelhas",
      href: serviceHref(find("unhas")),
      itens: ["Unhas", "Design de sobrancelhas"],
      agendar: find("unhas").opcoes[0].id,
      foto: firstPhoto("home-unhas"),
    },
  ];
}

/** Card retrato 3:4: a foto inteira, nome e itens embaixo (fora da foto). Brilho diagonal no hover, sem zoom. */
function ServiceCard({ c, n }: { c: Cell; n: number }) {
  return (
    <li className="w-[72%] shrink-0 snap-start sm:w-[46%] md:w-auto">
      <Link href={c.href} className="shine group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-graphite">
          {c.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset(c.foto.src800)}
              srcSet={`${asset(c.foto.src800)} 800w, ${asset(c.foto.src)} 2000w`}
              sizes="(min-width:768px) 20vw, 72vw"
              alt={c.foto.alt}
              width={c.foto.w}
              height={c.foto.h}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-[50%_20%]"
            />
          ) : (
            <svg viewBox="0 0 400 200" fill="none" className="absolute left-1/2 top-[40%] w-[70%] -translate-x-1/2" aria-hidden="true">
              <path d="M20 120 C 90 40, 220 20, 380 70" stroke="var(--champagne)" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M40 140 C 110 70, 230 50, 370 96" stroke="var(--champagne)" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
            </svg>
          )}
          <span className="shine-sweep" aria-hidden="true" />
        </div>
        <div className="pt-4">
          <p className="text-[12px] tabular-nums text-ivory/50">{String(n).padStart(2, "0")}</p>
          <h3 className="mt-1 font-display text-[clamp(17px,1.4vw,21px)] leading-tight text-ivory">{c.nome}</h3>
          <p className="mt-2 text-[14px] text-ivory/70">{c.itens.join(" · ")}</p>
          <span className="label link-line mt-3 inline-block text-champagne">Ver serviço →</span>
        </div>
      </Link>
    </li>
  );
}

/** Serviços: título acima, fileira de cards retrato (carrossel com snap no celular). */
export default function ServicesGrid({ variant = "home" }: { variant?: "home" | "full" }) {
  const cells = cellsFor(variant);
  const cols = variant === "home" ? "md:grid-cols-5" : "md:grid-cols-3";
  return (
    <section
      className="bg-ink py-20 md:py-28"
      aria-labelledby={variant === "home" ? "sv-title" : undefined}
      aria-label={variant === "full" ? "Serviços" : undefined}
    >
      {variant === "home" && (
        <div className="mx-auto mb-12 max-w-[1440px] px-5 md:mb-16 md:px-10">
          <Fade as="p" className="eyebrow mb-6">
            01 — Serviços
          </Fade>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SplitTitle
              as="h2"
              lines={["Nossos", "serviços"]}
              className="font-display text-[clamp(31px,3.4vw,50px)] leading-[1.02] text-ivory"
            />
            <p id="sv-title" className="max-w-sm text-[16px] text-ivory/75">
              Do Mega Hair às sobrancelhas, cada atendimento começa com uma conversa sobre o que você quer.
            </p>
          </div>
        </div>
      )}
      <ul
        className={`mx-auto flex max-w-[1440px] snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:grid md:gap-5 md:overflow-visible md:px-10 [&::-webkit-scrollbar]:hidden ${cols} ${
          variant === "full" ? "md:gap-y-14" : ""
        }`}
      >
        {cells.map((c, i) => (
          <ServiceCard key={c.key} c={c} n={i + 1} />
        ))}
      </ul>
    </section>
  );
}
