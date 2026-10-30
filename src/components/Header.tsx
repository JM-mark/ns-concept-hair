"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap, reduceMotion } from "@/lib/gsap";
import { asset } from "@/lib/asset";
import { NAV } from "@/content/site";
import { SERVICES, serviceHref } from "@/content/services";
import Button from "./Button";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao trocar de página (evento externo: rota)
  useEffect(() => {
    const t = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      window.__lenis?.stop();
      document.body.style.overflow = "hidden";
      if (!reduceMotion() && menu.current) {
        gsap.fromTo(
          menu.current.querySelectorAll("[data-m]"),
          { yPercent: 40, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.07, delay: 0.1 },
        );
      }
    } else {
      window.__lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const solid = scrolled || open || !isHome;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,backdrop-filter,border-color] duration-500 ${
          solid ? "border-b border-[var(--line)] bg-ink/85 backdrop-blur-[12px]" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 md:px-10 lg:h-20">
          <Link href="/" aria-label="NS Concept Hair, página inicial" id="header-logo" className={`block h-11 lg:h-12 ${isHome ? "home-logo" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/brand/ns-monograma-champagne.png")} alt="NS Concept Hair" className="h-full w-auto" />
          </Link>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {NAV.map((item) => (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`label link-line py-3 ${pathname.startsWith(item.href.slice(0, -1)) ? "text-champagne" : "text-ivory"}`}
                  >
                    {item.label}
                  </Link>
                  {"children" in item && item.children && (
                    <div className="invisible absolute left-1/2 top-full w-72 -translate-x-1/2 translate-y-2 border border-[var(--line)] bg-ink/95 p-3 opacity-0 backdrop-blur-[12px] transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul>
                        {SERVICES.map((s) => (
                          <li key={s.slug}>
                            <Link
                              href={serviceHref(s)}
                              className="flex items-baseline gap-4 px-3 py-2.5 text-[15px] text-ivory transition-colors hover:text-champagne"
                            >
                              <span className="label text-[11px] text-mute">{s.num}</span>
                              {s.nome}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <Button href="/agendar/" variant="primary" className="hidden !min-h-[44px] !px-6 sm:inline-flex">
              Agendar
            </Button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="relative block h-3 w-7">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-champagne transition-transform duration-500 ${open ? "translate-y-[6px] rotate-[20deg]" : ""}`}
                />
                <span
                  className={`absolute bottom-0 left-0 h-px w-full bg-champagne transition-transform duration-500 ${open ? "-translate-y-[5px] -rotate-[20deg]" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="menu-mobile"
        ref={menu}
        className={`fixed inset-0 z-[90] flex flex-col justify-center bg-ink px-6 pb-10 pt-24 transition-opacity duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        aria-hidden={!open}
      >
        <nav aria-label="Menu mobile">
          <ul className="space-y-2">
            {[{ href: "/", label: "Início" }, ...NAV].map((item) => (
              <li key={item.href} data-m>
                <Link href={item.href} className="block py-1 font-display text-[44px] leading-[1.1] text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10" data-m>
          <Button href="/agendar/" variant="primary" className="w-full">
            Agendar horário
          </Button>
        </div>
      </div>
    </>
  );
}
