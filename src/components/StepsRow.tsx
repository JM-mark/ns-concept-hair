"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { SERVICES } from "@/content/services";

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

/** As 4 etapas do Mega Hair em linha: ícones em traço ligados por linha pontilhada que se desenha no scroll. */
export default function StepsRow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (reduceMotion() || !ref.current) return;
      gsap.from(".sr-line", { scaleX: 0, transformOrigin: "left", ease: "none", scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom 65%", scrub: true } });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      <span className="sr-line absolute left-[12%] right-[12%] top-6 hidden border-t-2 border-dotted border-bronze-deep/60 md:block" aria-hidden="true" />
      <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.titulo} className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sand text-bronze-deep [&>svg]:h-8 [&>svg]:w-8">{ICONS[i]}</span>
            <span className="eyebrow mt-3 !text-[10px] !tracking-[0.25em]">
              {i + 1}. {s.titulo}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
