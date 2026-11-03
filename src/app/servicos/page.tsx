import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ServicesGrid from "@/components/ServicesGrid";
import CtaBand from "@/components/CtaBand";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { SEO_SERVICOS_LISTA } from "@/content/seo";

export const metadata: Metadata = {
  title: { absolute: SEO_SERVICOS_LISTA.titulo },
  description: SEO_SERVICOS_LISTA.descricao,
  alternates: { canonical: "servicos/" },
};

export default function ServicosPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ nome: "Serviços", path: "servicos/" }])} />
      <PageHero
        label="Serviços"
        lines={["Seis formas de", "cuidar."]}
        intro="Do Mega Hair às sobrancelhas, cada serviço começa com uma conversa sobre o que você quer."
      />
      <ServicesGrid variant="full" />
      <CtaBand />
    </>
  );
}
