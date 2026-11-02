"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { REVIEWS } from "@/content/reviews";
import { SITE, whatsappLink } from "@/content/site";
import { asset } from "@/lib/asset";
import Button from "./Button";
import { Fade, SplitTitle } from "./motion";

const LIST = REVIEWS.filter((r) => r.texto.length <= 220); // os trechos longos ficam em /avaliacoes
const AUTO_MS = 7;

// trechos curtos e exatos das avaliações reais
const PALAVRAS = [
  "você se sente uma princesa",
  "saio com a autoestima renovada",
  "vale muito",
  "unhas impecáveis",
  "uma aula de visagismo",
  "ambiente agradável",
  "lugar acolhedor",
  "atendimento impecável",
];

const pad = (n: number) => String(n).padStart(2, "0");

function Quote() {
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
  }, []);

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
  const words = r.texto.split(" ");

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
      <div className="relative lg:pl-24">
        <span className="pointer-events-none block h-[70px] text-[120px] leading-[0.9] text-champagne select-none lg:absolute lg:left-0 lg:top-0 lg:h-auto" aria-hidden="true">
          “
        </span>
        <div aria-live="polite" aria-atomic="true">
          <p className="sr-only">
            {r.texto} {r.nome}, avaliação no Google
          </p>
          <blockquote ref={quote} aria-hidden="true" className="min-h-[9.5em] text-[clamp(24px,2.9vw,42px)] leading-[1.25] text-ivory md:min-h-[7.5em]">
            {words.map((w, k) => (
              <span key={`${i}-${k}`}>
                <span className="inline-block overflow-hidden pb-[0.18em] align-top -mb-[0.18em]">
                  <span className="qwi inline-block">{w}</span>
                </span>{" "}
              </span>
            ))}
          </blockquote>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] uppercase tracking-[0.08em]">
          <span className="text-ivory">{r.nome}</span>
          <a href={r.url ?? SITE.maps} target="_blank" rel="noopener noreferrer" className="link-line text-champagne">
            Avaliação no Google
          </a>
        </div>

        <div className="mt-10 flex items-center gap-5">
          <span className="text-[13px] tabular-nums tracking-[0.08em] text-ivory/70" aria-label={`Avaliação ${i + 1} de ${LIST.length}`}>
            {pad(i + 1)} / {pad(LIST.length)}
          </span>
          <span className="relative block h-[2px] min-w-[80px] flex-1 bg-champagne/20" aria-hidden="true">
            <span ref={bar} className="absolute inset-0 origin-left bg-champagne" style={{ transform: auto ? "scaleX(0)" : "scaleX(1)" }} />
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Avaliação anterior"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 text-champagne transition-colors hover:bg-champagne hover:text-ink"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Próxima avaliação"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 text-champagne transition-colors hover:bg-champagne hover:text-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Card de localização: mapa escuro sem rolagem, pino próprio com pulso, endereço, horário e botões. */
function LocalCard() {
  const e = SITE.endereco;
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="overflow-hidden rounded-[4px] border border-champagne/20 bg-graphite">
      <div className="relative h-[320px] overflow-hidden bg-[#151413]">
        {/* mapa estático (fallback) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/mapa-escuro.svg")} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <iframe
          title="Mapa: NS Concept Hair, Indaiatuba"
          src={SITE.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-700"
          style={{ filter: "grayscale(1) invert(0.92) contrast(0.9) brightness(0.9)", opacity: loaded ? 1 : 0 }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <span className="pin-pulse absolute inset-0 rounded-full border border-champagne" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-champagne">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ns-monograma-escuro.png")} alt="" className="h-6 w-auto" />
          </span>
        </div>
        <a href={SITE.maps} target="_blank" rel="noopener noreferrer" aria-label="Abrir o mapa no Google Maps" className="absolute inset-0 z-20" />
      </div>
      <div className="p-6 md:p-7">
        <address className="not-italic text-[15px] leading-relaxed text-ivory">
          {e.rua} — {e.complemento}
          <br />
          <span className="text-ivory/70">
            {e.bairro} · {e.cidade}/{e.uf}
          </span>
        </address>
        <p className="mt-4 text-[14px] text-ivory/70">{SITE.horarioResumo.replace("Ter a sex, 8h às 19h · Sáb, 8h às 18h", "Ter a sex 8h–19h · Sáb 8h–18h")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={SITE.rotaMaps} variant="primary">
            Como chegar
          </Button>
          <Button href={whatsappLink()}>WhatsApp</Button>
        </div>
      </div>
    </div>
  );
}

/** Faixa de palavras das clientes: marquee lento, só contorno, preenche em champagne no hover. */
function Faixa() {
  const item = (aria: boolean, k: number) => (
    <ul key={k} className="flex shrink-0 items-center" aria-hidden={aria || undefined}>
      {PALAVRAS.map((p) => (
        <li key={p} className="flex items-center">
          <span className="palavra font-display text-[clamp(40px,7.2vw,112px)] leading-[1.1] whitespace-nowrap">{p}</span>
          <span className="mx-[clamp(24px,3.5vw,56px)] block h-2.5 w-2.5 rotate-45 bg-champagne" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="group mt-20 overflow-hidden border-y border-champagne/15 py-6 motion-reduce:overflow-x-auto md:mt-28" aria-label="Palavras das clientes">
      <div className="flex w-max [animation:marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:!animate-none">
        {item(false, 0)}
        <div className="flex motion-reduce:hidden" aria-hidden="true">
          {item(true, 1)}
        </div>
      </div>
    </div>
  );
}

/** Avaliações da Home: uma em destaque + card de localização + faixa de palavras. Fundo escuro. */
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
            <LocalCard />
          </div>
        </div>
      </div>
      <Faixa />
    </section>
  );
}
