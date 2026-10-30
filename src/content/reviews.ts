// Trechos reais do Google (5 estrelas). TODO conferir texto exato e salvar o link de cada avaliação na ficha do Google.
// Sem nota média, sem contagem, sem aggregateRating.
export type Review = { nome: string; texto: string; url?: string };

export const REVIEWS: Review[] = [
  {
    nome: "Cinthia N.",
    texto:
      "Super recomendo a equipe NS Concept, desde o primeiro atendimento pelo WhatsApp até o dia dos procedimentos… você se sente uma princesa.",
  },
  {
    nome: "Luciana S.",
    texto:
      "Ambiente agradável, pessoas educadas, profissionais excelentes… Todos nos tratam muito bem, da recepção aos donos do salão… saio com a autoestima renovada.",
  },
  {
    nome: "Patricia B.",
    texto: "…é muito melhor do que eu imaginava… saí de lá renovada e feliz.",
  },
  {
    nome: "Nathalia P.",
    texto:
      "Todos os colaboradores e o espaço são bastante agradáveis… a Gi faz unhas impecáveis, a Sil te dá uma aula de visagismo.",
  },
];
