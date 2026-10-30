"use client";

import { useState } from "react";
import { MESES, isOpen, slotsFor, startOfDay, toISO, fromISO, type Periodo } from "@/lib/booking";

const SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];
const SEMANA_FULL = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

type Props = {
  data: string;
  hora: string;
  periodo: Periodo | "";
  now: Date;
  onChange: (v: { data?: string; hora?: string; periodo?: Periodo | "" }) => void;
  error?: string;
};

/** Calendário próprio em pt-BR: dias passados e fechados bloqueados, horários de 30 em 30 minutos. */
export default function BookingCalendar({ data, hora, periodo, now, onChange, error }: Props) {
  const today = startOfDay(now);
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const first = view;
  const lead = first.getDay();
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const canPrev = first.getTime() > new Date(today.getFullYear(), today.getMonth(), 1).getTime();
  const canNext = first.getTime() < new Date(maxMonth.getFullYear(), maxMonth.getMonth() - 1, 1).getTime();

  const slots = data ? slotsFor(fromISO(data), now) : [];

  return (
    <div data-native-cursor className="grid gap-10">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Mês anterior"
            disabled={!canPrev}
            onClick={() => setView(new Date(first.getFullYear(), first.getMonth() - 1, 1))}
            className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-champagne disabled:opacity-30"
          >
            ←
          </button>
          <p className="font-display text-2xl capitalize" aria-live="polite">
            {MESES[first.getMonth()]} {first.getFullYear()}
          </p>
          <button
            type="button"
            aria-label="Próximo mês"
            disabled={!canNext}
            onClick={() => setView(new Date(first.getFullYear(), first.getMonth() + 1, 1))}
            className="flex h-11 w-11 items-center justify-center border border-[var(--line)] text-champagne disabled:opacity-30"
          >
            →
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center" role="group" aria-label="Escolha o dia">
          {SEMANA.map((s, i) => (
            <span key={i} className="label py-2 text-[11px] text-mute" aria-label={SEMANA_FULL[i]}>
              {s}
            </span>
          ))}
          {Array.from({ length: lead }).map((_, i) => (
            <span key={`b${i}`} />
          ))}
          {Array.from({ length: days }).map((_, i) => {
            const d = new Date(first.getFullYear(), first.getMonth(), i + 1);
            const iso = toISO(d);
            const past = d.getTime() < today.getTime();
            const closed = !isOpen(d);
            const noSlots = !past && !closed && slotsFor(d, now).length === 0;
            const disabled = past || closed || noSlots;
            const sel = iso === data;
            return (
              <button
                key={iso}
                type="button"
                disabled={disabled}
                aria-pressed={sel}
                aria-label={`${i + 1} de ${MESES[first.getMonth()]}${closed ? ", fechado" : ""}`}
                onClick={() => onChange({ data: iso, hora: "" })}
                className={`h-11 min-w-11 border text-[15px] transition-colors ${
                  sel
                    ? "border-champagne bg-champagne text-ink"
                    : "border-transparent hover:border-champagne disabled:text-mute/40 disabled:hover:border-transparent"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[13px] text-mute">Domingo e segunda fechados.</p>
      </div>

      <div>
        <p className="label mb-4 text-champagne">Horário</p>
        {!data ? (
          <p className="text-[15px] text-mute">Escolha um dia para ver os horários.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="group" aria-label="Horários disponíveis">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={hora === s}
                  onClick={() => onChange({ hora: s, periodo: "" })}
                  className={`h-11 border text-[15px] transition-colors ${
                    hora === s ? "border-champagne bg-champagne text-ink" : "border-[var(--line)] hover:border-champagne"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="label mb-3 mt-8 text-[11px] text-mute">Ou escolha um período</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Período">
              {(
                [
                  ["manha", "Manhã"],
                  ["tarde", "Tarde"],
                  ["qualquer", "Tanto faz"],
                ] as const
              ).map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={periodo === v}
                  onClick={() => onChange({ periodo: v, hora: "" })}
                  className={`h-11 border px-5 text-[15px] transition-colors ${
                    periodo === v ? "border-champagne bg-champagne text-ink" : "border-[var(--line)] hover:border-champagne"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        )}
        {error && (
          <p role="alert" className="mt-4 text-[14px] text-[#ff9a8a]">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
