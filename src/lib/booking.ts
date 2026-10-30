import { SERVICES, type BookingOption } from "@/content/services";
import { HOURS, SLOT_MINUTES } from "@/content/hours";
import { TEAM } from "@/content/team";
import { SITE, whatsappLink } from "@/content/site";

export type Periodo = "manha" | "tarde" | "qualquer";

export type Booking = {
  servicos: string[]; // ids de opções
  prof: string; // "" = sem preferência
  data: string; // YYYY-MM-DD
  hora: string; // HH:MM
  periodo: Periodo | "";
  nome: string;
  whats: string;
  cliente: "sim" | "nao" | "";
  megaHair: string;
  obs: string;
  lgpd: boolean;
};

export const EMPTY: Booking = {
  servicos: [],
  prof: "",
  data: "",
  hora: "",
  periodo: "",
  nome: "",
  whats: "",
  cliente: "",
  megaHair: "",
  obs: "",
  lgpd: false,
};

export const ALL_OPTIONS: (BookingOption & { slug: string })[] = SERVICES.flatMap((s) =>
  s.opcoes.map((o) => ({ ...o, slug: s.slug })),
);
export const optionById = (id: string) => ALL_OPTIONS.find((o) => o.id === id);

/** Profissionais que atendem os serviços escolhidos (só relações confirmadas em team.ts). */
export function professionalsFor(optionIds: string[]) {
  const slugs = new Set(optionIds.map((id) => optionById(id)?.slug).filter(Boolean) as string[]);
  return TEAM.filter((m) => m.servicos.some((s) => slugs.has(s)));
}

const pad = (n: number) => String(n).padStart(2, "0");
export const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export const isOpen = (d: Date) => HOURS[d.getDay()] !== null;

export function slotsFor(d: Date, now: Date): string[] {
  const h = HOURS[d.getDay()];
  if (!h) return [];
  const [oh, om] = h.open.split(":").map(Number);
  const [ch, cm] = h.close.split(":").map(Number);
  const out: string[] = [];
  for (let m = oh * 60 + om; m + SLOT_MINUTES <= ch * 60 + cm; m += SLOT_MINUTES) {
    const slot = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, m);
    if (slot.getTime() < now.getTime() + 60 * 60 * 1000) continue; // pelo menos 1h de antecedência
    out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  }
  return out;
}

export const formatDia = (iso: string) => {
  const d = fromISO(iso);
  return `${DIAS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
};

export const maskPhone = (v: string) => {
  const n = v.replace(/\D/g, "").slice(0, 11);
  if (n.length <= 2) return n ? `(${n}` : "";
  if (n.length <= 6) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
  if (n.length <= 10) return `(${n.slice(0, 2)}) ${n.slice(2, 6)}-${n.slice(6)}`;
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
};

const PERIODO_TXT: Record<Periodo, string> = {
  manha: "Manhã (sem horário exato)",
  tarde: "Tarde (sem horário exato)",
  qualquer: "Tanto faz",
};

export function servicosTexto(b: Booking) {
  return b.servicos.map((id) => optionById(id)?.nome ?? id).join(", ");
}

export function horarioTexto(b: Booking) {
  return b.hora ? b.hora : b.periodo ? PERIODO_TXT[b.periodo] : "A combinar";
}

export function buildMessage(b: Booking): string {
  const obs = [b.megaHair && `Comprimento e volume que deseja: ${b.megaHair}`, b.obs].filter(Boolean).join(". ");
  return [
    "Olá, NS Concept Hair! Gostaria de agendar:",
    "",
    `• Serviço(s): ${servicosTexto(b)}`,
    `• Profissional: ${b.prof || "Sem preferência"}`,
    `• Data: ${formatDia(b.data)}`,
    `• Horário: ${horarioTexto(b)}`,
    `• Nome: ${b.nome.trim()}`,
    `• WhatsApp: ${b.whats}`,
    `• Já sou cliente: ${b.cliente === "sim" ? "Sim" : "Não"}`,
    `• Observações: ${obs || "-"}`,
    "",
    "(Pedido enviado pelo site)",
  ].join("\n");
}

export const whatsappUrl = (b: Booking) => whatsappLink(buildMessage(b));

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** .ics marcado como pendente de confirmação. Duração de 1h só como referência (TODO confirmar duração por serviço). */
export function buildIcs(b: Booking): string {
  const d = fromISO(b.data);
  const base = b.hora ? b.hora : b.periodo === "tarde" ? "14:00" : "09:00";
  const [hh, mm] = base.split(":").map(Number);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const f = (x: Date) =>
    `${x.getFullYear()}${pad(x.getMonth() + 1)}${pad(x.getDate())}T${pad(x.getHours())}${pad(x.getMinutes())}00`;
  const e = SITE.endereco;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NS Concept Hair//Agendamento//PT-BR",
    "BEGIN:VEVENT",
    `UID:${f(start)}-${Math.abs(hash(b.nome + b.whats))}@nsconcepthair`,
    `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(start)}`,
    `DTEND:${f(end)}`,
    "SUMMARY:NS Concept Hair (pendente de confirmação)",
    `DESCRIPTION:${servicosTexto(b)}. Pedido enviado pelo site; aguardando confirmação do salão pelo WhatsApp.${b.hora ? "" : " Horário a combinar."}`,
    `LOCATION:${e.rua}\\, ${e.complemento}\\, ${e.bairro}\\, ${e.cidade}/${e.uf}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

/** POST opcional para n8n/Google Sheets. Sem NEXT_PUBLIC_BOOKING_WEBHOOK nada acontece. */
export async function sendWebhook(b: Booking) {
  const url = process.env.NEXT_PUBLIC_BOOKING_WEBHOOK;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...b, servicosTexto: servicosTexto(b), criadoEm: new Date().toISOString(), origem: "site" }),
      keepalive: true,
    });
  } catch {
    /* o pedido segue pelo WhatsApp mesmo se o webhook falhar */
  }
}

export function validateDados(b: Booking) {
  const err: Record<string, string> = {};
  if (b.nome.trim().length < 3) err.nome = "Informe seu nome completo.";
  if (b.whats.replace(/\D/g, "").length < 10) err.whats = "Informe um WhatsApp com DDD.";
  if (!b.cliente) err.cliente = "Diga se já é cliente.";
  if (!b.lgpd) err.lgpd = "Para continuar, é preciso autorizar o contato.";
  return err;
}
