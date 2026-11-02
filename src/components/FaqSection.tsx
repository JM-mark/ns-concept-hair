import { FAQ } from "@/content/faq";
import Accordion from "./Accordion";
import { Fade, FillTitle } from "./motion";

/** FAQ da Home: título à esquerda e acordeão à direita, em areia. */
export default function FaqSection() {
  return (
    <section className="on-light relative bg-sand py-20 md:py-28" aria-labelledby="faq-home">
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Fade as="p" className="eyebrow mb-6">
            <span id="faq-home">05 — Perguntas</span>
          </Fade>
          <FillTitle lines={["Tudo o que", "você precisa saber."]} className="font-display text-[clamp(24px,3.4vw,50px)] leading-[1.05]" />
        </div>
        <div className="lg:col-span-7 lg:pt-6">
          <Accordion items={FAQ.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
