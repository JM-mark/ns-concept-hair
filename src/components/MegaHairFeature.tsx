"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { firstPhoto } from "@/content/photos";
import { asset } from "@/lib/asset";
import Button from "./Button";
import StepsRow from "./StepsRow";
import { Fade, SplitTitle } from "./motion";

/** Mega Hair em destaque: bloco único, split, de no máximo uma tela. A foto entra com clip-path na diagonal. */
export default function MegaHairFeature() {
  const root = useRef<HTMLElement>(null);
  const foto = firstPhoto("home-mega-feature");

  useGSAP(
    () => {
      if (reduceMotion() || !root.current) return;
      gsap.fromTo(
        ".mh-photo",
        { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
        { clipPath: "polygon(0 0, 140% 0, 100% 100%, 0 100%)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".mh-photo", start: "top 80%", once: true } },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-light bg-sand py-20 md:py-24" aria-labelledby="mh-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          {foto && (
            <div className="mh-photo relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-[16px] bg-espresso lg:max-h-[78vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(foto.src800)}
                srcSet={`${asset(foto.src800)} 800w, ${asset(foto.src)} 2000w`}
                sizes="(min-width:1024px) 40vw, 90vw"
                alt={foto.alt}
                width={foto.w}
                height={foto.h}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="lg:col-span-7">
          <Fade as="p" className="eyebrow mb-5">
            Carro-chefe
          </Fade>
          <SplitTitle
            lines={["Mais que um alongamento,", <em key="e" className="italic">uma experiência.</em>]}
            className="font-display text-[clamp(36px,4.4vw,64px)] font-medium leading-[1.05] text-bronze"
          />
          <p id="mh-title" className="sr-only">
            Mega Hair com avaliação
          </p>
          <Fade as="p" className="mt-6 max-w-lg text-[17px] text-bronze-deep" delay={0.1}>
            Descubra a técnica, o comprimento e o volume ideais para você. Tudo começa com uma conversa e uma avaliação individual.
          </Fade>
          <StepsRow className="mt-10" />
          <div className="mt-10 flex flex-wrap gap-3">
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
