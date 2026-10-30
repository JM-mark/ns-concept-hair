import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStepper from "@/components/BookingStepper";
import { firstPhoto } from "@/content/photos";
import { asset } from "@/lib/asset";

export const metadata: Metadata = {
  title: "Agendar horário",
  description:
    "Escolha serviço, data e horário e envie o pedido pelo WhatsApp. O salão confirma o horário com você.",
  alternates: { canonical: "agendar/" },
};

export default function AgendarPage() {
  const bg = firstPhoto("agendar-bg");
  return (
    <section className="relative min-h-screen overflow-hidden bg-espresso pb-16 pt-28 md:pt-32">
      {bg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset(bg.src)} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" style={bg.lqip ? { backgroundImage: `url(${bg.lqip})`, backgroundSize: "cover" } : undefined} />
      )}
      <div className="absolute inset-0 bg-ink/40" aria-hidden="true" />
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
