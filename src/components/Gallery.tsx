"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import type { Photo } from "@/content/photos";
import Visual from "./Visual";

/**
 * Até 4 fotos: grade de colunas iguais (sem vazar da tela). Mais que isso: carrossel arrastável (data-cursor="drag"),
 * com snap no celular e parallax leve (y ±6%) só aqui.
 */
export default function Gallery({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });
  const grid = photos.length <= 4;

  useGSAP(
    () => {
      if (grid) return;
      const items = gsap.utils.toArray<HTMLElement>("[data-g]", track.current);
      items.forEach((it) => {
        const img = it.querySelector("img");
        const run = () => {
          if (reduceMotion()) return;
          if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: it, scrub: true } });
        };
        if (img && !img.complete) img.decode().then(run, run);
        else run();
      });
    },
    { scope: track },
  );

  if (grid) {
    const cols = photos.length >= 4 ? "md:grid-cols-4" : photos.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";
    return (
      <section className="bg-graphite py-16 md:py-24" aria-label="Galeria">
        <div className={`mx-auto grid max-w-[1440px] grid-cols-2 gap-4 px-5 md:px-10 ${cols}`}>
          {photos.map((p, i) => (
            <figure key={p.src}>
              <Visual photo={p} label={p.alt} className={"aspect-[4/5] w-full"} sizes={`(min-width:768px) ${Math.round(100 / photos.length)}vw, 50vw`} priority={i === 0} />
              {p.legenda && <figcaption className="label mt-3 text-[11px] text-champagne">{p.legenda}</figcaption>}
            </figure>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-graphite py-20 md:py-28" aria-label="Galeria">
      <div
        ref={track}
        data-cursor="drag"
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:snap-none md:px-10"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          drag.current = { down: true, x: e.clientX, left: track.current?.scrollLeft ?? 0, moved: false };
        }}
        onPointerMove={(e) => {
          if (!drag.current.down || !track.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          track.current.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => (drag.current.down = false)}
        onPointerLeave={() => (drag.current.down = false)}
      >
        {photos.map((p, i) => (
          <div key={p.src} data-g className="w-[78vw] shrink-0 snap-center overflow-hidden md:w-[32vw]">
            <Visual photo={p} label={p.alt} className="aspect-[4/5] w-full" sizes="(min-width:768px) 32vw, 78vw" priority={i === 0} />
            {p.legenda && <p className="label mt-3 text-[11px] text-champagne">{p.legenda}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
