import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import { SITE, whatsappLink } from "@/content/site";
import { InstagramIcon, MailIcon, PinIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contato",
  description: "Endereço, horário, WhatsApp e como chegar ao NS Concept Hair, em Indaiatuba.",
  alternates: { canonical: "contato/" },
};

export default function ContatoPage() {
  const e = SITE.endereco;
  return (
    <>
      <PageHero
        label="Contato"
        lines={["Vamos", <em key="e" className="italic-champagne">conversar.</em>]}
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
              <p className="mt-2 text-[15px] text-mute">Para o horário completo, confira o Google Maps.</p>
              <a href={SITE.maps} target="_blank" rel="noopener noreferrer" className="label link-line mt-3 inline-block text-champagne">
                Ver no Google Maps
              </a>
              <p className="mt-6 text-[15px] text-mute">{SITE.lgbt}.</p>
            </div>
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
            <div className="relative aspect-[4/3] w-full overflow-hidden border border-[var(--line)] lg:aspect-[5/4]">
              <iframe
                title="Mapa: NS Concept Hair, Indaiatuba"
                src={SITE.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-dark absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
