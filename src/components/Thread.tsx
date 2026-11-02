"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger, reduceMotion } from "@/lib/gsap";

/**
 * "O fio": uma única linha fina que ondula como um fio de cabelo ao longo da página inteira e se desenha
 * conforme o scroll (stroke-dashoffset ligado ao progresso da página). Fica na margem esquerda;
 * mix-blend-mode "difference" faz a linha aparecer clara no escuro e escura na areia.
 */
export default function Thread() {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = svg.current;
    const p = path.current;
    if (!el || !p) return;
    const still = reduceMotion();
    let trigger: ScrollTrigger | undefined;

    const build = () => {
      const H = Math.max(document.documentElement.scrollHeight, window.innerHeight);
      const W = window.innerWidth;
      const mobile = W < 768;
      const x = mobile ? 8 : 20;
      const amp = mobile ? 4 : 9;
      const step = mobile ? 240 : 340;
      el.setAttribute("height", String(H));
      el.setAttribute("viewBox", `0 0 ${W} ${H}`);
      let d = `M ${x} 0 Q ${x + amp} ${step / 2} ${x} ${step}`;
      for (let y = step * 2; y < H + step; y += step) d += ` T ${x} ${y}`;
      p.setAttribute("d", d);
      p.setAttribute("stroke-width", mobile ? "0.8" : "1");
      const len = p.getTotalLength();
      p.style.strokeDasharray = String(len);
      if (still) {
        p.style.strokeDashoffset = "0";
        return;
      }
      trigger?.kill();
      p.style.strokeDashoffset = String(len);
      trigger = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5,
        onUpdate: (self) => void (p.style.strokeDashoffset = String(len * (1 - self.progress))),
      });
      p.style.strokeDashoffset = String(len * (1 - (trigger.progress || 0)));
    };

    build();
    let t = 0;
    const redo = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 200);
    };
    const ro = new ResizeObserver(redo);
    ro.observe(document.body);
    window.addEventListener("resize", redo);
    const late = window.setTimeout(build, 900); // depois de imagens e fontes
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", redo);
      window.clearTimeout(t);
      window.clearTimeout(late);
      trigger?.kill();
      gsap.killTweensOf(p);
    };
  }, [pathname]);

  return (
    <svg
      ref={svg}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[60] w-full mix-blend-difference"
      width="100%"
      height="100%"
      fill="none"
    >
      <path ref={path} stroke="#cdb896" strokeLinecap="round" />
    </svg>
  );
}
