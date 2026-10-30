"use client";

import { useEffect, useRef } from "react";
import { reduceMotion } from "@/lib/gsap";

/**
 * Plano C do hero (sem vídeo): centenas de fios finos champagne ondulando devagar sobre o preto,
 * reagindo levemente ao mouse. Pausa fora da tela e com a aba oculta.
 */
export default function HairCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const still = reduceMotion();
    let w = 0,
      h = 0,
      dpr = 1,
      raf = 0,
      visible = true,
      mx = 0.5;
    const COUNT = window.innerWidth < 768 ? 120 : 240;
    const strands = Array.from({ length: COUNT }, (_, i) => ({
      x: (i / COUNT) * 1.3 - 0.15 + (Math.random() - 0.5) * 0.02,
      amp: 0.02 + Math.random() * 0.07,
      freq: 0.8 + Math.random() * 1.4,
      speed: 0.04 + Math.random() * 0.1,
      phase: Math.random() * Math.PI * 2,
      alpha: 0.08 + Math.random() * 0.3,
      width: 0.4 + Math.random() * 0.9,
      depth: 0.3 + Math.random() * 0.7,
    }));

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const steps = 36;
      for (const s of strands) {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const v = i / steps;
          const sway =
            Math.sin(v * Math.PI * s.freq + t * s.speed + s.phase) * s.amp * Math.sin(v * Math.PI * 0.9 + 0.3) +
            (mx - 0.5) * 0.05 * s.depth * v;
          const x = (s.x + sway + v * 0.04) * w;
          const y = v * h * 1.1 - h * 0.05;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(205,184,150,${s.alpha})`;
        ctx.lineWidth = s.width;
        ctx.stroke();
      }
    };

    const loop = (ms: number) => {
      if (visible && !document.hidden) draw(ms / 1000);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      mx += (e.clientX / window.innerWidth - mx) * 0.1;
    };

    resize();
    window.addEventListener("resize", resize);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    if (still) {
      draw(2);
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className={`block h-full w-full ${className}`} aria-hidden="true" />;
}
