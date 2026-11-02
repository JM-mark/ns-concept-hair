"use client";

import { useRef, useState } from "react";
import { gsap, reduceMotion } from "@/lib/gsap";

type Item = { q: string; a: string };

/** Acordeão com hairlines, "+" que gira para "×" e abertura com altura animada (350ms). */
export default function Accordion({ items, tone = "sand" }: { items: Item[]; tone?: "sand" | "dark" }) {
  const [open, setOpen] = useState<number | null>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const dark = tone === "dark";

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    const prev = open;
    setOpen(next);
    const anim = (idx: number, to: number) => {
      const el = panels.current[idx];
      if (!el) return;
      if (reduceMotion()) {
        el.style.height = `${to}px`;
        return;
      }
      gsap.to(el, { height: to, duration: 0.35, ease: "power2.out" });
    };
    if (prev !== null) anim(prev, 0);
    if (next !== null) anim(next, panels.current[next]?.scrollHeight ?? 0);
  };

  return (
    <div className={`border-b ${dark ? "border-white/20" : "border-bronze-deep/30"}`}>
      {items.map((it, i) => (
        <div key={it.q} className={`border-t ${dark ? "border-white/20" : "border-bronze-deep/30"}`}>
          <h3>
            <button
              type="button"
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
              onClick={() => toggle(i)}
              className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left text-[clamp(17px,1.8vw,21px)]"
            >
              {it.q}
              <span className={`relative block h-4 w-4 shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`} aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-px w-full bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-current" />
              </span>
            </button>
          </h3>
          <div id={`faq-${i}`} role="region" ref={(el) => void (panels.current[i] = el)} style={{ height: 0 }} className="overflow-hidden">
            <p className={`max-w-xl pb-6 text-[16px] ${dark ? "text-mute" : "text-bronze-deep"}`}>{it.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
