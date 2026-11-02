"use client";

import HairStrands from "./HairStrands";
import { FillTitle, Fade } from "./motion";

const LABELS = ["Mega Hair invisível", "Coloração personalizada", "Visagismo"];

/** Seção areia logo após o hero: declaração que preenche no scroll, 3 fotos em cápsula e 3 rótulos. */
export default function WhyNS() {
  return (
    <section className="on-light relative overflow-hidden bg-sand py-20 md:py-28" aria-labelledby="why-title">
      <HairStrands className="pointer-events-none absolute -right-10 top-0 hidden h-full w-auto md:block" />
      <div className="relative mx-auto max-w-[1240px] px-5 text-center md:px-10">
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

        <ul className="mx-auto mt-14 grid max-w-[900px] gap-8 md:grid-cols-3 md:gap-0">
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
