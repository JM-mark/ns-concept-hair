"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, reduceMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";

/**
 * Cortina --ink que sobe na diagonal do N, com o monograma por ~300ms, e desce revelando a página.
 * Intercepta cliques em links internos. Desligada com reduced-motion.
 */
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLImageElement>(null);
  const pending = useRef(false);
  const lastPath = useRef(pathname);
  const busy = useRef(false);

  const reveal = () => {
    const el = curtain.current;
    if (!el || !pending.current) return;
    pending.current = false;
    gsap
      .timeline({
        onComplete: () => {
          busy.current = false;
          gsap.set(el, { autoAlpha: 0 });
        },
      })
      .to(mark.current, { autoAlpha: 0, duration: 0.15 })
      .to(el, { "--c": "-40%", "--d": "-10%", duration: 0.35, ease: "power3.inOut" }, "<");
  };

  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      reveal();
    }
  });

  useEffect(() => {
    const el = curtain.current;
    if (!el) return;

    const onClick = (e: MouseEvent) => {
      if (reduceMotion() || busy.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
      const here = window.location.pathname;
      if (url.pathname === here && url.hash) return; // âncora na mesma página
      if (url.pathname === here) return;
      e.preventDefault();
      busy.current = true;
      pending.current = true;
      const to = url.pathname.startsWith(base) ? url.pathname.slice(base.length) || "/" : url.pathname;
      gsap.set(el, { autoAlpha: 1, "--a": "110%", "--b": "140%", "--c": "200%", "--d": "200%" });
      gsap.set(mark.current, { autoAlpha: 0 });
      gsap
        .timeline()
        .to(el, { "--a": "-40%", "--b": "-10%", duration: 0.32, ease: "power3.inOut" })
        .to(mark.current, { autoAlpha: 1, duration: 0.15 }, "-=0.1")
        .add(() => router.push(to + url.search + url.hash), "+=0.12");
      // plano B: se a rota não trocar, abre a cortina
      window.setTimeout(() => {
        if (pending.current) reveal();
      }, 2500);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return (
    <div
      ref={curtain}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[150] flex items-center justify-center bg-ink"
      style={{
        visibility: "hidden",
        clipPath: "polygon(0 var(--a, 110%), 100% var(--b, 140%), 100% var(--d, 200%), 0 var(--c, 200%))",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={mark} src={asset("/brand/ns-monograma-champagne.png")} alt="" className="h-20 w-auto opacity-0" />
    </div>
  );
}
