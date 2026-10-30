// Textos autorais a partir da bio e das publicações do salão. Sem preços, tempos ou números inventados.
export type BookingOption = { id: string; nome: string; destaque?: boolean; nota?: string };

export type Service = {
  slug: string;
  num: string;
  nome: string;
  linha: string; // frase curta para listas
  intro: string;
  paragrafos: string[];
  pontos: string[];
  etapas?: { titulo: string; texto: string }[];
  faq: { q: string; a: string }[];
  fotoKey?: string; // chave em photos.ts (página do serviço)
  vitrineKey?: string; // chave em photos.ts (vitrine da Home); sem foto = painel tipográfico
  opcoes: BookingOption[]; // opções do agendamento
};

export const SERVICES: Service[] = [
  {
    slug: "mega-hair",
    num: "01",
    nome: "Mega Hair",
    linha: "Comprimento e volume na medida certa, a partir de uma avaliação.",
    intro:
      "Descubra a técnica, o comprimento e o volume ideais para você. Tudo começa com uma avaliação individual.",
    paragrafos: [
      "O Mega Hair é o carro-chefe do NS Concept Hair. Antes de qualquer aplicação, o salão faz uma avaliação para entender o seu cabelo, o resultado que você imagina e o que combina com a sua rotina.",
      // TODO confirmar técnicas de Mega Hair que o salão realiza antes de citá-las
      "A conversa sobre técnica, comprimento e volume acontece com calma, para que a escolha seja sua e o resultado pareça natural.",
    ],
    pontos: [
      "Avaliação individual",
      "Técnica, comprimento e volume definidos com você",
      "Acompanhamento depois da aplicação",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Avaliação", texto: "Conversa e análise do seu cabelo." },
      { titulo: "Escolha da técnica", texto: "Técnica, comprimento e volume ideais." },
      { titulo: "Aplicação", texto: "Realizada pela equipe do salão." },
      { titulo: "Manutenção", texto: "Cuidados para o resultado durar." },
    ],
    faq: [
      {
        q: "Como começo?",
        a: "Pelo agendamento de uma avaliação de Mega Hair. O salão confirma o horário pelo WhatsApp.",
      },
      { q: "Posso escolher o comprimento e o volume?", a: "Sim. Essa escolha é feita junto com você na avaliação." },
      // TODO confirmar técnicas
      { q: "Quais técnicas vocês trabalham?", a: "A equipe apresenta as opções na avaliação, de acordo com o seu cabelo." },
    ],
    fotoKey: "mega-hair",
    vitrineKey: "home-mega-hair",
    opcoes: [
      {
        id: "avaliacao-mega-hair",
        nome: "Avaliação de Mega Hair",
        destaque: true,
        nota: "Descubra a técnica, o comprimento e o volume ideais para você.",
      },
      { id: "mega-hair", nome: "Mega Hair" },
    ],
  },
  {
    slug: "coloracao",
    num: "02",
    nome: "Coloração",
    linha: "Morena iluminada, mechas, balayage e loiros.",
    intro: "Cor com luz, profundidade e acabamento de salão de alto padrão.",
    paragrafos: [
      "Da morena iluminada aos loiros, a coloração é pensada para o seu tom de pele, o seu corte e o seu dia a dia.",
      "O resultado é brilho e movimento, com a cor certa para valorizar o cabelo e não apenas mudar a aparência.",
    ],
    pontos: ["Morena iluminada", "Mechas", "Balayage", "Loiros"],
    faq: [
      { q: "Posso levar uma referência?", a: "Pode. A equipe conversa com você sobre o que é possível no seu cabelo." },
      { q: "Como agendo?", a: "Pelo site; o salão confirma o horário pelo WhatsApp." },
    ],
    fotoKey: "coloracao",
    vitrineKey: "home-coloracao",
    opcoes: [
      { id: "morena-iluminada", nome: "Morena iluminada" },
      { id: "mechas", nome: "Mechas" },
      { id: "balayage", nome: "Balayage" },
      { id: "loiros", nome: "Loiros" },
    ],
  },
  {
    slug: "corte-e-visagismo",
    num: "03",
    nome: "Corte e visagismo",
    linha: "Um corte desenhado para o seu rosto e para a sua rotina.",
    intro: "Visagismo é olhar para o seu rosto, a sua personalidade e o seu estilo antes de pegar na tesoura.",
    paragrafos: [
      "No corte com visagismo, o desenho nasce de uma conversa. Formato do rosto, proporções e rotina entram na decisão.",
      "A Sil, cabeleireira visagista do salão, é citada pelas clientes pela aula de visagismo que acompanha o atendimento.",
    ],
    pontos: ["Consulta de visagismo", "Corte pensado para o seu rosto", "Orientação para manter em casa"],
    faq: [
      { q: "O que é visagismo?", a: "É a criação do visual a partir do seu rosto, da sua personalidade e do seu estilo." },
      { q: "Quem faz?", a: "A Sil, cabeleireira visagista, e a equipe do salão." },
    ],
    fotoKey: "corte",
    vitrineKey: "home-corte",
    opcoes: [{ id: "corte-visagismo", nome: "Corte com visagismo" }],
  },
  {
    slug: "tratamentos",
    num: "04",
    nome: "Tratamentos e escova",
    linha: "Cabelo liso, brilhante e saudável.",
    intro: "Brilho, alinhamento e cuidado para um cabelo que se move e reflete luz.",
    paragrafos: [
      "O cabelo liso e brilhante é uma das marcas do salão. Tratamentos e escova entram para devolver maciez, brilho e acabamento.",
      "Cada indicação é feita depois de olhar para o seu cabelo.",
    ],
    pontos: ["Escova", "Hidratação e tratamentos", "Acabamento com brilho"],
    faq: [
      { q: "Qual tratamento é o ideal para mim?", a: "A equipe avalia o seu cabelo e indica no atendimento." },
      { q: "Como agendo?", a: "Pelo site; o salão confirma o horário pelo WhatsApp." },
    ],
    fotoKey: "tratamentos",
    vitrineKey: "home-tratamentos",
    opcoes: [
      { id: "escova", nome: "Escova" },
      { id: "tratamento", nome: "Hidratação e tratamentos" },
    ],
  },
  {
    slug: "unhas",
    num: "05",
    nome: "Unhas",
    linha: "Unhas impecáveis, com a Gi.",
    intro: "Cuidado e acabamento nas mãos, no mesmo padrão do resto do salão.",
    paragrafos: [
      "A Gi cuida das unhas do salão e é elogiada pelas clientes pelo acabamento impecável.",
      "Agende junto com outro serviço ou separado.",
    ],
    pontos: ["Atendimento com a Gi", "Acabamento cuidadoso"],
    faq: [{ q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você escolhe mais de um serviço." }],
    fotoKey: "unhas",
    opcoes: [{ id: "unhas", nome: "Unhas" }],
  },
  {
    slug: "sobrancelhas",
    num: "06",
    nome: "Design de sobrancelhas",
    linha: "Sobrancelhas desenhadas para o seu olhar, com a Patty.",
    intro: "Um desenho que respeita o seu rosto e emoldura o seu olhar.",
    paragrafos: ["A Patty faz o design de sobrancelhas do salão.", "É um serviço fácil de encaixar junto com o cabelo."],
    pontos: ["Atendimento com a Patty", "Design pensado para o seu rosto"],
    faq: [{ q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você escolhe mais de um serviço." }],
    fotoKey: "sobrancelhas",
    opcoes: [{ id: "sobrancelhas", nome: "Design de sobrancelhas" }],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceHref = (s: Service) => `/servicos/${s.slug}/`;
