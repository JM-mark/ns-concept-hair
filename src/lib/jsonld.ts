import { SITE } from "@/content/site";

// HairSalon sem aggregateRating e sem review. TODO openingHoursSpecification quando o horário completo for confirmado.
export const hairSalonJsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: SITE.nome,
  url: SITE.url,
  description: SITE.descricao,
  telephone: "+5519993514120",
  email: SITE.email,
  image: `${SITE.url}og.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${SITE.endereco.rua}, ${SITE.endereco.complemento}`,
    addressLocality: SITE.endereco.cidade,
    addressRegion: SITE.endereco.uf,
    postalCode: SITE.endereco.cep,
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
  sameAs: [SITE.instagram, SITE.linkBio],
};
