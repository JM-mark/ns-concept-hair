import { SITE } from "@/content/site";
import type { Service } from "@/content/services";
import { SEO_SERVICOS } from "@/content/seo";

export const SALAO_ID = `${SITE.url}#salao`;

// HairSalon sem aggregateRating e sem review. Horário do post do salão e do Google Maps (TODO confirmar segunda).
// priceRange só entra se o salão confirmar.
export const hairSalonJsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": SALAO_ID,
  name: SITE.nome,
  url: SITE.url,
  description: SITE.descricao,
  telephone: "+5519993514120",
  email: SITE.email,
  image: `${SITE.url}og.jpg`,
  hasMap: SITE.maps,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.endereco.rua}, ${SITE.endereco.complemento}`,
    addressLocality: SITE.endereco.cidade,
    addressRegion: SITE.endereco.uf,
    postalCode: SITE.endereco.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "18:00" },
  ],
  sameAs: [SITE.instagram, SITE.linkBio],
};

/** Trilha de navegação: o primeiro item é sempre o Início. `path` relativo a SITE.url, sem barra inicial. */
export function breadcrumbJsonLd(itens: { nome: string; path: string }[]) {
  const todos = [{ nome: "Início", path: "" }, ...itens];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: todos.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.nome, item: `${SITE.url}${it.path}` })),
  };
}

/** Service de uma página de serviço; o provedor aponta para o HairSalon da Home. */
export function serviceJsonLd(s: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.nome,
    serviceType: s.nome,
    description: SEO_SERVICOS[s.slug]?.descricao ?? s.intro,
    url: `${SITE.url}servicos/${s.slug}/`,
    provider: { "@type": "HairSalon", "@id": SALAO_ID, name: SITE.nome },
    areaServed: { "@type": "City", name: "Indaiatuba" },
  };
}
