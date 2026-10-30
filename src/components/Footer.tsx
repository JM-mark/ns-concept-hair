import Link from "next/link";
import { asset } from "@/lib/asset";
import { AGENCIA, NAV, SITE, whatsappLink } from "@/content/site";
import { InstagramIcon, WhatsAppIcon } from "./Icons";

export default function Footer() {
  const e = SITE.endereco;
  return (
    <footer className="grain relative border-t border-[var(--line)] bg-ink pb-24 pt-20 lg:pb-12">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ns-logo-completo-champagne.png")} alt="NS Concept Hair" className="h-28 w-auto" />
            <p className="mt-6 max-w-xs text-[15px] text-mute">{SITE.tagline} Beleza, cuidado e experiência em cada detalhe.</p>
          </div>

          <div>
            <h3 className="label mb-5 !font-sans text-champagne">Endereço</h3>
            <address className="not-italic text-[15px] leading-relaxed text-ivory/90">
              {e.rua}, {e.complemento}
              <br />
              {e.bairro}
              <br />
              {e.cidade}/{e.uf}, {e.cep}
            </address>
            <a href={SITE.rotaMaps} target="_blank" rel="noopener noreferrer" className="label link-line mt-4 inline-block text-champagne">
              Como chegar
            </a>
          </div>

          <div>
            <h3 className="label mb-5 !font-sans text-champagne">Horário</h3>
            <p className="text-[15px] text-ivory/90">{SITE.horarioResumo}</p>
            <p className="mt-3 text-[13px] text-mute">{SITE.lgbt}</p>
            <h3 className="label mb-3 mt-8 !font-sans text-champagne">Contato</h3>
            <ul className="space-y-2 text-[15px]">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2">
                  <WhatsAppIcon className="h-4 w-4" /> {SITE.telefone}
                </a>
              </li>
              <li>
                <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2">
                  <InstagramIcon className="h-4 w-4" /> @nsconcepthair
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="label mb-5 !font-sans text-champagne">Navegar</h3>
            <ul className="space-y-2 text-[15px]">
              {[...NAV, { href: "/agendar/", label: "Agendar" }].map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-line">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-16" />
        <div className="mt-6 flex flex-col justify-between gap-2 text-[13px] text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} NS Concept Hair. Todos os direitos reservados.</p>
          <p>Site prévia por {AGENCIA}</p>
        </div>
      </div>
    </footer>
  );
}
