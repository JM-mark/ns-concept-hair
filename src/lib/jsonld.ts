import { SITE } from "@/content/site";

// HairSalon sem aggregateRating e sem review. Horário do post do salão e do Google Maps (TODO confirmar segunda).
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
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "18:00" },
  ],
  sameAs: [SITE.instagram, SITE.linkBio],
};
