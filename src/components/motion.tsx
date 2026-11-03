"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";

type TitleProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** "scroll" anima ao entrar na tela; "load" anima assim que monta */
  trigger?: "scroll" | "load";
  delay?: number;
};

/** Título: cada linha sobe por uma máscara, de baixo para cima (600ms), só na primeira vez. Sem blur. */
export function SplitTitle({ lines, as: Tag = "h2", className = "", trigger = "scroll", delay = 0 }: TitleProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion()) return;
      const inner = el.querySelectorAll(".line-mask > span");
      gsap.set(inner, { yPercent: 105 });
      gsap.to(inner, {
        yPercent: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 88%", once: true } : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask">
          <span>{l}</span>{" "}
        </span>
      ))}
    </Tag>
  );
}

/** Título de seção areia, em bronze (o preenchimento no scroll saiu). */
export function FillTitle({ lines, as, className = "" }: Omit<TitleProps, "trigger" | "delay">) {
  return <SplitTitle as={as} lines={lines} className={`text-bronze ${className}`} />;
}

type FadeProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  trigger?: "scroll" | "load";
};

/** Fade + 12px de deslocamento, para rótulos e blocos de texto. */
export function Fade({ children, as: Tag = "div", className = "", delay = 0, y = 12, trigger = "scroll" }: FadeProps) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || reduceMotion()) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.9,
        ease: "power3.out",
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 90%", once: true } : undefined,
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

const STRIPS = 10;

/**
 * Entrada de foto, "pentear": a imagem aparece em 10 faixas verticais que descem uma a uma
 * (stagger de ~33ms, cerca de 900ms no total). Um único clip-path em forma de pente: a imagem não é duplicada.
 */
export function PhotoReveal({ children, className = "", dataCursor }: { children: ReactNode; className?: string; dataCursor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion()) return;
      const img = el.querySelector("img");
      const state: Record<string, number> = {};
      for (let i = 0; i < STRIPS; i++) state[`s${i}`] = 0;
      const draw = () => {
        const pts = ["0% 0%"];
        for (let i = 0; i < STRIPS; i++) {
          const v = state[`s${i}`];
          const x0 = (i / STRIPS) * 100;
          const x1 = ((i + 1) / STRIPS) * 100;
          pts.push(`${x0}% ${v}%`, `${x1}% ${v}%`);
        }
        pts.push("100% 0%");
        el.style.clipPath = `polygon(${pts.join(",")})`;
      };
      draw();
      const run = () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: draw,
          onComplete: () => void (el.style.clipPath = ""),
        });
        for (let i = 0; i < STRIPS; i++) tl.to(state, { [`s${i}`]: 100, duration: 0.6, ease: "power2.out" }, i * 0.033);
      };
      if (img && !img.complete) img.decode().then(run, run);
      else run();
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className} data-cursor={dataCursor}>
      {children}
    </div>
  );
}
