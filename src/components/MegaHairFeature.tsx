"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { SERVICES } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import Visual from "./Visual";
import Button from "./Button";
import { Fade, SplitTitle } from "./motion";

/** Seção marfim: foto com clip-path diagonal, texto e contador de etapas com linha desenhada no scroll. */
export default function MegaHairFeature() {
  const root = useRef<HTMLElement>(null);
  const mega = SERVICES[0];

  useGSAP(
    () => {
      if (reduceMotion() || !root.current) return;
      gsap.fromTo(
        ".mh-photo",
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        {
          clipPath: "polygon(0 0, 140% 0, 100% 100%, 0 100%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".mh-photo", start: "top 80%", once: true },
        },
      );
      gsap.fromTo(
        ".mh-line",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".mh-steps", start: "top 80%", end: "bottom 60%", scrub: 0.5 } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-light bg-ivory py-24 md:py-36">
      <div className="mx-auto grid max-w-[1440px] items-center gap-12 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="mh-photo lg:col-span-6">
          <Visual photo={firstPhoto(mega.fotoKey)} num="01" label="Mega Hair" className="aspect-[4/5] w-full bg-sand !text-ink" />
        </div>
        <div className="lg:col-span-6">
          <Fade as="p" className="label mb-6 text-champagne-deep">
            Carro-chefe
          </Fade>
          <SplitTitle
            lines={["Mega Hair com", <em key="e" className="italic-champagne">avaliação.</em>]}
            className="font-display text-[clamp(44px,6vw,92px)]"
          />
          <Fade as="p" className="mt-8 max-w-lg text-[18px] text-mute" delay={0.1}>
            Descubra a técnica, o comprimento e o volume ideais para você. Tudo começa com uma conversa e uma avaliação individual.
          </Fade>

          <ol className="mh-steps relative mt-14 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            <span className="mh-line absolute left-0 top-[9px] hidden h-px w-full origin-left bg-champagne-deep sm:block" aria-hidden="true" />
            {mega.etapas?.map((e, i) => (
              <li key={e.titulo} className="relative">
                <span className="relative mb-4 block h-[19px] w-[19px] rotate-45 border border-champagne-deep bg-ivory" aria-hidden="true" />
                <span className="label text-[11px] text-mute">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1 font-display text-[22px] leading-tight">{e.titulo}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/agendar/?servico=avaliacao-mega-hair" variant="primary">
              Agendar avaliação
            </Button>
            <Button href="/servicos/mega-hair/">Saber mais</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
