"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, reduceMotion } from "@/lib/gsap";
import { SITE } from "@/content/site";
import { MONOGRAM } from "@/content/monogram";
import { MONO_FOCUS } from "@/content/monogram-focus";
import { asset } from "@/lib/asset";
import Monogram from "./Monogram";
import HairCanvas from "./HairCanvas";
import Button from "./Button";

const SEEN_KEY = "ns-intro-v2";
const ASPECT = MONOGRAM.width / MONOGRAM.height;
const DIAG = 56; // ângulo da diagonal do N, em graus

const introSeen = () => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
};
const markSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* sem storage: a intro roda de novo, sem problema */
  }
};

/**
 * Intro: o N e o S deslizam ao longo da diagonal do N e se encaixam; o vídeo aparece DENTRO das letras
 * (o monograma é a máscara do vídeo); o monograma cresce até a máscara cobrir a tela. Ao rolar, o vídeo
 * volta a encolher para dentro do monograma, que vira o logo do header.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [posterOnly, setPosterOnly] = useState(false);
  const [variant, setVariant] = useState<"d" | "xl" | "m" | null>(null);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const only = reduceMotion() || !!conn?.saveData;
    const t = window.setTimeout(() => {
      setPosterOnly(only);
      // versão certa para a tela: o desktop nunca recebe a do celular nem uma de resolução menor que 1080p
      const w = window.innerWidth;
      setVariant(w < 768 ? "m" : w >= 1600 && window.devicePixelRatio >= 2 ? "xl" : "d");
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!v || !variant) return;
    // pausa fora da tela (a camada some quando o vídeo vira logo) e com a aba oculta
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !document.hidden) v.play().catch(() => {});
      else v.pause();
    });
    io.observe(v);
    const onVis = () => (document.hidden ? v.pause() : v.play().catch(() => {}));
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [variant]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const q = gsap.utils.selector(el);
      const html = document.documentElement;
      const layer = q(".h-layer")[0] as HTMLElement;
      const mono = q(".h-mono")[0] as HTMLElement;
      const n = q("[data-mono='n']");
      const s = q("[data-mono='s']");
      const lines = q(".h-line > span");
      const rest = q(".h-sub, .h-cta, .h-selo");
      const reduced = reduceMotion();
      const skip = reduced || introSeen() || window.scrollY > 40;
      html.dataset.hero = skip ? "final" : "intro";

      const maskUrl = `url(${asset("/brand/ns-mask.svg")})`;
      const setMask = (on: boolean) => {
        const v = on ? maskUrl : "none";
        layer.style.setProperty("mask-image", v);
        layer.style.setProperty("-webkit-mask-image", v);
        if (on) {
          layer.style.setProperty("mask-repeat", "no-repeat");
          layer.style.setProperty("-webkit-mask-repeat", "no-repeat");
        }
      };
      /** Coloca a máscara: o ponto (fx, fy) da tela é o ponto mais grosso do monograma, de altura h. */
      const place = (fx: number, fy: number, h: number) => {
        const w = h * ASPECT;
        const size = `${w}px ${h}px`;
        const pos = `${fx - MONO_FOCUS.fx * w}px ${fy - MONO_FOCUS.fy * h}px`;
        layer.style.setProperty("mask-size", size);
        layer.style.setProperty("-webkit-mask-size", size);
        layer.style.setProperty("mask-position", pos);
        layer.style.setProperty("-webkit-mask-position", pos);
      };

      // geometria (recalculada a cada refresh)
      const geom = () => {
        const vw = window.innerWidth, vh = window.innerHeight;
        const h0 = mono.offsetHeight;
        const w0 = h0 * ASPECT;
        const cx = vw / 2, cy = vh / 2;
        const f0 = { x: cx + (MONO_FOCUS.fx - 0.5) * w0, y: cy + (MONO_FOCUS.fy - 0.5) * h0 };
        const far = Math.hypot(Math.max(f0.x, vw - f0.x), Math.max(f0.y, vh - f0.y));
        const hEnd = (far * 1.04) / MONO_FOCUS.r; // altura em que o círculo inscrito cobre a tela
        const logo = document.getElementById("header-logo")?.getBoundingClientRect();
        const hl = logo?.height || 40;
        const wl = hl * ASPECT;
        const lc = { x: logo ? logo.left + logo.width / 2 : cx, y: logo ? logo.top + logo.height / 2 : 32 };
        const fl = { x: lc.x + (MONO_FOCUS.fx - 0.5) * wl, y: lc.y + (MONO_FOCUS.fy - 0.5) * hl };
        return { h0, f0, hEnd, hl, fl };
      };
      let g = geom();

      const finalText = () => {
        gsap.set(lines, { yPercent: 0 });
        gsap.set(rest, { autoAlpha: 1, y: 0 });
        gsap.set(q(".h-title"), { visibility: "visible" });
      };

      const runShrink = () => {
        // rolagem: a máscara volta a encolher e viaja até o logo do header
        const st = { p: 0 };
        const apply = () => {
          const p = st.p;
          if (p < 0.001) {
            setMask(false);
            layer.style.visibility = "visible";
            return;
          }
          setMask(true);
          const e = gsap.parseEase("power2.inOut")(p);
          const h = Math.pow(g.hEnd, 1 - e) * Math.pow(g.hl, e);
          place(g.f0.x + (g.fl.x - g.f0.x) * e, g.f0.y + (g.fl.y - g.f0.y) * e, h);
          const done = p > 0.985;
          layer.style.visibility = done ? "hidden" : "visible";
          const vid = layer.querySelector("video");
          if (vid && done) vid.pause();
          else if (vid && vid.paused) vid.play().catch(() => {});
          if (done !== (html.dataset.hero === "done")) html.dataset.hero = done ? "done" : "final";
        };
        gsap.to(st, {
          p: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${el.offsetHeight * 0.9}`,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: () => {
              g = geom();
              apply();
            },
          },
        });
        gsap.to(q(".h-fadeout"), {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: () => `+=${el.offsetHeight * 0.35}`, scrub: true },
        });
      };

      if (reduced) {
        // sem movimento: hero final estático, com o poster; o vídeo não toca
        layer.style.position = "absolute";
        gsap.set(layer, { autoAlpha: 1 });
        gsap.set(mono, { autoAlpha: 0 });
        finalText();
        html.dataset.hero = "done";
        return () => void delete html.dataset.hero;
      }

      layer.style.position = "fixed";
      gsap.set(mono, { autoAlpha: 0 });

      if (skip) {
        gsap.set(layer, { autoAlpha: 1 });
        finalText();
        runShrink();
      } else {
        const dx = Math.cos((DIAG * Math.PI) / 180), dy = Math.sin((DIAG * Math.PI) / 180);
        const dist = Math.min(window.innerHeight * 0.55, 520);
        gsap.set(layer, { autoAlpha: 0 });
        setMask(true);
        gsap.set(mono, { autoAlpha: 1 });
        // N desce pela diagonal, vindo do alto à esquerda; S sobe pela mesma diagonal, vindo de baixo à direita
        gsap.set(n, { x: -dx * dist, y: -dy * dist, autoAlpha: 0 });
        gsap.set(s, { x: dx * dist, y: dy * dist, autoAlpha: 0 });
        gsap.set(lines, { yPercent: 105 });
        gsap.set(rest, { autoAlpha: 0, y: 16 });
        gsap.set(q(".h-title"), { visibility: "visible" });
        const hgt = { h: g.h0 };
        const grow = () => place(g.f0.x, g.f0.y, hgt.h);
        place(g.f0.x, g.f0.y, g.h0);

        const tl = gsap.timeline({
          onComplete: () => {
            markSeen();
            runShrink();
            html.dataset.hero = "final";
          },
        });
        tl.to([n, s], { autoAlpha: 1, duration: 0.35, ease: "power1.out" }, 0.2)
          // encaixe com leve overshoot (1,5s)
          .to([n, s], { x: 0, y: 0, duration: 1.5, ease: "back.out(1.5)" }, 0.2)
          // o vídeo aparece dentro das letras
          .to(layer, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 1.85)
          .to(mono, { autoAlpha: 0, duration: 0.4 }, 2.1)
          .add(() => void layer.querySelector("video")?.play().catch(() => {}), 1.85)
          // a máscara cresce até cobrir a tela (1,2s, expo.inOut)
          .to(hgt, { h: g.hEnd, duration: 1.2, ease: "expo.inOut", onUpdate: grow }, 2.75)
          .add(() => setMask(false), 3.96)
          // título por linhas, de baixo para cima
          .to(lines, { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.12 }, 3.35)
          .to(rest, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 3.7);
      }

      return () => {
        delete html.dataset.hero;
      };
    },
    { scope: root },
  );

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => window.clearTimeout(id);
  }, []);

  const useVideo = SITE.heroVideo && !posterOnly;

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink" aria-label="Apresentação">
      {/* camada do vídeo: tela cheia; na intro e na rolagem vira a máscara do monograma */}
      <div className="h-layer invisible fixed inset-0 z-[5]" aria-hidden="true">
        {useVideo && variant ? (
          <video
            key={variant}
            ref={video}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={SITE.heroVideoSrc.poster}
          >
            {variant === "d" && <source src={SITE.heroVideoSrc.d.av1} type='video/mp4; codecs="av01.0.08M.08"' />}
            <source src={SITE.heroVideoSrc[variant].webm} type="video/webm" />
            <source src={SITE.heroVideoSrc[variant].mp4} type="video/mp4" />
          </video>
        ) : !useVideo ? (
          <HairCanvas />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={SITE.heroVideoSrc.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgb(11 11 11 / 0.82), rgb(11 11 11 / 0.25) 55%, rgb(11 11 11 / 0.35))" }}
        />
      </div>

      {/* monograma da intro (N e S em ouro); também serve de medida para a máscara */}
      <div className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center" aria-hidden="true">
        <div className="h-mono invisible">
          <Monogram className="h-[22svh] max-h-[240px] min-h-[120px] w-auto" />
        </div>
      </div>

      <noscript>
        <style>{`.h-layer{visibility:visible!important;opacity:1!important}.h-line>span,.h-sub,.h-cta,.h-selo{transform:none!important;visibility:visible!important;opacity:1!important}.h-mono{display:none}`}</style>
      </noscript>

      <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 pb-12 pt-[88px] md:px-10 md:pb-16">
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="h-selo h-fadeout label link-line invisible absolute right-5 top-[88px] z-20 hidden text-ivory/80 md:right-10 md:inline-block"
        >
          Resultados no Instagram →
        </a>

        <div className="h-fadeout mt-auto pt-12">
          <p className="h-sub invisible mb-5 text-[13px] uppercase tracking-[0.08em] text-champagne">NS Concept Hair · Indaiatuba</p>
          <h1 className="h-title invisible font-display text-[clamp(34px,6.3vw,96px)] leading-[1.02] text-ivory" aria-label="Seu espaço para ser cuidada.">
            <span className="h-line -mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="block" aria-hidden="true">
                Seu espaço
              </span>
            </span>
            <span className="h-line -mb-[0.1em] block overflow-hidden pb-[0.1em]">
              <span className="block" aria-hidden="true">
                para ser cuidada.
              </span>
            </span>
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="h-sub invisible max-w-md text-[17px] text-ivory/85">
              Mega Hair, coloração e visagismo com exclusividade. Beleza, cuidado e experiência em cada detalhe.
            </p>
            <div className="h-cta invisible flex flex-wrap gap-3">
              <Button href="/agendar/" variant="ivory">
                Agendar horário
              </Button>
              <Button href="/agendar/?servico=avaliacao-mega-hair" variant="glass">
                Avaliação de Mega Hair
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
