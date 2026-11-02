import { GENERATED } from "./photos.generated";

export type Photo = {
  src: string; // versão até 2000px, caminho em public/ (use asset())
  src800: string;
  alt: string;
  fonte: string; // URL do post de origem
  lqip?: string;
  w: number;
  h: number;
  legenda?: string;
  // TODO confirmar uso com o salão
};

/**
 * Gerado por scripts/process-photos.mjs. Nenhuma foto repete entre lugares (node scripts/check-unique.mjs):
 * selo, why, jornada, home-* e faq (Home); list-* (/servicos); mega-hair, coloracao, corte, tratamentos, unhas (páginas dos serviços);
 * salao-detalhes (/o-salao); fachada (/contato).
 */
export const PHOTOS: Record<string, Photo[]> = GENERATED;

export const photosFor = (key?: string): Photo[] => (key ? (PHOTOS[key] ?? []) : []);
export const firstPhoto = (key?: string): Photo | undefined => photosFor(key)[0];
