export type Member = {
  nome: string;
  funcao?: string; // só quando confirmada
  servicos: string[]; // slugs de serviços; vazio = ainda não confirmado (não aparece no agendamento)
  destaque?: boolean;
};

export const TEAM: Member[] = [
  { nome: "Netto Sillva", funcao: "Diretor criativo", servicos: ["mega-hair", "coloracao", "corte-e-visagismo", "tratamentos"], destaque: true },
  { nome: "Sil", funcao: "Cabeleireira visagista", servicos: ["corte-e-visagismo"] },
  { nome: "Gi", funcao: "Unhas", servicos: ["unhas"] },
  { nome: "Patty", funcao: "Sobrancelhas", servicos: ["sobrancelhas"] },
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
