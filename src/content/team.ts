export type Member = {
  nome: string;
  funcao?: string; // só quando confirmada
  servicos: string[]; // slugs de serviços; vazio = ainda não confirmado (não aparece no agendamento)
  destaque?: boolean;
  frase?: string; // uma frase neutra, só com o que está confirmado
};

export const TEAM: Member[] = [
  { nome: "Netto Sillva", funcao: "Diretor criativo", servicos: ["mega-hair", "coloracao", "corte-e-visagismo", "tratamentos"], destaque: true, frase: "Direção criativa do NS Concept Hair. As iniciais NS vêm de Netto Sillva." },
  { nome: "Sil", funcao: "Cabeleireira visagista", servicos: ["corte-e-visagismo"], frase: "Cuida dos cortes e do visagismo do salão." },
  { nome: "Gi", funcao: "Unhas", servicos: ["unhas"], frase: "Cuida das unhas do salão." },
  { nome: "Patty", funcao: "Sobrancelhas", servicos: ["sobrancelhas"], frase: "Faz o design de sobrancelhas do salão." },
  // TODO confirmar função de cada uma
  { nome: "Larissa", servicos: [] },
  { nome: "Yanca", servicos: [] },
  { nome: "Bruna", servicos: [] },
  { nome: "Thaina", servicos: [] },
  { nome: "Camila", servicos: [] },
  { nome: "Tony", servicos: [] },
  { nome: "Luciana", servicos: [] },
  { nome: "Joana", servicos: [] },
];
