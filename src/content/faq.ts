// Perguntas neutras, sem promessa e sem preço. TODO confirmar respostas com o salão.
import { SITE } from "./site";

export const FAQ = [
  {
    q: "Como funciona a avaliação de Mega Hair?",
    a: "Você agenda a avaliação pelo site e o salão confirma o horário pelo WhatsApp. Na avaliação, a equipe olha o seu cabelo e conversa com você sobre técnica, comprimento e volume.",
  },
  {
    q: "Como faço para agendar?",
    a: "Em Agendar você escolhe o serviço, o dia e o horário. O pedido segue pelo WhatsApp e o salão confirma com você.",
  },
  {
    q: "Onde fica o salão?",
    a: `${SITE.endereco.rua}, ${SITE.endereco.complemento}, ${SITE.endereco.bairro}, ${SITE.endereco.cidade}/${SITE.endereco.uf}.`,
  },
  {
    q: "Quais são as formas de contato?",
    a: `WhatsApp ${SITE.telefone}, e-mail ${SITE.email} e Instagram @nsconcepthair.`,
  },
  {
    q: "O que levo no dia?",
    a: "Uma foto de referência ajuda a conversar sobre o resultado que você quer. Se preferir, envie pelo WhatsApp antes.",
  },
  {
    q: "Qual é o horário de funcionamento?",
    a: "De terça a sexta, das 8h às 19h, e aos sábados, das 8h às 18h. Domingo e segunda o salão fica fechado.",
  },
];
