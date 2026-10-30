// Trechos reais do Google, lidos da ficha pública do salão em 30/10/2026 (todos com 5 estrelas).
// Sem nota média, sem contagem, sem aggregateRating. Texto exato, encurtado com "…" quando preciso.
// TODO o Google não expõe link por avaliação: todos apontam para a ficha (SITE.maps). Conferir o texto antes da publicação oficial.
export type Review = { nome: string; texto: string; quando: string; url?: string };

export const REVIEWS: Review[] = [
  {
    nome: "Cinthia N.",
    quando: "4 meses atrás",
    texto:
      "Super recomendo a equipe NS Concept, desde o primeiro atendimento pelo WhatsApp até o dia dos procedimentos… você se sente uma princesa.",
  },
  {
    nome: "Luciana S.",
    quando: "3 meses atrás",
    texto:
      "Ambiente agradável, pessoas educadas, profissionais excelentes… Todos nos tratam muito bem, da recepção aos donos do salão… saio com a autoestima renovada.",
  },
  {
    nome: "Patricia B.",
    quando: "2 meses atrás",
    texto: "…é muito melhor do que eu imaginava… saí de lá renovada e feliz.",
  },
  {
    nome: "Nathalia P.",
    quando: "4 meses atrás",
    texto:
      "Todos os colaboradores e o espaço são bastante agradáveis… a Gi faz unhas impecáveis, a Sil te dá uma aula de visagismo.",
  },
  {
    nome: "Renata P.",
    quando: "4 meses atrás",
    texto:
      "Sempre sou bem recebida e me sinto acolhida por toda a equipe. Os profissionais são queridos, atenciosos e fazem seu trabalho com muito carinho e dedicação. É um ambiente agradável, onde me sinto à vontade e confiante.",
  },
  {
    nome: "Tabatha C.",
    quando: "3 meses atrás",
    texto:
      "O salão inteiro é maravilhoso, desde como somos recepcionados, até os resultados perfeitos dos profissionais que nos atendem. Eu saio de São Paulo para ir até ele porque vale muito.",
  },
  {
    nome: "Natalia G.",
    quando: "7 meses atrás",
    texto:
      "Amei o trabalho de vocês! Atendimento atencioso, tranquilo e rápido! O Netto e toda a equipe são uma simpatia e amei o resultado.",
  },
  {
    nome: "Fabiana L.",
    quando: "6 meses atrás",
    texto: "Atendimento e espaço incrível!! Você pede uma escova para acalmar o cabelo e sai com o cabelo incrível!!",
  },
  {
    nome: "Jamile K.",
    quando: "3 meses atrás",
    texto: "Lugar acolhedor e profissionais altamente qualificados!!!",
  },
  {
    nome: "Giovana D.",
    quando: "11 meses atrás",
    texto:
      "O ambiente é impecável, mas eu preciso falar sobre o ponto alto desse salão que é o atendimento… ambas muito simpáticas e extremamente profissionais, voltarei e recomendo muito",
  },
  {
    nome: "Brenda R.",
    quando: "4 meses atrás",
    texto:
      "Salão com serviço completo. Todos os profissionais capacitados, atenciosos e responsáveis. Tenho um carinho por esse lugar maravilhoso",
  },
  {
    nome: "Érika B.",
    quando: "1 ano atrás",
    texto:
      "Salão exemplar, atendimento impecável e profissionais qualificados!… Sou cliente desde 2023 e não troco por nenhum outro (até minha família virou cliente).",
  },
];
