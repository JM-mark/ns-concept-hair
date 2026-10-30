"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import { photosFor } from "@/content/photos";
import { asset } from "@/lib/asset";
import Button from "./Button";
import Odometer from "./Odometer";
import { Fade, SplitTitle } from "./motion";

// TODO confirmar etapas com o salão (vêm de services.ts)
const STEPS = SERVICES[0].etapas ?? [];

const ICONS = [
  // lupa (avaliação)
  <svg key="a" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <circle cx="21" cy="21" r="12" />
    <path d="M30 30l11 11" />
  </svg>,
  // mecha
  <svg key="b" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <path d="M14 6c8 8-8 14 0 22s-4 10-2 14" />
    <path d="M24 6c8 8-8 14 0 22s-4 10-2 14" />
    <path d="M34 6c8 8-8 14 0 22s-4 10-2 14" />
  </svg>,
  // mãos
  <svg key="c" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 30c4-6 8-8 14-8h8c3 0 4 4 1 5l-9 3" />
    <path d="M42 30c-4-6-8-8-14-8" />
    <path d="M6 30l8 10 14-3M42 30l-8 10" />
  </svg>,
  // calendário
  <svg key="d" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
    <rect x="7" y="10" width="34" height="31" rx="4" />
    <path d="M7 19h34M16 6v8M32 6v8" />
    <path d="M16 27h2M23 27h2M30 27h2M16 34h2M23 34h2" />
  </svg>,
];

function StepCard({ i }: { i: number }) {
  const step = STEPS[i];
  const photo = photosFor("jornada")[i];
  return (
    <div className="jr-card relative w-full max-w-[420px]">
      <span className="jr-frame pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-[18px] border border-bronze-deep/60" aria-hidden="true" />
      <div className="relative aspect-[420/520] overflow-hidden rounded-[16px] bg-espresso">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={asset(photo.src800)} alt={photo.alt} width={photo.w} height={photo.h} loading="lazy" decoding="async" className="jr-img h-[116%] w-full object-cover" />
        ) : (
          <span className="absolute right-5 top-2 font-display text-[160px] italic leading-none text-champagne/25" aria-hidden="true">
            {i + 1}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent p-6 pt-24">
          <p className="eyebrow mb-1 !text-[11px] !tracking-[0.3em]">
            <Odometer value={`0${i + 1}`} />
          </p>
          <p className="font-display text-[28px] font-medium leading-tight text-ivory">
            {i + 1}. {step.titulo}
          </p>
          <p className="mt-1 text-[14px] text-ivory/80">{step.texto}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * A jornada do Mega Hair: título fixo no centro (sticky de CSS, sem pin do GSAP) e 4 cards que passam por cima,
 * alternando esquerda e direita, com moldura deslocada em parallax. No celular, coluna sem sticky.
 */
export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduceMotion() || !root.current) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>(".jr-card", root.current).forEach((card) => {
          gsap.fromTo(card.querySelector(".jr-frame"), { y: -6 }, { y: 6, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
          gsap.fromTo(card.querySelector(".jr-img"), { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
      gsap.from(".jr-line", { scaleX: 0, transformOrigin: "left", ease: "none", scrollTrigger: { trigger: ".jr-icons", start: "top 85%", end: "bottom 60%", scrub: true } });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-light bg-sand" aria-labelledby="jr-title">
      {/* desktop: título sticky + cards por cima */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-0 flex h-screen items-center justify-center px-10 text-center">
          <div className="max-w-[1000px]">
            <p className="eyebrow mb-8">A jornada</p>
            <h2 id="jr-title" className="font-display text-[clamp(44px,5.4vw,80px)] font-medium leading-[1.05] text-bronze">
              Mais que um alongamento,
              <br />
              <em className="italic">uma experiência.</em>
            </h2>
          </div>
        </div>
        <div className="relative z-10 -mt-[100vh] pb-[10vh] pt-[55vh]">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex px-10 py-[7vh] ${i % 2 ? "justify-end pr-[12%]" : "justify-start pl-[12%]"}`}>
              <StepCard i={i} />
            </div>
          ))}
        </div>
      </div>

      {/* celular: sem sticky */}
      <div className="px-5 py-20 md:hidden">
        <p className="eyebrow mb-6">A jornada</p>
        <SplitTitle
          lines={["Mais que um alongamento,", <em key="e" className="italic">uma experiência.</em>]}
          className="mb-10 font-display text-[44px] font-medium leading-[1.05] text-bronze"
        />
        <div className="space-y-10">
          {STEPS.map((_, i) => (
            <StepCard key={i} i={i} />
          ))}
        </div>
      </div>

      {/* ícones em traço ligados por linha pontilhada */}
      <div className="jr-icons mx-auto max-w-[1000px] px-5 pb-24 pt-6 md:px-10 md:pb-32">
        <div className="relative">
          <span className="jr-line absolute left-[12%] right-[12%] top-8 hidden border-t-2 border-dotted border-bronze-deep/60 md:block" aria-hidden="true" />
          <ul className="relative grid grid-cols-2 gap-y-10 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.titulo} className="flex flex-col items-center text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-bronze-deep [&>svg]:h-9 [&>svg]:w-9">{ICONS[i]}</span>
                <span className="eyebrow mt-3 !text-[11px] !tracking-[0.3em]">{s.titulo}</span>
              </li>
            ))}
          </ul>
        </div>
        <Fade className="mt-14 flex justify-center">
          <Button href="/agendar/?servico=avaliacao-mega-hair" variant="primary">
            Agendar avaliação
          </Button>
        </Fade>
      </div>
    </section>
  );
}
