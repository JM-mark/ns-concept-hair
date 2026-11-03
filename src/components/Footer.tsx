import Link from "next/link";
import { asset } from "@/lib/asset";
import { AGENCIA, NAV, SITE, whatsappLink } from "@/content/site";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./Icons";

const circle =
  "flex h-12 w-12 items-center justify-center rounded-full border border-champagne/50 text-champagne transition-colors duration-300 hover:bg-champagne hover:text-ink";

export default function Footer() {
  const e = SITE.endereco;
  return (
    <footer className="grain relative border-t border-[var(--line)] bg-ink pb-24 pt-20 text-center lg:pb-12">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/ns-monograma-champagne.png")} alt="" aria-hidden="true" className="mx-auto h-28 w-auto md:h-36" />
        <p className="eyebrow mt-6 !text-[11px]">Concept Hair</p>

        <ul className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[...NAV, { href: "/agendar/", label: "Agendar" }].map((n) => (
            <li key={n.href}>
              <Link href={n.href} className="label link-line">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-8 text-[15px] text-ivory/85 md:grid-cols-3">
          <address className="not-italic">
            <p className="eyebrow mb-3 !text-[11px]">Endereço</p>
            {e.rua}, {e.complemento}
            <br />
            {e.bairro}, {e.cidade}/{e.uf}
            <br />
            {e.cep}
          </address>
          <div>
            <p className="eyebrow mb-3 !text-[11px]">Horário</p>
            Ter a sex, 8h às 19h
            <br />
            Sáb, 8h às 18h
            <br />
            <span className="text-mute">Domingo e segunda fechados</span>
          </div>
          <div>
            <p className="eyebrow mb-3 !text-[11px]">Contato</p>
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line">
              {SITE.telefone}
            </a>
            <br />
            <a href={`mailto:${SITE.email}`} className="link-line break-all">
              {SITE.email}
            </a>
          </div>
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={circle}>
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={circle}>
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href={`mailto:${SITE.email}`} aria-label="E-mail" className={circle}>
            <MailIcon className="h-5 w-5" />
          </a>
        </div>

        <div className="hairline mt-12" />
        <div className="mt-6 flex flex-col justify-between gap-2 text-[13px] text-mute sm:flex-row">
          <p>© 2026 NS Concept Hair</p>
          <p>Site prévia por {AGENCIA}</p>
        </div>
      </div>
    </footer>
  );
}
