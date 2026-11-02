import Button from "./Button";
import { SplitTitle, Fade } from "./motion";

export default function CtaBand({ servico, titulo }: { servico?: string; titulo?: string }) {
  const href = servico ? `/agendar/?servico=${servico}` : "/agendar/";
  return (
    <section className="grain relative bg-graphite py-24 md:py-36">
      <div className="mx-auto max-w-[1100px] px-5 text-center md:px-10">
        <Fade as="p" className="eyebrow mb-8">
          Agendamento
        </Fade>
        <SplitTitle
          className="font-display text-[clamp(24px,4.2vw,60px)]"
          lines={titulo ? [titulo] : ["Reserve o seu", "momento."]}
        />
        <Fade as="p" className="mx-auto mt-8 max-w-md text-[17px] text-mute" delay={0.1}>
          Escolha serviço, dia e horário. O salão confirma pelo WhatsApp.
        </Fade>
        <Fade className="mt-10 flex justify-center" delay={0.15}>
          <Button href={href} variant="primary">
            Agendar horário
          </Button>
        </Fade>
      </div>
    </section>
  );
}
