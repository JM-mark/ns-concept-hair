"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";

/** Dígitos que rolam (colunas 0–9, translateY, 1,4s, stagger de 80ms) até o valor, uma vez ao entrar na tela. */
export default function Odometer({ value, className = "" }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const cols = el.querySelectorAll<HTMLElement>("[data-col]");
      if (reduceMotion()) {
        cols.forEach((c) => gsap.set(c, { yPercent: -Number(c.dataset.col) * 10 }));
        return;
      }
      gsap.set(cols, { yPercent: 0 });
      gsap.to(cols, {
        yPercent: (i, t: HTMLElement) => -Number(t.dataset.col) * 10,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-flex ${className}`} role="img" aria-label={value}>
      {value.split("").map((d, i) => (
        <span key={i} className="relative inline-block h-[1em] overflow-hidden leading-none" aria-hidden="true">
          {/* altura da coluna = 1em; o conteúdo rola dentro dela */}
          <span data-col={d} className="block">
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n} className="block h-[1em] leading-none">
                {n}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
