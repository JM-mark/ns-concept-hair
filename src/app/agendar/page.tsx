import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStepper from "@/components/BookingStepper";

export const metadata: Metadata = {
  title: "Agendar horário",
  description:
    "Escolha serviço, profissional, data e horário e envie o pedido pelo WhatsApp. O salão confirma o horário com você.",
  alternates: { canonical: "agendar/" },
};

export default function AgendarPage() {
  return (
    <section className="min-h-screen bg-ink pb-28 pt-32 md:pt-40">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <Suspense fallback={<p className="text-mute">Carregando…</p>}>
          <BookingStepper />
        </Suspense>
      </div>
    </section>
  );
}
