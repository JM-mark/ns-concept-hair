"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";

const TEXT =
  "Transformando autoestima com exclusividade. Aqui o cabelo é só o começo: cada atendimento é pensado para que você saia se sentindo cuidada.";

/** Frase grande que "acende" palavra por palavra no scroll (opacidade 0,15 → 1). */
export default function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const words = ref.current?.querySelectorAll("[data-w]");
      if (!words?.length || reduceMotion()) return;
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: 0.5 },
        },
      );
    },
    { scope: ref },
  );
  return (
    <section className="bg-ink py-28 md:py-44">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <p className="label mb-10 text-champagne">O salão</p>
        <p ref={ref} className="font-display text-[clamp(30px,5vw,68px)] leading-[1.12] tracking-[-0.02em]">
          {TEXT.split(" ").map((w, i) => (
            <span key={i} data-w className="inline-block pr-[0.28em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
