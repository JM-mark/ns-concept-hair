import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { SITE, whatsappLink } from "@/content/site";
import MapCard from "@/components/MapCard";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: { absolute: "Contato, endereço e horário | NS Concept Hair, Indaiatuba" },
  description: "Fale com o NS Concept Hair pelo WhatsApp ou venha nos visitar: endereço no 2º andar em Indaiatuba (SP), horário de funcionamento e como chegar.",
  alternates: { canonical: "contato/" },
};

export default function ContatoPage() {
  const e = SITE.endereco;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ nome: "Contato", path: "contato/" }])} />
      <PageHero
        label="Contato"
        lines={["Vamos", "conversar."]}
        intro="Fale com o salão pelo WhatsApp ou venha nos visitar."
      >
        <Button href={whatsappLink()} variant="primary">
          Chamar no WhatsApp
        </Button>
        <Button href="/agendar/">Agendar horário</Button>
      </PageHero>

      <section className="bg-ink pb-28">
        <div className="mx-auto grid max-w-[1440px] gap-14 px-5 md:px-10 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-5">
            <div className="flex gap-4">
              <PinIcon className="mt-1 h-5 w-5 shrink-0 text-champagne" />
              <div>
                <h2 className="label mb-3 !font-sans text-champagne">Endereço</h2>
                <address className="not-italic text-[17px] leading-relaxed">
                  {e.rua}
                  <br />
                  <strong className="font-normal text-champagne">{e.complemento}</strong>, {e.bairro}
                  <br />
                  {e.cidade}/{e.uf}, {e.cep}
                </address>
                <p className="mt-3 text-[15px] text-mute">O salão fica no 2º andar.</p>
                <a href={SITE.rotaMaps} target="_blank" rel="noopener noreferrer" className="label link-line mt-4 inline-block text-champagne">
                  Como chegar
                </a>
              </div>
            </div>
            <div>
              <h2 className="label mb-3 !font-sans text-champagne">Horário</h2>
              <p className="text-[17px]">{SITE.horarioResumo}</p>
              <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="label link-line mt-3 inline-block text-champagne">
                Ver no Google Maps
              </a>
              <p className="mt-2 text-[15px] text-mute">Fechado aos domingos e às segundas.</p>
              <p className="mt-6 text-[15px] text-mute">{SITE.lgbt}.</p>
            </div>
            {/* TODO pedir ao salão uma foto atual da fachada (a placa do prédio ainda mostra o nome anterior) */}
            <ul className="space-y-3 text-[17px]">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 text-champagne" /> {SITE.telefone}
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="link-line inline-flex items-center gap-3 break-all">
                  <MailIcon className="h-5 w-5 shrink-0 text-champagne" /> {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-3">
                  <InstagramIcon className="h-5 w-5 text-champagne" /> @nsconcepthair
                </a>
              </li>
              <li>
                <a href={SITE.linkBio} target="_blank" rel="noopener noreferrer" className="label link-line text-champagne">
                  Link da bio
                </a>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7">
            <MapCard mapHeight="h-[380px] lg:h-[560px]" detalhes={false} />
          </div>
        </div>
      </section>
    </>
  );
}
