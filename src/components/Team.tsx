"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import { TEAM } from "@/content/team";
import { serviceBySlug } from "@/content/services";
import { asset } from "@/lib/asset";
import { ArrowIcon } from "./Icons";
import { Fade, FillTitle } from "./motion";

const MEMBERS = TEAM.filter((m) => m.funcao);
const OUTROS = TEAM.filter((m) => !m.funcao).map((m) => m.nome);

/**
 * Carrossel com uma pessoa por vez, sem fotos de profissionais: função, nome, frase neutra e especialidades.
 * Painel tipográfico à direita com moldura deslocada. Setas redondas, pontinhos e arraste no celular. Sem autoplay.
 */
export default function Team({ titulo = true }: { titulo?: boolean }) {
  const [i, setI] = useState(0);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);
  const drag = useRef(0);
  const m = MEMBERS[i];
  const especialidades = m.servicos.map((s) => serviceBySlug(s)?.nome).filter(Boolean) as string[];

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (reduceMotion()) return;
      gsap.fromTo(".tm-panel", { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }, { clipPath: "polygon(0 0, 140% 0, 100% 100%, 0 100%)", duration: 0.9, ease: "expo.out" });
      gsap.fromTo(".tm-text > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.07 });
    },
    { scope: root, dependencies: [i] },
  );

  const go = (d: number) => setI((v) => (v + d + MEMBERS.length) % MEMBERS.length);
  const arrow =
    "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-bronze text-ivory transition-colors duration-300 hover:bg-bronze-deep focus-visible:bg-bronze-deep";

  return (
    <section ref={root} className="on-light bg-sand py-24 md:py-36" aria-labelledby="tm-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {titulo && (
          <div className="mb-14 md:mb-20">
            <Fade as="p" className="eyebrow mb-6">
              <span id="tm-title">Equipe</span>
            </Fade>
            <FillTitle lines={["Quem cuida", <em key="e" className="italic">de você.</em>]} className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-[1.05]" />
          </div>
        )}

        <div
          className="grid items-center gap-12 lg:grid-cols-12"
          onPointerDown={(e) => (drag.current = e.clientX)}
          onPointerUp={(e) => {
            const dx = e.clientX - drag.current;
            if (Math.abs(dx) > 50 && e.pointerType !== "mouse") go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="lg:col-span-6" aria-live="polite">
            <div className="tm-text">
              <p className="eyebrow mb-5">{m.funcao}</p>
              <h3 className="font-display text-[clamp(44px,5.6vw,72px)] font-medium leading-[1.02] text-bronze">{m.nome}</h3>
              {m.frase && <p className="mt-6 max-w-md text-[17px] text-bronze-deep">{m.frase}</p>}
              {especialidades.length > 0 && (
                <div className="mt-8">
                  <p className="eyebrow mb-3 !text-[11px]">Especialidades</p>
                  <ul className="space-y-2">
                    {especialidades.map((e) => (
                      <li key={e} className="flex items-center gap-3 text-[16px]">
                        <span className="inline-block h-[6px] w-[6px] rotate-45 bg-bronze-deep" aria-hidden="true" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-10 flex items-center gap-4">
              <button type="button" onClick={() => go(-1)} aria-label="Pessoa anterior" className={arrow}>
                <ArrowIcon className="h-5 w-5 rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Próxima pessoa" className={arrow}>
                <ArrowIcon className="h-5 w-5" />
              </button>
              <div className="ml-3 flex" role="tablist" aria-label="Escolher pessoa">
                {MEMBERS.map((x, k) => (
                  <button
                    key={x.nome}
                    role="tab"
                    aria-selected={k === i}
                    aria-label={x.nome}
                    onClick={() => setI(k)}
                    className="flex h-11 w-7 items-center justify-center"
                  >
                    <span className={`block h-[6px] w-[6px] rounded-full transition-all duration-300 ${k === i ? "scale-150 bg-bronze-deep" : "bg-bronze-deep/40"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <span className="pointer-events-none absolute inset-0 translate-x-2 translate-y-2 rounded-[18px] border border-bronze-deep/60" aria-hidden="true" />
            <div className="tm-panel relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[16px] bg-espresso lg:aspect-[4/4.4]">
              <span className="font-display text-[clamp(180px,24vw,340px)] italic leading-none text-champagne/20" aria-hidden="true">
                {m.nome[0]}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset("/brand/ns-monograma-champagne.png")} alt="" className="absolute bottom-6 right-6 h-12 w-auto opacity-80" />
            </div>
          </div>
        </div>

        <p className="mt-14 text-[15px] text-bronze-deep">
          <span className="eyebrow mr-3 !text-[11px]">Também na equipe</span>
          {OUTROS.join(", ")}
        </p>
      </div>
    </section>
  );
}
