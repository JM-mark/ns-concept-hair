// Post do salão (Instagram) e Google Maps: ter a sex 08:00-19:00, sáb 08:00-18:00, dom e seg fechados. TODO confirmar segunda com o salão.
export type DayHours = { open: string; close: string } | null;

/** Índice = Date#getDay(): 0 domingo … 6 sábado. Usado só para gerar horários no agendamento. */
export const HOURS: DayHours[] = [
  null, // domingo fechado
  null, // segunda fechada (TODO confirmar)
  { open: "08:00", close: "19:00" },
  { open: "08:00", close: "19:00" },
  { open: "08:00", close: "19:00" },
  { open: "08:00", close: "19:00" },
  { open: "08:00", close: "18:00" },
];

export const SLOT_MINUTES = 30;
// TODO confirmar duração de cada serviço antes de usar para bloquear horários
