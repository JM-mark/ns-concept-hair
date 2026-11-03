"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, reduceMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { NAV, SITE, whatsappLink } from "@/content/site";
import { SERVICES, serviceHref } from "@/content/services";
import { InstagramIcon, WhatsAppIcon } from "./Icons";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao trocar de página
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Cortina de cima para baixo (500ms, expo.inOut) e links em stagger de 60ms
  useEffect(() => {
    const el = overlay.current;
    if (!el) return;
    const items = el.querySelectorAll("[data-m]");
    if (open) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
      el.style.visibility = "visible";
      if (reduceMotion()) {
        gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(items, { clearProps: "all" });
      } else {
        gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: "expo.inOut" });
        gsap.fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06, delay: 0.25 });
      }
      window.setTimeout(() => el.querySelector<HTMLElement>("a")?.focus(), 350);
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
      if (reduceMotion()) el.style.visibility = "hidden";
      else gsap.to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.4, ease: "expo.inOut", onComplete: () => void (el.style.visibility = "hidden") });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc fecha; Tab fica preso dentro do menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const f = [...(overlay.current?.querySelectorAll<HTMLElement>("a, button") ?? []), toggle.current].filter(Boolean) as HTMLElement[];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const e = SITE.endereco;
  const floating = scrolled && !open;
  const ink = open; // sobre areia, texto escuro

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100]">
        <div
          className={`relative mx-auto flex h-16 w-full items-center justify-between px-5 transition-[background-color,border-color] duration-500 md:px-10 ${
            floating ? "border-b border-champagne/30 bg-ink/[0.92] backdrop-blur-[10px]" : "border-b border-transparent"
          } ${ink ? "text-ink" : "text-ivory"}`}
        >
          <button
            ref={toggle}
            type="button"
            aria-expanded={open}
            aria-controls="menu-cheio"
            onClick={() => setOpen((v) => !v)}
            className="z-10 flex h-11 items-center gap-3 transition-colors duration-300 hover:text-champagne"
          >
            <span className="relative block h-2.5 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300 ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </span>
            <span className="label text-[12px]">{open ? "Fechar" : "Menu"}</span>
          </button>

          <Link
            href="/"
            aria-label="NS Concept Hair, página inicial"
            id="header-logo"
            className={`absolute left-1/2 top-1/2 block h-9 -translate-x-1/2 -translate-y-1/2 md:h-10 ${isHome ? "home-logo" : ""}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(ink ? "/brand/ns-monograma-escuro.png" : "/brand/ns-monograma-champagne.png")} alt="NS Concept Hair" className="h-full w-auto" />
          </Link>

          <Link
            href="/agendar/"
            className="btn btn-primary z-10 hidden sm:inline-flex"
          >
            <span className="btn-clip">Agendar</span>
          </Link>
        </div>
      </header>

      <div
        id="menu-cheio"
        ref={overlay}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
        className="on-light fixed inset-0 z-[90] flex flex-col bg-sand px-5 pb-8 pt-24 text-ink md:px-10"
      >
        <nav aria-label="Menu principal" className="flex flex-1 flex-col items-center justify-center text-center">
          <ul className="space-y-1">
            {[{ href: "/", label: "Início" }, ...NAV].map((item) => (
              <li key={item.href} className="overflow-hidden">
                <div data-m>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block font-display text-[clamp(31px,4.8vw,50px)] leading-[1.12] transition-colors hover:text-bronze"
                  >
                    {item.label}
                  </Link>
                  {item.href === "/servicos/" && (
                    <ul className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-1">
                      {SERVICES.map((s) => (
                        <li key={s.slug}>
                          <Link href={serviceHref(s)} onClick={() => setOpen(false)} className="label link-line text-[11px] text-bronze-deep">
                            {s.nome}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col justify-between gap-6 text-[15px] md:flex-row md:items-end">
          <address className="not-italic">
            <div data-m>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2 text-bronze-deep">
                <WhatsAppIcon className="h-4 w-4" /> {SITE.telefone}
              </a>
              <br />
              <a href={`mailto:${SITE.email}`} className="link-line break-all text-bronze-deep">
                {SITE.email}
              </a>
              <p className="mt-1 text-bronze-deep">
                {e.rua}, {e.complemento}, {e.cidade}/{e.uf}
              </p>
            </div>
          </address>
          <div data-m>
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="link-line inline-flex items-center gap-2 text-bronze-deep">
              <InstagramIcon className="h-4 w-4" /> @nsconcepthair
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
