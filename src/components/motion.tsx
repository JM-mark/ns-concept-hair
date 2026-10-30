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

/** Título em linhas que sobem com máscara (stagger de 90ms). */
export function SplitTitle({ lines, as: Tag = "h2", className = "", trigger = "scroll", delay = 0 }: TitleProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const spans = ref.current?.querySelectorAll(".line-mask > span");
      if (!spans?.length || reduceMotion()) return;
      gsap.set(spans, { yPercent: 110 });
      gsap.to(spans, {
        yPercent: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.09,
        delay,
        scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 85%", once: true } : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="line-mask">
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}

type FadeProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  trigger?: "scroll" | "load";
};

/** Fade + 12px de deslocamento, para rótulos, números e blocos de texto. */
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

/** Faixa contínua (ciclo de 50s), pausa no hover, fades de 80px nas bordas. */
export function Marquee({ items }: { items: string[] }) {
  const row = (
    <ul className="flex shrink-0 items-center" aria-hidden={undefined}>
      {items.map((t) => (
        <li key={t} className="label flex items-center whitespace-nowrap text-[13px] tracking-[0.3em] text-champagne">
          <span className="px-8">{t}</span>
          <span className="inline-block h-[5px] w-[5px] rotate-45 bg-champagne" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      className="group relative overflow-hidden border-y border-[var(--line)] py-5"
      style={{ maskImage: "linear-gradient(90deg, transparent, #000 80px, #000 calc(100% - 80px), transparent)" }}
    >
      <div className="flex w-max animate-[marquee_50s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row}
        <div aria-hidden="true" className="flex">
          {row}
        </div>
      </div>
    </div>
  );
}
