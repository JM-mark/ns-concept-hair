"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";

/** Percorre os nós de texto de `root` (sem tocar em spans já divididos) e aplica `fn`. */
function mapTextNodes(root: Node, fn: (text: Text) => void) {
  const nodes: Text[] = [];
  const walk = (n: Node) => {
    n.childNodes.forEach((c) => {
      if (c.nodeType === Node.TEXT_NODE && c.textContent?.trim()) nodes.push(c as Text);
      else if (c.nodeType === Node.ELEMENT_NODE && !(c as HTMLElement).classList.contains("w")) walk(c);
    });
  };
  walk(root);
  nodes.forEach(fn);
}

/** Divide o texto em palavras (`.w`), preservando <em> e outros elementos. */
export function splitWords(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = "words";
  mapTextNodes(el, (t) => {
    const frag = document.createDocumentFragment();
    t.textContent!.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
      else {
        const s = document.createElement("span");
        s.className = "w inline-block";
        s.textContent = part;
        frag.appendChild(s);
      }
    });
    t.parentNode!.replaceChild(frag, t);
  });
}

/** Divide em palavras (sem quebra interna) e letras (`.l`). Para leitores de tela, o texto inteiro vai no aria-label. */
export function splitLetters(el: HTMLElement) {
  if (el.dataset.split) return;
  el.dataset.split = "letters";
  const full = el.textContent ?? "";
  mapTextNodes(el, (t) => {
    const frag = document.createDocumentFragment();
    t.textContent!.split(/(\s+)/).forEach((part) => {
      if (!part) return;
      if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
      else {
        const w = document.createElement("span");
        w.className = "w inline-block whitespace-nowrap";
        w.setAttribute("aria-hidden", "true");
        [...part].forEach((ch) => {
          const l = document.createElement("span");
          l.className = "l";
          l.textContent = ch;
          w.appendChild(l);
        });
        frag.appendChild(w);
      }
    });
    t.parentNode!.replaceChild(frag, t);
  });
  el.setAttribute("aria-label", full);
}

type TitleProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  /** "scroll" anima ao entrar na tela; "load" anima assim que monta */
  trigger?: "scroll" | "load";
  delay?: number;
};

/** Título que entra palavra por palavra: opacity, blur 10px → 0 e y 24px → 0 (900ms, stagger 70ms). */
export function SplitTitle({ lines, as: Tag = "h2", className = "", trigger = "scroll", delay = 0 }: TitleProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      splitWords(el);
      const words = el.querySelectorAll(".w");
      if (!words.length || reduceMotion()) return;
      gsap.set(words, { opacity: 0, y: 24, filter: "blur(10px)" });
      gsap.to(words, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.07,
        delay,
        clearProps: "filter,transform",
        scrollTrigger: trigger === "scroll" ? { trigger: el, start: "top 85%", once: true } : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
        </span>
      ))}
    </Tag>
  );
}

/**
 * Título que "preenche" no scroll: as letras vão de 18% de opacidade até a cor cheia (bronze),
 * da esquerda para a direita, de "top 85%" a "top 35%". Use em títulos >= 32px sobre areia.
 */
export function FillTitle({ lines, as: Tag = "h2", className = "" }: Omit<TitleProps, "trigger" | "delay">) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      splitLetters(el);
      const letters = el.querySelectorAll(".l");
      if (!letters.length || reduceMotion()) return;
      gsap.fromTo(
        letters,
        { color: "rgba(122, 95, 67, 0.18)" },
        {
          color: "rgb(122, 95, 67)",
          ease: "none",
          stagger: 1 / letters.length,
          duration: 1,
          scrollTrigger: { trigger: el, start: "top 85%", end: "top 35%", scrub: true },
        },
      );
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={`text-bronze ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="block">
          {l}
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

/**
 * Entrada de foto: clip-path inset(12% round 16px) → inset(0) e escala 1,1 → 1 (1,1s),
 * só depois de img.decode().
 */
export function PhotoReveal({ children, className = "", dataCursor }: { children: ReactNode; className?: string; dataCursor?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reduceMotion()) return;
      const img = el.querySelector("img");
      gsap.set(el, { clipPath: "inset(12% 12% 12% 12% round 16px)" });
      if (img) gsap.set(img, { scale: 1.1 });
      const run = () => {
        const st = { trigger: el, start: "top 92%", once: true };
        gsap.to(el, { clipPath: "inset(0% 0% 0% 0% round 16px)", duration: 1.1, ease: "expo.out", scrollTrigger: st, clearProps: "clipPath" });
        if (img) gsap.to(img, { scale: 1, duration: 1.1, ease: "expo.out", scrollTrigger: st });
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
