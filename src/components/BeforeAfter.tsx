"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import type { ResultPair } from "@/content/results";

/**
 * Antes e depois só com pares reais publicados pelo salão.
 * Divisória arrastável (pointer events + teclado), role="slider", demonstração única ao entrar na tela.
 */
export default function BeforeAfter({ pair }: { pair: ResultPair }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromX = (x: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };

  useGSAP(
    () => {
      if (reduceMotion() || !box.current) return;
      const state = { v: 50 };
      gsap
        .timeline({ scrollTrigger: { trigger: box.current, start: "top 70%", once: true } })
        .to(state, { v: 70, duration: 0.5, ease: "power2.inOut", onUpdate: () => setPos(state.v) })
        .to(state, { v: 30, duration: 0.7, ease: "power2.inOut", onUpdate: () => setPos(state.v) })
        .to(state, { v: 50, duration: 0.4, ease: "power2.inOut", onUpdate: () => setPos(state.v) });
    },
    { scope: box },
  );

  return (
    <figure>
      <div
        ref={box}
        data-cursor="drag"
        className="relative aspect-[4/5] w-full touch-pan-y select-none overflow-hidden bg-graphite"
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          setFromX(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && setFromX(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset(pair.depois)} alt={`${pair.servico}: depois`} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="lazy" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(pair.antes)} alt={`${pair.servico}: antes`} className="h-full w-full object-cover" draggable={false} loading="lazy" />
        </div>
        <span className="label absolute left-4 top-4 bg-ink/70 px-3 py-1.5 text-[11px] text-ivory">Antes</span>
        <span className="label absolute right-4 top-4 bg-ink/70 px-3 py-1.5 text-[11px] text-ivory">Depois</span>

        <div className="pointer-events-none absolute inset-y-0 w-px bg-champagne" style={{ left: `${pos}%` }}>
          <div
            role="slider"
            tabIndex={0}
            aria-label={`Comparar antes e depois: ${pair.servico}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            data-native-cursor
            className="pointer-events-auto absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-champagne bg-ink"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ns-monograma-champagne.png")} alt="" className="h-6 w-auto" />
          </div>
        </div>
      </div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-4">
        <span className="font-display text-2xl">{pair.servico}</span>
        <a href={pair.post} target="_blank" rel="noopener noreferrer" className="label link-line text-champagne">
          Ver no Instagram
        </a>
      </figcaption>
    </figure>
  );
}
