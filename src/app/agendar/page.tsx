import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStepper from "@/components/BookingStepper";
import HairStrands from "@/components/HairStrands";

export const metadata: Metadata = {
  title: "Agendar horário",
  description:
    "Escolha serviço, data e horário e envie o pedido pelo WhatsApp. O salão confirma o horário com você.",
  alternates: { canonical: "agendar/" },
};

export default function AgendarPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-espresso pb-16 pt-28 md:pt-32">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block" aria-hidden="true">
        <HairStrands className="h-full w-full" color="var(--champagne)" opacity={0.18} />
      </div>
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="glass w-full max-w-[560px] p-6 md:p-10">
          <Suspense fallback={<p className="text-ivory/70">Carregando…</p>}>
            <BookingStepper />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
