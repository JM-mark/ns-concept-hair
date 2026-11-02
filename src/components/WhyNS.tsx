"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { photosFor } from "@/content/photos";
import { asset } from "@/lib/asset";
import { FillTitle, Fade } from "./motion";

const LABELS = ["Mega Hair invisível", "Coloração personalizada", "Visagismo"];

/** Seção areia logo após o hero: declaração que preenche no scroll, 3 fotos em cápsula e 3 rótulos. */
export default function WhyNS() {
  const root = useRef<HTMLElement>(null);
  const caps = photosFor("why");

  useGSAP(
    () => {
      if (reduceMotion() || !root.current) return;
      gsap.from(".why-cap", {
        scale: 0.9,
        rotate: -3,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: ".why-caps", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="on-light bg-sand pb-20 pt-24 md:pb-24 md:pt-32" aria-labelledby="why-title">
      <div className="mx-auto max-w-[1240px] px-5 text-center md:px-10">
        <Fade as="p" className="eyebrow mb-10">
          <span id="why-title">Por que a NS</span>
        </Fade>
        <FillTitle
          className="font-display text-[clamp(30px,4vw,56px)] font-medium leading-[1.12]"
          lines={[
            "Beleza, cuidado e experiência",
            <em key="e" className="italic">em cada detalhe,</em>,
            "do primeiro atendimento ao último fio.",
          ]}
        />

        <div className="why-caps mt-16 flex items-center justify-center">
          {caps.map((p, i) => (
            <div
              key={p.src}
              className="why-cap relative h-[190px] w-[120px] shrink-0 overflow-hidden rounded-full border-2 border-sand shadow-[0_10px_30px_rgb(94_70_48/0.18)] md:h-[220px] md:w-[140px]"
              style={{ marginLeft: i ? -24 : 0, zIndex: caps.length - i }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.src800)} alt={p.alt} width={p.w} height={p.h} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <ul className="mx-auto mt-16 grid max-w-[900px] gap-8 md:grid-cols-3 md:gap-0">
          {LABELS.map((l, i) => (
            <li key={l} className={`px-6 ${i ? "md:border-l md:border-bronze-deep/30" : ""}`}>
              <p className="eyebrow mb-3 !text-[11px]">0{i + 1}</p>
              <p className="font-display text-[clamp(22px,2.4vw,30px)] font-medium leading-tight text-bronze-deep">{l}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
