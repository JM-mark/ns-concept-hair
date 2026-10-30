import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import CtaBand from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Mega Hair, coloração, corte com visagismo, tratamentos, unhas e design de sobrancelhas em Indaiatuba.",
  alternates: { canonical: "servicos/" },
};

export default function ServicosPage() {
  return (
    <>
      <PageHero
        label="Serviços"
        lines={["Seis formas de", <em key="e" className="italic-champagne">cuidar.</em>]}
        intro="Do Mega Hair às sobrancelhas, cada serviço começa com uma conversa sobre o que você quer."
      />
      <ServicesGrid variant="full" />
      <CtaBand />
    </>
  );
}
