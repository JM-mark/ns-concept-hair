// Textos autorais a partir da bio e das publicações do salão. Sem preços, tempos, marcas, técnicas não confirmadas ou nomes de profissionais.
// Os nomes das profissionais aparecem só dentro das avaliações (são as palavras das clientes).
// Para revisar todos os textos de uma vez: node scripts/export-textos.mjs (gera docs/textos-servicos.md).
export type BookingOption = { id: string; nome: string; destaque?: boolean; nota?: string };

export type Service = {
  slug: string;
  num: string;
  nome: string;
  linha: string; // frase curta para listas
  intro: string;
  oQueE: string[]; // "O que é": 2 parágrafos
  pontos: string[]; // lista curta dentro de "O que é"
  paraQuem: string[]; // "Para quem é": 3 itens curtos
  etapas: { titulo: string; texto: string }[]; // "Como funciona"
  faq: { q: string; a: string }[]; // 4 a 5 perguntas
  combinaCom: string[]; // slugs de 2 serviços relacionados
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
    intro: "Descubra a técnica, o comprimento e o volume ideais para você. Tudo começa com uma avaliação individual.",
    oQueE: [
      "O Mega Hair é o carro-chefe do NS Concept Hair, em Indaiatuba. Antes de qualquer aplicação, a equipe faz uma avaliação para entender o seu cabelo, o resultado que você imagina e o que combina com a sua rotina.",
      // TODO confirmar técnicas de Mega Hair que o salão realiza antes de citá-las
      "A conversa sobre técnica, comprimento e volume acontece com calma, para que a escolha seja sua e dialogue com o seu estilo. Depois da aplicação, o salão segue à disposição para acompanhar o resultado e orientar sobre os cuidados.",
    ],
    pontos: ["Avaliação individual", "Técnica, comprimento e volume definidos com você", "Acompanhamento depois da aplicação"],
    paraQuem: [
      "Quem quer mais comprimento ou mais volume.",
      "Quem prefere decidir com calma, depois de uma avaliação.",
      "Quem procura um resultado pensado para o próprio estilo.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Avaliação", texto: "Conversa e análise do seu cabelo." },
      { titulo: "Escolha da técnica", texto: "Técnica, comprimento e volume ideais." },
      { titulo: "Aplicação", texto: "Realizada pela equipe do salão." },
      { titulo: "Manutenção", texto: "Cuidados para o resultado durar." },
    ],
    faq: [
      { q: "Como começo?", a: "Pelo agendamento de uma avaliação de Mega Hair. O salão confirma o horário pelo WhatsApp." },
      { q: "Posso escolher o comprimento e o volume?", a: "Sim. Essa escolha é feita junto com você na avaliação." },
      // TODO confirmar técnicas
      { q: "Quais técnicas vocês trabalham?", a: "A equipe apresenta as opções na avaliação, de acordo com o seu cabelo." },
      // TODO confirmar tempo e frequência com o salão
      { q: "Quanto tempo dura a aplicação?", a: "O tempo e a frequência dependem da técnica escolhida na avaliação." },
      { q: "Como é a manutenção?", a: "O tempo e a frequência dependem da técnica escolhida na avaliação. A equipe orienta você sobre os cuidados depois da aplicação." },
    ],
    combinaCom: ["coloracao", "tratamentos"],
    fotoKey: "mega-hair",
    vitrineKey: "home-mega-hair",
    opcoes: [
      { id: "avaliacao-mega-hair", nome: "Avaliação de Mega Hair", destaque: true, nota: "Descubra a técnica, o comprimento e o volume ideais para você." },
      { id: "mega-hair", nome: "Mega Hair" },
    ],
  },
  {
    slug: "coloracao",
    num: "02",
    nome: "Coloração",
    linha: "Morena iluminada, mechas, balayage e loiros.",
    intro: "Cor pensada para o seu tom de pele, o seu corte e o seu dia a dia.",
    oQueE: [
      "Da morena iluminada aos loiros, a coloração é pensada para o seu tom de pele, o seu corte e a sua rotina. Cada trabalho começa por uma conversa sobre o que você quer e sobre o que é possível no seu cabelo.",
      "O foco é o brilho e o movimento da cor, escolhida para valorizar o seu cabelo e não apenas para mudar a aparência. O salão, em Indaiatuba, atende morena iluminada, mechas, balayage e loiros.",
    ],
    pontos: ["Morena iluminada", "Mechas", "Balayage", "Loiros"],
    paraQuem: [
      "Quem quer renovar a cor, com mais luz e profundidade.",
      "Quem sonha com uma morena iluminada ou um loiro e quer conversar sobre o caminho.",
      "Quem prefere uma cor que combine com o tom de pele e com a rotina.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Conversa", texto: "Você conta o que imagina e pode levar referências." },
      { titulo: "Análise do cabelo", texto: "A equipe avalia o cabelo e explica o que é possível." },
      { titulo: "Aplicação", texto: "A cor é aplicada pela equipe do salão." },
      { titulo: "Acabamento", texto: "Finalização e orientação para cuidar da cor em casa." },
    ],
    faq: [
      { q: "Posso levar uma referência?", a: "Pode. A equipe conversa com você sobre o que é possível no seu cabelo." },
      { q: "Preciso conversar antes de colorir?", a: "A conversa faz parte do atendimento: a equipe ouve o que você quer e indica o melhor caminho para o seu cabelo." },
      { q: "A cor serve para qualquer cabelo?", a: "Depende do seu cabelo e do resultado que você quer. A equipe avalia no atendimento e explica as opções." },
      { q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você pode escolher mais de um serviço." },
      { q: "Como agendo?", a: "Pelo site. O salão confirma o horário pelo WhatsApp." },
    ],
    combinaCom: ["tratamentos", "corte-e-visagismo"],
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
    oQueE: [
      "No corte com visagismo, o desenho nasce de uma conversa. Formato do rosto, proporções, personalidade e rotina entram na decisão antes do primeiro fio ser cortado. É um jeito de olhar para o conjunto, e não só para o comprimento.",
      "A ideia é um corte pensado para você, e não um modelo pronto. Clientes do salão, em Indaiatuba, comentam nas avaliações a explicação de visagismo que acompanha o atendimento.",
    ],
    pontos: ["Consulta de visagismo", "Corte pensado para o seu rosto", "Orientação para cuidar em casa"],
    paraQuem: [
      "Quem quer mudar o corte e não sabe por onde começar.",
      "Quem quer um corte que combine com o formato do rosto.",
      "Quem quer orientação para cuidar do corte no dia a dia.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Conversa", texto: "Você conta o que busca e como é a sua rotina." },
      { titulo: "Olhar para o rosto", texto: "Formato, proporções e estilo guiam o desenho." },
      { titulo: "Corte", texto: "O corte é feito pela equipe do salão." },
      { titulo: "Orientação", texto: "Dicas para cuidar do corte em casa." },
    ],
    faq: [
      { q: "O que é visagismo?", a: "É a criação do visual a partir do seu rosto, da sua personalidade e do seu estilo." },
      { q: "Preciso levar uma referência?", a: "Ajuda, mas não é obrigatório. A equipe conversa com você e propõe o desenho para o seu rosto." },
      { q: "Posso agendar o corte junto com outro serviço?", a: "Sim. No agendamento você pode escolher mais de um serviço." },
      { q: "O corte precisa de manutenção?", a: "A frequência depende do corte escolhido e do seu cabelo. A equipe orienta você no atendimento." },
      { q: "Como agendo?", a: "Pelo site. O salão confirma o horário pelo WhatsApp." },
    ],
    combinaCom: ["coloracao", "tratamentos"],
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
    oQueE: [
      "O cabelo liso e brilhante é uma das marcas do salão. Os tratamentos e a escova do NS Concept Hair, em Indaiatuba, entram para cuidar da maciez, do brilho e do acabamento do seu cabelo.",
      "Cada indicação é feita depois de olhar para o seu cabelo, com a equipe explicando o que faz sentido para você. Se ainda não sabe do que precisa, tudo bem: a conversa no atendimento ajuda a decidir entre hidratação, tratamento ou apenas a escova.",
    ],
    pontos: ["Escova", "Hidratação e tratamentos", "Acabamento com brilho"],
    paraQuem: [
      "Quem quer cuidar da maciez e do brilho do cabelo.",
      "Quem gosta do acabamento liso e alinhado.",
      "Quem prefere uma indicação personalizada, e não um tratamento padrão.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Conversa", texto: "Você conta como é o seu cabelo e o que espera." },
      { titulo: "Análise do cabelo", texto: "A equipe indica o que faz sentido para você." },
      { titulo: "Tratamento ou escova", texto: "Realizado pela equipe do salão." },
      { titulo: "Orientação", texto: "Cuidados para manter em casa." },
    ],
    faq: [
      { q: "Qual tratamento é o ideal para mim?", a: "A equipe avalia o seu cabelo e indica no atendimento." },
      { q: "Posso fazer só a escova?", a: "Pode. Você escolhe o serviço no agendamento e o salão confirma pelo WhatsApp." },
      { q: "A escova serve para qualquer cabelo?", a: "A equipe avalia o seu cabelo e indica o acabamento no atendimento." },
      { q: "Preciso levar algo?", a: "Não é preciso levar nada específico. Se tiver uma foto do acabamento de que gosta, ela ajuda na conversa." },
      { q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você pode escolher mais de um serviço." },
    ],
    combinaCom: ["mega-hair", "coloracao"],
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
    linha: "Unhas com acabamento cuidadoso, no padrão do salão.",
    intro: "Cuidado e acabamento nas mãos, no mesmo padrão do resto do salão.",
    oQueE: [
      "O cuidado com as unhas faz parte do NS Concept Hair, em Indaiatuba. O atendimento é feito com atenção ao acabamento, no mesmo padrão do resto do salão, em um espaço acolhedor e com o mesmo cuidado dedicado ao cabelo.",
      "As clientes destacam, nas avaliações, o acabamento impecável. Você pode agendar as unhas em um horário só para elas ou combinar com o cabelo e o design de sobrancelhas, se preferir organizar tudo em uma única ida ao salão.",
    ],
    pontos: ["Acabamento cuidadoso", "Agendamento junto com outro serviço"],
    paraQuem: [
      "Quem quer as unhas sempre com bom acabamento.",
      "Quem prefere resolver mais de um serviço na mesma ida ao salão.",
      "Quem gosta de um visual discreto e bem cuidado.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Conversa", texto: "Você conta o que prefere e o salão explica as opções." },
      { titulo: "Preparo", texto: "Cuidado com as unhas antes do acabamento." },
      { titulo: "Acabamento", texto: "Finalização feita pela equipe do salão." },
    ],
    faq: [
      { q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você pode escolher mais de um serviço." },
      { q: "Como agendo?", a: "Pelo site. O salão confirma o horário pelo WhatsApp." },
      { q: "Posso levar uma referência?", a: "Se tiver uma foto do que gosta, ela ajuda na conversa com a equipe e na escolha do acabamento. Não é obrigatório." },
      { q: "Preciso fazer algo antes de ir?", a: "Não é preciso preparar nada. Se tiver dúvidas, o salão responde pelo WhatsApp." },
      // TODO confirmar duração com o salão
      { q: "Quanto tempo leva o atendimento?", a: "O tempo depende do que você escolher e de combinar, ou não, com outro serviço. O salão confirma pelo WhatsApp ao receber o seu pedido." },
    ],
    combinaCom: ["sobrancelhas", "tratamentos"],
    fotoKey: "unhas",
    vitrineKey: "home-unhas",
    opcoes: [{ id: "unhas", nome: "Unhas" }],
  },
  {
    slug: "sobrancelhas",
    num: "06",
    nome: "Design de sobrancelhas",
    linha: "Um desenho que emoldura o olhar.",
    intro: "Um desenho que respeita o seu rosto e emoldura o seu olhar.",
    oQueE: [
      "O design de sobrancelhas do NS Concept Hair, em Indaiatuba, parte do seu rosto: formato, proporções e expressão guiam o desenho, para que as sobrancelhas emoldurem o olhar. A ideia é um desenho que respeite a sua expressão, sem exageros.",
      "É um serviço que combina com os demais. Você pode agendar junto com o cabelo ou as unhas, ou em um horário separado. Chegar com uma ideia do que gosta ajuda, mas não é preciso: a conversa no salão leva a um desenho que faça sentido para o seu rosto.",
    ],
    pontos: ["Desenho pensado para o seu rosto", "Agendamento junto com outro serviço, se preferir"],
    paraQuem: [
      "Quem quer sobrancelhas desenhadas para o próprio rosto.",
      "Quem prefere um desenho discreto, que valorize o olhar.",
      "Quem quer resolver sobrancelhas e outro serviço no mesmo dia.",
    ],
    etapas: [
      // TODO confirmar etapas com o salão
      { titulo: "Conversa", texto: "Você conta o que prefere e mostra referências, se quiser." },
      { titulo: "Desenho", texto: "Pensado a partir do formato do rosto e da expressão." },
      { titulo: "Acabamento", texto: "Finalização feita pela equipe do salão." },
    ],
    faq: [
      { q: "Como o desenho é escolhido?", a: "A partir do formato do seu rosto e da sua expressão, depois de uma conversa com você." },
      { q: "Posso levar uma referência?", a: "Pode. A equipe conversa com você e propõe o desenho que combina com o seu rosto." },
      { q: "Posso agendar junto com outro serviço?", a: "Sim. No agendamento você pode escolher mais de um serviço." },
      { q: "O design serve para qualquer rosto?", a: "O desenho é pensado para o seu rosto. A equipe avalia no atendimento e conversa com você antes de começar." },
      { q: "Como agendo?", a: "Pelo site. O salão confirma o horário pelo WhatsApp." },
    ],
    combinaCom: ["unhas", "corte-e-visagismo"],
    fotoKey: "sobrancelhas",
    opcoes: [{ id: "sobrancelhas", nome: "Design de sobrancelhas" }],
  },
];

export const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceHref = (s: Service) => `/servicos/${s.slug}/`;
