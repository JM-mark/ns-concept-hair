import { firstPhoto } from "@/content/photos";
import Button from "./Button";
import StepsRow from "./StepsRow";
import Visual from "./Visual";
import { Fade, SplitTitle } from "./motion";

/** Mega Hair em destaque: foto retrato 4:5 inteira (~45% da largura), que entra "penteada"; título, etapas e botões. */
export default function MegaHairFeature() {
  const foto = firstPhoto("home-mega-feature");

  return (
    <section className="on-light bg-sand py-20 md:py-24" aria-labelledby="mh-title">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:px-10 lg:grid-cols-[45fr_55fr] lg:gap-16">
        <Visual photo={foto} label="Mega Hair" className="mx-auto aspect-[4/5] w-full max-w-[640px] lg:max-w-none" sizes="(min-width:1024px) 45vw, 90vw" />
        <div>
          <Fade as="p" className="eyebrow mb-5">
            02 — Carro-chefe
          </Fade>
          <SplitTitle as="h2" lines={["Mais que um alongamento,", "uma experiência."]} className="font-display text-[clamp(22px,3.3vw,48px)] leading-[1.08] text-bronze" />
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
