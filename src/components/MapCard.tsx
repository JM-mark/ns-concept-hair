"use client";

import { useState } from "react";
import { SITE, whatsappLink } from "@/content/site";
import { asset } from "@/lib/asset";
import Button from "./Button";

/** Card de localização: mapa escuro sem rolagem, pino próprio com pulso, endereço, horário e botões. */
export default function MapCard({ mapHeight = "h-[320px]", detalhes = true }: { mapHeight?: string; detalhes?: boolean }) {
  const e = SITE.endereco;
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="overflow-hidden rounded-[4px] border border-champagne/20 bg-graphite">
      <div className={`relative ${mapHeight} overflow-hidden bg-[#151413]`}>
        {/* mapa estático (fallback) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/brand/mapa-escuro.svg")} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden="true" />
        <iframe
          title="Mapa: NS Concept Hair, Indaiatuba"
          src={SITE.mapsEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          tabIndex={-1}
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute inset-0 h-full w-full border-0 transition-opacity duration-700"
          style={{ filter: "grayscale(1) invert(0.92) contrast(0.85) brightness(0.85) sepia(0.15)", opacity: loaded ? 1 : 0 }}
        />
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
          <span className="pin-pulse absolute inset-0 rounded-full border border-champagne" />
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-champagne">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ns-monograma-escuro.png")} alt="" className="h-6 w-auto" />
          </span>
        </div>
        <a href={SITE.maps} target="_blank" rel="noopener noreferrer" aria-label="Abrir o mapa no Google Maps" className="absolute inset-0 z-20" />
      </div>
      {detalhes && (
      <div className="p-6 md:p-7">
        <address className="not-italic">
          <span className="block text-[15px] font-normal leading-relaxed text-ivory">
            {e.rua} — {e.complemento}
          </span>
          <span className="mt-1 block text-[13px] tracking-[0.02em] text-champagne/75">
            {e.bairro} · {e.cidade}/{e.uf}
          </span>
        </address>
        <hr className="my-4 border-0 border-t border-champagne/15" />
        <p className="text-[13px] tracking-[0.02em] text-champagne/75">Ter a sex 8h–19h · Sáb 8h–18h</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={SITE.rotaMaps} variant="primary">
            Como chegar
          </Button>
          <Button href={whatsappLink()}>WhatsApp</Button>
        </div>
      </div>
      )}
    </div>
  );
}

