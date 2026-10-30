import { asset } from "@/lib/asset";

export const SITE = {
  nome: "NS Concept Hair",
  tagline: "Seu espaço para ser cuidada.",
  descricao:
    "Salão em Indaiatuba: Mega Hair, coloração, visagismo, tratamentos, unhas e sobrancelhas. Beleza, cuidado e experiência em cada detalhe.",
  url: "https://jm-mark.github.io/ns-concept-hair/",
  endereco: {
    rua: "R. Miguel Fernandes García Filho, 418",
    complemento: "2º andar",
    bairro: "Jardim Maison Du Parc",
    cidade: "Indaiatuba",
    uf: "SP",
    cep: "13331-014",
  },
  geo: { lat: -23.0761675, lng: -47.2161908 },
  telefone: "(19) 99351-4120",
  whatsapp: "5519993514120",
  email: "Nettosillvaconcepthair@gmail.com",
  instagram: "https://www.instagram.com/nsconcepthair/",
  instagramDiretor: "https://www.instagram.com/nettosillva.ns/",
  linkBio: "https://bio.site/nsconcepthair",
  maps: "https://www.google.com/maps/search/?api=1&query=NS+Concept+Hair+Indaiatuba",
  mapsEmbed:
    "https://www.google.com/maps?q=-23.0761675,-47.2161908&hl=pt-BR&z=17&output=embed",
  rotaMaps: "https://www.google.com/maps/dir/?api=1&destination=-23.0761675,-47.2161908",
  // Post do salão no Instagram + Google Maps: ter a sex 8h-19h, sáb 8h-18h. TODO confirmar segunda
  horarioResumo: "Ter a sex, 8h às 19h · Sáb, 8h às 18h",
  lgbt: "Espaço LGBTQ+ friendly",
  // Vídeo do hero: coloque true quando os arquivos existirem em public/video/
  heroVideo: false,
  heroVideoSrc: {
    mp4: asset("/video/hero-1080.mp4"),
    mp4Mobile: asset("/video/hero-720.mp4"),
    webm: asset("/video/hero.webm"),
    poster: asset("/video/poster.webp"),
  },
} as const;

export const whatsappLink = (texto?: string) =>
  `https://wa.me/${SITE.whatsapp}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;

export const NAV = [
  { href: "/servicos/", label: "Serviços", children: true },
  { href: "/resultados/", label: "Resultados" },
  { href: "/o-salao/", label: "O Salão" },
  { href: "/avaliacoes/", label: "Avaliações" },
  { href: "/contato/", label: "Contato" },
] as const;

// TODO confirmar o nome da agência exibido no rodapé
export const AGENCIA = "Kalenza Digital";
