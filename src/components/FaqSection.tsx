import { FAQ } from "@/content/faq";
import { firstPhoto } from "@/content/photos";
import { asset } from "@/lib/asset";
import Accordion from "./Accordion";
import { Fade, FillTitle, PhotoReveal } from "./motion";

/** FAQ da Home: título que preenche, cápsula alta de foto e acordeão. */
export default function FaqSection() {
  const foto = firstPhoto("faq");
  return (
    <section className="on-light bg-sand py-24 md:py-36" aria-labelledby="faq-home">
      <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Fade as="p" className="eyebrow mb-6">
            <span id="faq-home">Perguntas</span>
          </Fade>
          <FillTitle
            lines={["Tudo o que", <em key="e" className="italic">você precisa saber.</em>]}
            className="font-display text-[clamp(44px,5vw,72px)] font-medium leading-[1.05]"
          />
          {foto && (
            <PhotoReveal className="mt-12 hidden aspect-[3/5] w-full max-w-[320px] overflow-hidden rounded-full lg:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(foto.src800)} alt={foto.alt} width={foto.w} height={foto.h} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </PhotoReveal>
          )}
        </div>
        <div className="lg:col-span-7 lg:pt-6">
          <Accordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}
