export type Photo = {
  src: string; // versão 2000px, caminho em public/ (use asset())
  src800: string;
  alt: string;
  fonte: string; // URL de origem
  lqip?: string;
  w: number;
  h: number;
  // TODO confirmar uso com o salão
};

// Preenchido por scripts/process-photos.mjs depois que a lista for aprovada.
// Chaves: mega-hair, coloracao, corte, tratamentos, unhas, sobrancelhas, salao, equipe, feed
export const PHOTOS: Record<string, Photo[]> = {};

export const photosFor = (key?: string): Photo[] => (key ? (PHOTOS[key] ?? []) : []);
export const firstPhoto = (key?: string): Photo | undefined => photosFor(key)[0];
