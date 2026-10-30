import { GENERATED_PAIRS } from "./pairs.generated";

export type ResultCategory = "mega-hair" | "coloracao" | "corte" | "tratamentos";

export type ResultPair = {
  id: string;
  servico: string; // "Mega Hair", "Moreno iluminado"
  categoria: ResultCategory;
  antes: string; // caminho em public/
  depois: string;
  post: string; // URL do post original
};

/**
 * Só pares reais publicados pelo salão (mesma pessoa, mesmo enquadramento, mesma luz).
 * Os 3 primeiros aparecem na Home; os demais, só em /resultados.
 */
export const PAIRS: ResultPair[] = GENERATED_PAIRS;
export const HOME_PAIRS = PAIRS.slice(0, 3);
export const MORE_PAIRS = PAIRS.slice(3);

export type GalleryItem = {
  id: string;
  categoria: ResultCategory;
  src: string;
  alt: string;
  post: string;
};
export const GALLERY: GalleryItem[] = [];
