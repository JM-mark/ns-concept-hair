import { FillTitle, Fade } from "./motion";

const LABELS = ["Mega Hair invisível", "Coloração personalizada", "Visagismo"];

/** Seção areia logo após o hero: título grande alinhado à esquerda, em 2 linhas, e 3 rótulos em linha no grid. */
export default function WhyNS() {
  return (
    <section className="on-light relative bg-sand py-20 md:py-28" aria-labelledby="why-title">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Fade as="p" className="eyebrow mb-8">
          <span id="why-title">Por que a NS</span>
        </Fade>
        <FillTitle
          className="font-display text-[clamp(22px,3.7vw,54px)] leading-[1.1]"
          lines={["Beleza, cuidado e experiência", "em cada detalhe."]}
        />
        <Fade as="p" className="mt-6 max-w-md text-[17px] text-bronze-deep" delay={0.1}>
          Do primeiro atendimento ao último fio.
        </Fade>

        <ul className="mt-14 grid gap-6 border-t border-bronze-deep/30 md:grid-cols-3 md:gap-0">
          {LABELS.map((l, i) => (
            <li key={l} className={`pt-5 ${i ? "md:border-l md:border-bronze-deep/30 md:pl-8" : ""}`}>
              <p className="mb-2 text-[13px] text-bronze-deep">0{i + 1}</p>
              <p className="font-display text-[clamp(16px,1.7vw,24px)] leading-tight text-bronze-deep">{l}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
