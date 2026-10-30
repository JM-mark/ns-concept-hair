"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SERVICES, serviceHref } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import Visual from "./Visual";
import { SplitTitle } from "./motion";

/** Vitrine de serviços: no desktop é fixa (pin) com a foto trocando por máscara diagonal; no celular vira cards. */
export default function ServicesShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-sv-item]", el);
        const panels = gsap.utils.toArray<HTMLElement>("[data-sv-panel]", el);
        const bars = gsap.utils.toArray<HTMLElement>("[data-sv-bar]", el);
        const titles = gsap.utils.toArray<HTMLElement>("[data-sv-title]", el);
        const N = items.length;
        const hidden = "polygon(0 0, 0 0, 0 100%, 0 100%)";
        const full = "polygon(0 0, 140% 0, 100% 100%, 0 100%)";
        gsap.set(panels, { clipPath: hidden, zIndex: (i) => i });
        gsap.set(panels[0], { clipPath: full });
        gsap.set(titles, { autoAlpha: 0, y: 24 });
        gsap.set(titles[0], { autoAlpha: 1, y: 0 });

        let current = 0;
        const show = (i: number) => {
          if (i === current) return;
          const prev = current;
          current = i;
          gsap.killTweensOf([panels[i], titles[i], titles[prev]]);
          // o título anterior sai antes de o próximo entrar
          gsap.to(titles[prev], { autoAlpha: 0, y: -24, duration: 0.25, ease: "power2.in" });
          gsap.to(titles[i], { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out", delay: 0.22, overwrite: "auto" });
          gsap.set(panels[i], { zIndex: N + 1 });
          gsap.fromTo(
            panels[i],
            { clipPath: hidden },
            {
              clipPath: full,
              duration: 0.9,
              ease: "expo.out",
              onComplete: () => {
                panels.forEach((p, k) => gsap.set(p, { zIndex: k === i ? N : k }));
              },
            },
          );
          items.forEach((it, k) => it.toggleAttribute("data-active", k === i));
        };
        items[0].setAttribute("data-active", "");

        ScrollTriggerCreate(el, N, bars, show);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="bg-ink" aria-labelledby="sv-title">
      {/* Desktop */}
      <div className="sv-pin relative hidden h-screen lg:block">
        <div className="mx-auto grid h-full max-w-[1440px] grid-cols-12 gap-10 px-10 py-24">
          <div className="col-span-5 flex flex-col justify-between">
            <div>
              <p className="label mb-6 text-champagne">Serviços</p>
              <h2 id="sv-title" className="sr-only">
                Serviços
              </h2>
              <ol className="space-y-1">
                {SERVICES.map((s) => (
                  <li key={s.slug} data-sv-item className="group relative flex items-center gap-5 py-2.5 text-mute transition-colors duration-500 data-[active]:text-champagne">
                    <span className="label w-8 text-[11px]">{s.num}</span>
                    <span className="label !text-[13px]">{s.nome}</span>
                    <span data-sv-bar className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne" />
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative h-56">
              {SERVICES.map((s) => (
                <div key={s.slug} data-sv-title className="absolute inset-0 opacity-0">
                  <h3 className="font-display text-5xl">{s.nome}</h3>
                  <p className="mt-4 max-w-sm text-[17px] text-ivory/80">{s.linha}</p>
                  <Link href={serviceHref(s)} className="label link-line mt-6 inline-block text-champagne">
                    Conhecer
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="relative col-span-7">
            {SERVICES.map((s) => (
              <div key={s.slug} data-sv-panel className="absolute inset-0">
                <Visual photo={firstPhoto(s.vitrineKey)} num={s.num} label={s.nome} className="h-full w-full" sizes="55vw" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celular e tablet: cards sem pin */}
      <div className="px-5 py-20 md:px-10 lg:hidden">
        <p className="label mb-4 text-champagne">Serviços</p>
        <SplitTitle lines={["Cuidado para", <em key="e" className="italic-champagne">cada detalhe.</em>]} className="mb-10 font-display text-[44px] md:text-6xl" />
        <ul className="grid gap-4 md:grid-cols-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={serviceHref(s)} className="group block border border-[var(--line)]">
                <Visual photo={firstPhoto(s.vitrineKey)} num={s.num} label={s.nome} className="aspect-[4/3]" sizes="100vw" />
                <div className="p-5">
                  <h3 className="font-display text-3xl">{s.nome}</h3>
                  <p className="mt-2 text-[15px] text-mute">{s.linha}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// ScrollTrigger com pin e progresso por serviço
function ScrollTriggerCreate(el: HTMLElement, N: number, bars: HTMLElement[], show: (i: number) => void) {
  ScrollTrigger.create({
    trigger: el.querySelector(".sv-pin"),
    start: "top top",
    end: () => `+=${window.innerHeight * N * 0.6}`,
    pin: true,
    scrub: true,
    onUpdate: (self) => {
      const p = Math.min(0.9999, self.progress) * N;
      const i = Math.floor(p);
      show(i);
      bars.forEach((b, k) => gsap.set(b, { scaleX: k < i ? 1 : k === i ? p - i : 0 }));
    },
  });
}
