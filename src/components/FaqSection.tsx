import { FAQ } from "@/content/faq";
import HairStrands from "./HairStrands";
import Accordion from "./Accordion";
import { Fade, FillTitle } from "./motion";

/** FAQ da Home: título que preenche, cápsula alta de foto e acordeão. */
export default function FaqSection() {
  return (
    <section className="on-light relative overflow-hidden bg-sand py-20 md:py-28" aria-labelledby="faq-home">
      <HairStrands className="pointer-events-none absolute -left-10 bottom-0 hidden h-[80%] w-auto md:block" />
      <div className="relative mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Fade as="p" className="eyebrow mb-6">
            <span id="faq-home">Perguntas</span>
          </Fade>
          <FillTitle
            lines={["Tudo o que", <em key="e" className="italic">você precisa saber.</em>]}
            className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-[1.05]"
          />
        </div>
        <div className="lg:col-span-7 lg:pt-6">
          <Accordion items={FAQ.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
