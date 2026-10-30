"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, finePointer, reduceMotion } from "@/lib/gsap";
import { SERVICES, serviceHref } from "@/content/services";
import { firstPhoto } from "@/content/photos";
import Visual from "./Visual";

/** Lista editorial: a foto do serviço aparece seguindo o mouse, com leve atraso, no hover de cada linha. */
export default function ServiceList() {
  const preview = useRef<HTMLDivElement>(null);
  const qx = useRef<((v: number) => void) | null>(null);
  const qy = useRef<((v: number) => void) | null>(null);

  const ensure = () => {
    if (!preview.current || qx.current) return;
    qx.current = gsap.quickTo(preview.current, "x", { duration: 0.55, ease: "power3.out" }) as (v: number) => void;
    qy.current = gsap.quickTo(preview.current, "y", { duration: 0.55, ease: "power3.out" }) as (v: number) => void;
  };
  const on = () => finePointer() && !reduceMotion();

  return (
    <section
      className="bg-ink pb-24 md:pb-36"
      onPointerMove={(e) => {
        if (!on()) return;
        ensure();
        qx.current?.(e.clientX + 24);
        qy.current?.(e.clientY - 150);
      }}
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <ul>
          {SERVICES.map((s, i) => (
            <li key={s.slug} className="border-t border-[var(--line)] last:border-b">
              <Link
                href={serviceHref(s)}
                className="group relative flex flex-col gap-2 py-8 md:flex-row md:items-baseline md:gap-10 md:py-10"
                onPointerEnter={() => {
                  if (!on() || !preview.current) return;
                  gsap.to(preview.current, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "power3.out", overwrite: "auto" });
                  preview.current.querySelectorAll<HTMLElement>("[data-pv]").forEach((n, k) => (n.style.display = k === i ? "block" : "none"));
                }}
                onPointerLeave={() => preview.current && gsap.to(preview.current, { autoAlpha: 0, scale: 0.94, duration: 0.3, overwrite: "auto" })}
              >
                <span className="label w-12 text-champagne">{s.num}</span>
                <span className="font-display text-[clamp(36px,6vw,88px)] leading-none transition-transform duration-700 ease-out group-hover:translate-x-3">
                  {s.nome}
                </span>
                <span className="max-w-xs text-[15px] text-mute md:ml-auto md:text-right">{s.linha}</span>
                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-out group-hover:scale-x-100" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[300px] w-[240px] opacity-0 lg:block"
        style={{ visibility: "hidden", transform: "scale(0.94)" }}
      >
        {SERVICES.map((s, i) => (
          <div key={s.slug} data-pv style={{ display: i === 0 ? "block" : "none" }} className="h-full w-full">
            <Visual photo={firstPhoto(s.fotoKey)} num={s.num} label={s.nome} className="h-full w-full" sizes="240px" />
          </div>
        ))}
      </div>
    </section>
  );
}
