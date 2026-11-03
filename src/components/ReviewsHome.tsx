"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { REVIEWS, type Review } from "@/content/reviews";
import { SITE } from "@/content/site";
import MapCard from "./MapCard";
import { Fade, SplitTitle } from "./motion";

/** Trechos curtos (até 220 caracteres): os longos ficam na lista de /avaliacoes. */
export const CURTAS = REVIEWS.filter((r) => r.texto.length <= 220);
const AUTO_MS = 7;

// palavras-chave destacadas na frase (peso 400 e champagne). O texto não muda.
const DESTAQUES = ["unhas impecáveis", "aula de visagismo", "vale muito", "princesa", "autoestima renovada"];

/** Quebra o texto em palavras e marca as que fazem parte de uma palavra-chave. */
function palavras(texto: string): { w: string; hl: boolean }[] {
  const low = texto.toLowerCase();
  const ranges: [number, number][] = [];
  for (const d of DESTAQUES) {
    const k = low.indexOf(d);
    if (k >= 0) ranges.push([k, k + d.length]);
  }
  let pos = 0;
  return texto.split(" ").map((w) => {
    const ini = texto.indexOf(w, pos);
    pos = ini + w.length;
    return { w, hl: ranges.some(([a, b]) => ini < b && ini + w.length > a) };
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Quote({ items = CURTAS }: { items?: Review[] }) {
  const LIST = items;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [auto, setAuto] = useState(false);
  const quote = useRef<HTMLQuoteElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const iRef = useRef(0);
  const busy = useRef(false);
  const first = useRef(true);
  const lines = useRef<number[]>([]);
  const down = useRef<number | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setAuto(!reduceMotion()), 0);
    const onVis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /** Agrupa as palavras por linha (pelo offsetTop) para animar linha a linha. */
  const measure = () => {
    const words = quote.current ? [...quote.current.querySelectorAll<HTMLElement>(".qwi")] : [];
    const tops = words.map((w) => Math.round((w.parentElement as HTMLElement).offsetTop));
    const uniq = [...new Set(tops)].sort((a, b) => a - b);
    lines.current = tops.map((t) => uniq.indexOf(t));
    return words;
  };

  // entrada da nova avaliação: as linhas sobem de baixo, com stagger de 40ms
  useLayoutEffect(() => {
    iRef.current = i;
    const words = measure();
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduceMotion() || !words.length) {
      busy.current = false;
      return;
    }
    gsap.fromTo(
      words,
      { yPercent: 110 },
      { yPercent: 0, duration: 0.32, ease: "power3.out", delay: (k: number) => lines.current[k] * 0.04, onComplete: () => void (busy.current = false) },
    );
  }, [i]);

  const goTo = useCallback((n: number) => {
    if (busy.current) return;
    const next = (n + LIST.length) % LIST.length;
    if (next === iRef.current) return;
    if (reduceMotion() || !quote.current) {
      setI(next);
      return;
    }
    busy.current = true;
    const words = [...quote.current.querySelectorAll<HTMLElement>(".qwi")];
    gsap.to(words, {
      yPercent: -110,
      duration: 0.28,
      ease: "power2.in",
      delay: (k: number) => lines.current[k] * 0.04,
      onComplete: () => setI(next),
    });
    // segurança: se algo travar, libera depois de 1,5s
    window.setTimeout(() => void (busy.current = false), 1500);
  }, [LIST.length]);

  const step = useCallback((d: number) => goTo(iRef.current + d), [goTo]);

  // barra de progresso: enche em 7s e passa para a próxima
  useEffect(() => {
    if (!auto || !bar.current) return;
    const tw = gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: AUTO_MS, ease: "none", onComplete: () => step(1) });
    tween.current = tw;
    return () => void tw.kill();
  }, [i, auto, step]);

  useEffect(() => {
    tween.current?.paused(paused || hidden);
  }, [paused, hidden, i, auto]);

  const r = LIST[i];
  const words = palavras(r.texto);

  return (
    <div
      className="relative outline-none"
      tabIndex={0}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Avaliações de clientes"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") step(-1);
        if (e.key === "ArrowRight") step(1);
      }}
      onPointerDown={(e) => void (down.current = e.clientX)}
      onPointerUp={(e) => {
        if (down.current === null) return;
        const dx = e.clientX - down.current;
        down.current = null;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative">
        <div className="quote-body">
        <div aria-live="polite" aria-atomic="true" className="grid text-[clamp(20px,2.05vw,30px)]">
          <p className="sr-only">
            {r.texto} {r.nome}, avaliação no Google
          </p>
          {/* reserva a altura da frase mais longa (invisível), para o resto da seção não pular na troca */}
          {LIST.map((x) => (
            <p key={x.nome} aria-hidden="true" className="invisible col-start-1 row-start-1 max-w-[34ch] leading-[1.55] tracking-[0.01em]" style={{ fontStretch: "112%", fontWeight: 200 }}>
              {x.texto}
            </p>
          ))}
          {/* traço vertical champagne (1px), da altura da frase */}
          <div className="relative col-start-1 row-start-1">
            <span className="pointer-events-none absolute -left-6 bottom-[0.35em] top-[0.35em] block w-px bg-champagne lg:-left-10" aria-hidden="true" />
            <blockquote
              ref={quote}
              aria-hidden="true"
              className="max-w-[34ch] leading-[1.55] tracking-[0.01em] text-ivory/90 [font-variation-settings:'wght'_200,'wdth'_112]"
              style={{ fontStretch: "112%", fontWeight: 200 }}
            >
              {words.map(({ w, hl }, k) => (
                <span key={`${i}-${k}`}>
                  <span className="inline-block overflow-hidden pb-[0.18em] align-top -mb-[0.18em]">
                    <span className={`qwi inline-block ${hl ? "text-champagne [font-variation-settings:'wght'_400,'wdth'_112]" : ""}`} style={hl ? { fontWeight: 400 } : undefined}>
                      {w}
                    </span>
                  </span>{" "}
                </span>
              ))}
            </blockquote>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase [font-stretch:125%]">
          <span className="font-normal tracking-[0.28em] text-ivory">{r.nome}</span>
          <a href={r.url ?? SITE.maps} target="_blank" rel="noopener noreferrer" className="link-line font-light tracking-[0.28em] text-champagne/70 hover:text-champagne">
            Avaliação no Google
          </a>
        </div>

        <div className="mt-10 flex items-center gap-5">
          <span className="text-[11px] font-normal tabular-nums tracking-[0.16em] text-ivory/70" aria-label={`Avaliação ${i + 1} de ${LIST.length}`}>
            {pad(i + 1)} / {pad(LIST.length)}
          </span>
          <span className="relative block h-px min-w-[80px] flex-1 bg-champagne/20" aria-hidden="true">
            <span ref={bar} className="absolute inset-0 origin-left bg-champagne" style={{ transform: auto ? "scaleX(0)" : "scaleX(1)" }} />
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Avaliação anterior"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne focus-visible:border-champagne"
            >
              <Seta dir={-1} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Próxima avaliação"
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 hover:border-champagne hover:text-champagne focus-visible:border-champagne"
            >
              <Seta dir={1} />
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function Seta({ dir }: { dir: 1 | -1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="square"
      className={`transition-transform duration-300 ${dir === 1 ? "group-hover:translate-x-[3px]" : "group-hover:-translate-x-[3px]"}`}
      aria-hidden="true"
    >
      {dir === 1 ? <path d="M4 12h16M14 6l6 6-6 6" /> : <path d="M20 12H4M10 6l-6 6 6 6" />}
    </svg>
  );
}

/** Avaliações da Home: uma em destaque + card de localização. Fundo escuro. */
export default function ReviewsHome() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-32" aria-labelledby="rev-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Fade as="p" className="eyebrow mb-6">
          <span id="rev-title">03 — Avaliações</span>
        </Fade>
        <SplitTitle as="h2" lines={["O que dizem", "nossas clientes"]} className="font-display text-[clamp(26px,3.4vw,50px)] leading-[1.05] text-ivory" />

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-0">
          <div className="lg:col-span-7">
            <Quote />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <MapCard />
          </div>
        </div>
      </div>
    </section>
  );
}
