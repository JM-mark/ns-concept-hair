export type ResultCategory = "mega-hair" | "coloracao" | "corte" | "tratamentos";

export type ResultPair = {
  id: string;
  servico: string; // "Mega Hair", "Morena iluminada"
  categoria: ResultCategory;
  antes: string; // caminho em public/
  depois: string;
  post: string; // URL do post original
};

// Só pares reais publicados pelo salão. Vazio até a lista de fotos ser aprovada.
export const PAIRS: ResultPair[] = [];

export type GalleryItem = {
  id: string;
  categoria: ResultCategory;
  src: string;
  alt: string;
  post: string;
};
export const GALLERY: GalleryItem[] = [];
