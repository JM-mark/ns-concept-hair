"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reduceMotion } from "@/lib/gsap";
import { SITE } from "@/content/site";
import Monogram from "./Monogram";
import HairCanvas from "./HairCanvas";
import Button from "./Button";
import { MONOGRAM } from "@/content/monogram";

const SEEN_KEY = "ns-intro-v1";
const BG_OPACITY = 0.55;

function introSeen(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* sem storage: roda a intro de novo, sem problema */
  }
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [posterOnly, setPosterOnly] = useState(false);

  // Vídeo só quando há conexão/preferência para isso; pausa fora da tela e com a aba oculta
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const only = reduceMotion() || !!conn?.saveData;
    const t = window.setTimeout(() => setPosterOnly(only), 0);
    const v = video.current;
    if (!v || only) return () => window.clearTimeout(t);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const html = document.documentElement;
      html.dataset.hero = "intro";

      const reduced = reduceMotion();
      const skip = reduced || introSeen();
      const n = q("[data-mono='n']");
      const s = q("[data-mono='s']");
      const shine = q("[data-mono='shine']");
      const letters = q(".h-letter");
      const content = q(".h-title .line-mask > span, .h-sub, .h-cta");
      const bg = q(".h-bg");

      const finalState = () => {
        gsap.set([n, s, letters], { clearProps: "all", autoAlpha: 1 });
        gsap.set(q(".h-tag"), { autoAlpha: 1 });
        gsap.set(content, { yPercent: 0, y: 0, autoAlpha: 1 });
        gsap.set(bg, { opacity: BG_OPACITY });
        gsap.set(q(".h-diag"), { autoAlpha: 0 });
      };

      if (skip) {
        finalState();
      } else {
        gsap.set([n, s], { transformOrigin: "50% 50%" });
        gsap.set(n, { x: "-12vw", y: "-4vh", autoAlpha: 0, filter: "blur(8px)", clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(s, { x: "12vw", y: "4vh", autoAlpha: 0, filter: "blur(8px)", clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(letters, { autoAlpha: 0, letterSpacing: "0.6em" });
        gsap.set(q(".h-title .line-mask > span"), { yPercent: 110, autoAlpha: 1 });
        gsap.set(q(".h-sub, .h-cta, .h-tag"), { y: 24, autoAlpha: 0 });
        gsap.set(bg, { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, onComplete: markSeen });
        tl.fromTo(q(".h-diag"), { xPercent: -120, autoAlpha: 1 }, { xPercent: 120, duration: 0.5, ease: "power2.inOut" }, 0)
          .to(q(".h-diag"), { autoAlpha: 0, duration: 0.1 }, 0.4)
          .to(n, { x: 0, y: 0, autoAlpha: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)", duration: 1.0 }, 0.3)
          .to(s, { x: 0, y: 0, autoAlpha: 1, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)", duration: 1.0 }, 0.3)
          // encaixe: micro-overshoot e assentar
          .to([n, s], { scale: 1.02, duration: 0.1, ease: "power1.out" }, 1.3)
          .to([n, s], { scale: 1, duration: 0.25, ease: "power2.out" }, 1.4)
          // brilho metálico na diagonal
          .set(shine, { opacity: 1 }, 1.5)
          .fromTo(
            shine,
            { attr: { x: -MONOGRAM.width * 0.7 } },
            { attr: { x: MONOGRAM.width * 1.5 }, duration: 0.6, ease: "power2.inOut" },
            1.5,
          )
          .set(shine, { opacity: 0 }, 2.1)
          // CONCEPT HAIR letra por letra, tracking diminuindo
          .to(letters, { autoAlpha: 1, letterSpacing: "0.28em", duration: 0.6, stagger: 0.03 }, 1.8)
          .to(q(".h-tag"), { y: 0, autoAlpha: 1, duration: 0.8 }, 1.9)
          .to(bg, { opacity: BG_OPACITY, duration: 0.6, ease: "power1.out" }, 1.8)
          // texto do hero
          .to(q(".h-title .line-mask > span"), { yPercent: 0, duration: 1.1, stagger: 0.08 }, 2.1)
          .to(q(".h-sub, .h-cta"), { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.08 }, 2.3);
      }

      // Rolagem: o monograma encolhe e sobe até virar o logo do header; vídeo dá zoom e escurece
      if (!reduced) {
        const wrap = q(".h-mono")[0] as HTMLElement | undefined;
        const logo = () => document.getElementById("header-logo");
        if (wrap) {
          const st = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${el.offsetHeight}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const done = self.progress > 0.96;
                if (done !== (html.dataset.hero === "done")) html.dataset.hero = done ? "done" : "intro";
              },
            },
          });
          st.to(
            wrap,
            {
              x: () => {
                const l = logo()?.getBoundingClientRect();
                const w = wrap.getBoundingClientRect();
                return l ? l.left + l.width / 2 - (w.left + w.width / 2) : 0;
              },
              y: () => {
                const l = logo()?.getBoundingClientRect();
                const w = wrap.getBoundingClientRect();
                return l ? l.top + l.height / 2 - (w.top + w.height / 2) + el.offsetHeight : 0;
              },
              scale: () => {
                const l = logo()?.getBoundingClientRect();
                const w = wrap.getBoundingClientRect();
                return l && w.height ? l.height / w.height : 0.2;
              },
              transformOrigin: "50% 50%",
            },
            0,
          )
            .to(q(".h-fadeout"), { autoAlpha: 0, duration: 0.3 }, 0)
            .to(wrap, { autoAlpha: 0, duration: 0.04 }, 0.96)
            .to(q(".h-bg"), { scale: 1.1, duration: 1 }, 0)
            .to(q(".h-veil"), { opacity: 1, duration: 1 }, 0);
        }
      } else {
        html.dataset.hero = "done";
      }

      return () => {
        delete html.dataset.hero;
      };
    },
    { scope: root },
  );

  // Garante medições corretas quando as fontes terminam de carregar
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => window.clearTimeout(id);
  }, []);

  const useVideo = SITE.heroVideo && !posterOnly;

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-label="Apresentação">
      {/* fundo */}
      <div className="h-bg absolute inset-0 opacity-0 will-change-transform" aria-hidden="true">
        {SITE.heroVideo ? (
          useVideo ? (
            <video
              ref={video}
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={SITE.heroVideoSrc.poster}
            >
              <source src={SITE.heroVideoSrc.webm} type="video/webm" />
              <source src={SITE.heroVideoSrc.mp4} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={SITE.heroVideoSrc.poster} alt="" className="h-full w-full object-cover" />
          )
        ) : (
          <HairCanvas />
        )}
      </div>
      {/* véu: de --ink a 85% embaixo para 40% em cima, escurece no scroll */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{ background: "linear-gradient(to top, rgb(11 11 11 / 0.85), rgb(11 11 11 / 0.4))" }}
      />
      <div className="h-veil absolute inset-0 bg-ink/50 opacity-0" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />
      {/* diagonal do N cruzando a tela na abertura */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-diag invisible h-px w-[160vmax] -rotate-[56deg] bg-gradient-to-r from-transparent via-champagne to-transparent" />
      </div>

      <noscript>
        <style>{`.h-bg{opacity:.55!important}[data-mono],.h-letter,.h-tag,.h-sub,.h-cta,.h-title .line-mask>span{visibility:visible!important;opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-12 pt-[88px] md:px-10 md:pb-16">
        {/* monograma */}
        <div className="flex flex-col items-center pt-4 md:pt-8">
          <div className="h-mono will-change-transform">
            <Monogram className="h-[22svh] max-h-[240px] min-h-[110px] w-auto" />
          </div>
          <p
            className="label h-fadeout mt-4 flex text-[11px] text-champagne md:text-[12px]"
            aria-label="Concept Hair"
          >
            {"CONCEPT HAIR".split("").map((c, i) => (
              <span key={i} className="h-letter invisible inline-block whitespace-pre" style={{ letterSpacing: "0.28em" }} aria-hidden="true">
                {c}
              </span>
            ))}
          </p>
        </div>

        {/* texto */}
        <div className="h-fadeout mt-auto grid items-end gap-8 pt-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <p className="label h-tag invisible mb-5 text-champagne">Indaiatuba</p>
            <h1 className="h-title font-display text-[clamp(44px,8.4vw,128px)] leading-[0.98]">
              <span className="line-mask">
                <span>Seu espaço para ser</span>
              </span>
              <span className="line-mask">
                <span className="italic-champagne">cuidada.</span>
              </span>
            </h1>
          </div>
          <div className="lg:col-span-4">
            <p className="h-sub invisible max-w-md text-[17px] text-ivory/85">
              Mega Hair, coloração e visagismo com exclusividade. Beleza, cuidado e experiência em cada detalhe.
            </p>
            <div className="h-cta invisible mt-8 flex flex-wrap gap-3">
              <Button href="/agendar/" variant="primary">
                Agendar horário
              </Button>
              <Button href="/agendar/?servico=avaliacao-mega-hair">Avaliação de Mega Hair</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
