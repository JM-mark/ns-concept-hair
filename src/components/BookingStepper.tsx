"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SERVICES } from "@/content/services";
import {
  EMPTY,
  buildIcs,
  buildMessage,
  formatDia,
  horarioTexto,
  maskPhone,
  optionById,
  professionalsFor,
  sendWebhook,
  servicosTexto,
  validateDados,
  whatsappUrl,
  type Booking,
} from "@/lib/booking";
import BookingCalendar from "./BookingCalendar";
import { WhatsAppIcon } from "./Icons";

const STEPS = ["Serviço", "Profissional", "Data e horário", "Seus dados", "Resumo"];

const field =
  "w-full border border-[var(--line)] bg-transparent px-4 py-3 text-[17px] text-ivory placeholder:text-mute focus:border-champagne focus:outline-none aria-[invalid=true]:border-[#ff9a8a]";

export default function BookingStepper() {
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const [now] = useState(() => new Date());
  const [b, setB] = useState<Booking>(() => {
    const ids = (params.get("servico") ?? "").split(",").filter((id) => optionById(id));
    return { ...EMPTY, servicos: ids };
  });
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const pros = professionalsFor(b.servicos);
  const hasMega = b.servicos.some((id) => optionById(id)?.slug === "mega-hair");

  // Estado na URL (?servico=...&etapa=N), sem recarregar
  useEffect(() => {
    const q = new URLSearchParams();
    if (b.servicos.length) q.set("servico", b.servicos.join(","));
    if (step > 1) q.set("etapa", String(step));
    const qs = q.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [b.servicos, step]);

  // Foco no título ao trocar de etapa
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    heading.current?.focus({ preventScroll: true });
    root.current?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  }, [step, done, reduced]);

  // Foco no primeiro erro
  useEffect(() => {
    if (!Object.keys(errors).length) return;
    const el = root.current?.querySelector<HTMLElement>("[aria-invalid='true'], [data-err-focus]");
    el?.focus();
  }, [errors]);

  const set = (patch: Partial<Booking>) => setB((v) => ({ ...v, ...patch }));

  const toggleServico = (id: string) =>
    setB((v) => {
      const servicos = v.servicos.includes(id) ? v.servicos.filter((x) => x !== id) : [...v.servicos, id];
      const ok = professionalsFor(servicos).some((m) => m.nome === v.prof);
      return { ...v, servicos, prof: ok ? v.prof : "" };
    });

  const validate = (s: number) => {
    const err: Record<string, string> = {};
    if (s === 1 && !b.servicos.length) err.servicos = "Escolha pelo menos um serviço.";
    if (s === 3) {
      if (!b.data) err.data = "Escolha um dia.";
      else if (!b.hora && !b.periodo) err.data = "Escolha um horário ou um período.";
    }
    if (s === 4) Object.assign(err, validateDados(b));
    return err;
  };

  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setErrors({});
    setStep(n);
  };
  const next = () => {
    const err = validate(step);
    setErrors(err);
    if (!Object.keys(err).length) go(step + 1);
  };

  const send = () => {
    void sendWebhook(b);
    setDone(true);
  };

  const download = () => {
    const blob = new Blob([buildIcs(b)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ns-concept-hair-agendamento.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const anim = reduced
    ? { initial: {}, animate: {}, exit: {} }
    : {
        initial: { opacity: 0, x: 32 * dir },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -32 * dir },
      };

  return (
    <div ref={root} data-native-cursor className="scroll-mt-28">
      <p className="label mb-6 text-champagne">Agendamento</p>

      {done ? (
        <div role="status">
          <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(40px,7vw,88px)] outline-none">
            Pedido <em className="italic-champagne">pronto.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[18px] text-ivory/85">
            Se a conversa com o salão não abriu no WhatsApp, use o botão abaixo. Assim que o salão confirmar, você recebe a resposta no WhatsApp.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappUrl(b)} target="_blank" rel="noopener noreferrer" className="btn btn-primary label">
              <span className="btn-clip">
                <span className="btn-label" data-label="Abrir o WhatsApp de novo">
                  Abrir o WhatsApp de novo
                </span>
              </span>
            </a>
            <button type="button" onClick={download} className="btn label">
              <span className="btn-clip">
                <span className="btn-label" data-label="Adicionar à agenda">
                  Adicionar à agenda
                </span>
              </span>
            </button>
          </div>
          <p className="mt-3 text-[13px] text-mute">O arquivo de agenda fica marcado como pendente de confirmação.</p>
          <details className="mt-10 max-w-xl border-t border-[var(--line)] pt-4">
            <summary className="label cursor-pointer py-2 text-champagne">Ver a mensagem</summary>
            <pre className="mt-3 whitespace-pre-wrap font-sans text-[15px] text-ivory/80">{buildMessage(b)}</pre>
          </details>
        </div>
      ) : (
        <>
          <div className="mb-10" aria-hidden="true">
            <div className="h-px w-full bg-[var(--line)]">
              <div className="h-px bg-champagne transition-[width] duration-500" style={{ width: `${(step / STEPS.length) * 100}%` }} />
            </div>
            <ol className="mt-3 hidden justify-between sm:flex">
              {STEPS.map((s, i) => (
                <li key={s} className={`label text-[11px] ${i + 1 <= step ? "text-champagne" : "text-mute"}`}>
                  {String(i + 1).padStart(2, "0")} {s}
                </li>
              ))}
            </ol>
          </div>
          <p className="sr-only" aria-live="polite">
            Etapa {step} de {STEPS.length}: {STEPS[step - 1]}
          </p>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} {...anim} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
              {step === 1 && (
                <section>
                  <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(36px,6vw,72px)] outline-none">
                    Qual serviço você quer?
                  </h1>
                  <p className="mt-3 text-[16px] text-mute">O salão confirma o horário pelo WhatsApp. Você pode escolher mais de um serviço.</p>
                  <div className="mt-10 space-y-10" data-err-focus={errors.servicos ? "" : undefined} tabIndex={errors.servicos ? -1 : undefined}>
                    {SERVICES.map((s) => (
                      <fieldset key={s.slug}>
                        <legend className="label mb-4 text-champagne">
                          {s.num} · {s.nome}
                        </legend>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {s.opcoes.map((o) => {
                            const on = b.servicos.includes(o.id);
                            return (
                              <label
                                key={o.id}
                                className={`flex min-h-[56px] cursor-pointer items-start gap-4 border p-4 transition-colors ${
                                  o.destaque ? "sm:col-span-2" : ""
                                } ${on ? "border-champagne bg-champagne/10" : "border-[var(--line)] hover:border-champagne/70"} has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne`}
                              >
                                <input type="checkbox" className="sr-only" checked={on} onChange={() => toggleServico(o.id)} />
                                <span
                                  className={`mt-1 inline-block h-[14px] w-[14px] shrink-0 rotate-45 border ${on ? "border-champagne bg-champagne" : "border-champagne/60"}`}
                                  aria-hidden="true"
                                />
                                <span>
                                  <span className={`block ${o.destaque ? "font-display text-[26px]" : "text-[17px]"}`}>{o.nome}</span>
                                  {o.nota && <span className="mt-1 block text-[15px] text-mute">{o.nota}</span>}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  {errors.servicos && (
                    <p role="alert" className="mt-6 text-[15px] text-[#ff9a8a]">
                      {errors.servicos}
                    </p>
                  )}
                </section>
              )}

              {step === 2 && (
                <section>
                  <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(36px,6vw,72px)] outline-none">
                    Com quem?
                  </h1>
                  <p className="mt-3 text-[16px] text-mute">Se não tiver preferência, o salão encaixa com quem estiver disponível.</p>
                  <fieldset className="mt-10 grid gap-3 sm:grid-cols-2">
                    <legend className="sr-only">Profissional</legend>
                    {[{ nome: "", funcao: "O salão escolhe para você" }, ...pros].map((m) => {
                      const on = b.prof === m.nome;
                      return (
                        <label
                          key={m.nome || "sem"}
                          className={`flex min-h-[56px] cursor-pointer items-start gap-4 border p-4 transition-colors ${
                            on ? "border-champagne bg-champagne/10" : "border-[var(--line)] hover:border-champagne/70"
                          } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne`}
                        >
                          <input type="radio" name="prof" className="sr-only" checked={on} onChange={() => set({ prof: m.nome })} />
                          <span className={`mt-1 inline-block h-[14px] w-[14px] shrink-0 rounded-full border ${on ? "border-champagne bg-champagne" : "border-champagne/60"}`} aria-hidden="true" />
                          <span>
                            <span className="block text-[17px]">{m.nome || "Sem preferência"}</span>
                            {m.funcao && <span className="block text-[15px] text-mute">{m.funcao}</span>}
                          </span>
                        </label>
                      );
                    })}
                  </fieldset>
                </section>
              )}

              {step === 3 && (
                <section>
                  <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(36px,6vw,72px)] outline-none">
                    Quando fica bom?
                  </h1>
                  <p className="mt-3 mb-10 text-[16px] text-mute">Escolha o dia e um horário, ou só o período, se preferir.</p>
                  <BookingCalendar
                    data={b.data}
                    hora={b.hora}
                    periodo={b.periodo}
                    now={now}
                    onChange={(v) => {
                      set(v);
                      setErrors({});
                    }}
                    error={errors.data}
                  />
                </section>
              )}

              {step === 4 && (
                <section>
                  <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(36px,6vw,72px)] outline-none">
                    Seus dados
                  </h1>
                  <form
                    className="mt-10 grid max-w-2xl gap-6"
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      next();
                    }}
                  >
                    <div>
                      <label htmlFor="nome" className="label mb-2 block text-[11px] text-champagne">
                        Nome
                      </label>
                      <input
                        id="nome"
                        autoComplete="name"
                        className={field}
                        value={b.nome}
                        aria-invalid={!!errors.nome}
                        aria-describedby={errors.nome ? "e-nome" : undefined}
                        onChange={(e) => set({ nome: e.target.value })}
                      />
                      {errors.nome && (
                        <p id="e-nome" className="mt-2 text-[14px] text-[#ff9a8a]">
                          {errors.nome}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="whats" className="label mb-2 block text-[11px] text-champagne">
                        WhatsApp
                      </label>
                      <input
                        id="whats"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(00) 00000-0000"
                        className={field}
                        value={b.whats}
                        aria-invalid={!!errors.whats}
                        aria-describedby={errors.whats ? "e-whats" : undefined}
                        onChange={(e) => set({ whats: maskPhone(e.target.value) })}
                      />
                      {errors.whats && (
                        <p id="e-whats" className="mt-2 text-[14px] text-[#ff9a8a]">
                          {errors.whats}
                        </p>
                      )}
                    </div>
                    <fieldset tabIndex={errors.cliente ? -1 : undefined} data-err-focus={errors.cliente ? "" : undefined} className="outline-none">
                      <legend className="label mb-3 text-[11px] text-champagne">Já é cliente?</legend>
                      <div className="flex gap-3">
                        {(
                          [
                            ["sim", "Sim"],
                            ["nao", "Ainda não"],
                          ] as const
                        ).map(([v, l]) => (
                          <label
                            key={v}
                            className={`flex h-12 min-w-28 cursor-pointer items-center justify-center border px-5 ${
                              b.cliente === v ? "border-champagne bg-champagne/10" : "border-[var(--line)]"
                            } has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-champagne`}
                          >
                            <input type="radio" name="cliente" className="sr-only" checked={b.cliente === v} onChange={() => set({ cliente: v })} />
                            {l}
                          </label>
                        ))}
                      </div>
                      {errors.cliente && <p className="mt-2 text-[14px] text-[#ff9a8a]">{errors.cliente}</p>}
                    </fieldset>
                    {hasMega && (
                      <div>
                        <label htmlFor="mega" className="label mb-2 block text-[11px] text-champagne">
                          Comprimento e volume que deseja <span className="text-mute">(opcional)</span>
                        </label>
                        <input id="mega" className={field} value={b.megaHair} onChange={(e) => set({ megaHair: e.target.value })} />
                      </div>
                    )}
                    <div>
                      <label htmlFor="obs" className="label mb-2 block text-[11px] text-champagne">
                        Observações <span className="text-mute">(opcional)</span>
                      </label>
                      <textarea id="obs" rows={3} className={field} value={b.obs} onChange={(e) => set({ obs: e.target.value })} />
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-start gap-3 text-[15px] text-ivory/85">
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 shrink-0 accent-[#cdb896]"
                          checked={b.lgpd}
                          aria-invalid={!!errors.lgpd}
                          onChange={(e) => set({ lgpd: e.target.checked })}
                        />
                        Autorizo o uso destes dados para o salão entrar em contato sobre o meu agendamento.
                      </label>
                      {errors.lgpd && <p className="mt-2 text-[14px] text-[#ff9a8a]">{errors.lgpd}</p>}
                    </div>
                    <button type="submit" className="sr-only">
                      Continuar
                    </button>
                  </form>
                </section>
              )}

              {step === 5 && (
                <section>
                  <h1 ref={heading} tabIndex={-1} className="font-display text-[clamp(36px,6vw,72px)] outline-none">
                    Confira o pedido
                  </h1>
                  <p className="mt-3 text-[16px] text-mute">É uma solicitação: o salão confirma o horário pelo WhatsApp.</p>
                  <dl className="mt-10 max-w-2xl border border-[var(--line)]">
                    {(
                      [
                        ["Serviço(s)", servicosTexto(b), 1],
                        ["Profissional", b.prof || "Sem preferência", 2],
                        ["Data", formatDia(b.data), 3],
                        ["Horário", horarioTexto(b), 3],
                        ["Nome", b.nome.trim(), 4],
                        ["WhatsApp", b.whats, 4],
                        ["Já é cliente", b.cliente === "sim" ? "Sim" : "Ainda não", 4],
                        ...(b.megaHair ? [["Comprimento e volume", b.megaHair, 4] as const] : []),
                        ...(b.obs ? [["Observações", b.obs, 4] as const] : []),
                      ] as readonly (readonly [string, string, number])[]
                    ).map(([k, v, s]) => (
                      <div key={k} className="flex items-baseline justify-between gap-6 border-b border-[var(--line)] p-4 last:border-b-0">
                        <dt className="label shrink-0 text-[11px] text-champagne">{k}</dt>
                        <dd className="flex-1 text-right text-[16px]">{v}</dd>
                        <button type="button" onClick={() => go(s)} className="label link-line shrink-0 text-[11px] text-mute">
                          Editar
                        </button>
                      </div>
                    ))}
                  </dl>
                  <a
                    href={whatsappUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={send}
                    className="btn btn-primary label mt-10 inline-flex"
                  >
                    <span className="btn-clip">
                      <span className="btn-label inline-flex items-center gap-3" data-label="Enviar pelo WhatsApp">
                        <WhatsAppIcon className="h-4 w-4" />
                        Enviar pelo WhatsApp
                      </span>
                    </span>
                  </a>
                </section>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-6">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 1}
              className="label link-line min-h-[44px] text-champagne disabled:invisible"
            >
              Voltar
            </button>
            {step < 5 && (
              <button type="button" onClick={next} className="btn btn-primary label">
                <span className="btn-clip">
                  <span className="btn-label" data-label="Continuar">
                    Continuar
                  </span>
                </span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
