import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES, serviceBySlug } from "@/content/services";
import { SEO_SERVICOS } from "@/content/seo";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/jsonld";
import ServicePage from "@/components/ServicePage";
import JsonLd from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  const seo = SEO_SERVICOS[slug];
  if (!s || !seo) return {};
  const og = `og/og-${s.slug}.jpg`;
  return {
    title: { absolute: seo.titulo },
    description: seo.descricao,
    alternates: { canonical: `servicos/${s.slug}/` },
    openGraph: { type: "website", locale: "pt_BR", title: seo.titulo, description: seo.descricao, images: [{ url: og, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [og] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  return (
    <>
      <JsonLd
        data={[
          serviceJsonLd(s),
          breadcrumbJsonLd([
            { nome: "Serviços", path: "servicos/" },
            { nome: s.nome, path: `servicos/${s.slug}/` },
          ]),
        ]}
      />
      <ServicePage service={s} />
    </>
  );
}
