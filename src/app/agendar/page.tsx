import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Suspense } from "react";
import AgendarClient from "@/components/AgendarClient";
import { SERVICES } from "@/content/services";

export const metadata: Metadata = {
  title: { absolute: "Agendar horário online | NS Concept Hair, Indaiatuba" },
  description: "Escolha o serviço, o dia e o horário e envie o pedido pelo WhatsApp. O NS Concept Hair, em Indaiatuba (SP), confirma o horário com você. Agende online.",
  alternates: { canonical: "agendar/" },
};

export default function AgendarPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ nome: "Agendar", path: "agendar/" }])} />
    <section className="grain relative min-h-screen overflow-hidden bg-espresso pb-24 pt-28 md:pt-36">
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <h1 className="font-display text-[clamp(26px,5.2vw,64px)] leading-[1.02]">Agende seu horário</h1>
        <p className="mb-10 mt-5 max-w-xl text-[17px] text-ivory/80 md:mb-14">Escolha o serviço, o dia e o horário. O salão confirma pelo WhatsApp.</p>
        <Suspense
          fallback={
            <div className="glass w-full max-w-[620px] p-6 md:p-10">
              <h2 className="font-display text-[clamp(22px,2.9vw,34px)]">Qual serviço você quer?</h2>
              <ul className="mt-6 space-y-2 text-[17px] text-ivory/85">
                {SERVICES.map((s) => (
                  <li key={s.slug}>{s.nome}</li>
                ))}
              </ul>
            </div>
          }
        >
          <AgendarClient />
        </Suspense>
      </div>
    </section>
    </>
  );
}
