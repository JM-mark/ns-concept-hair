"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";
import type { Photo } from "@/content/photos";
import Visual from "./Visual";

/**
 * Galeria horizontal: arrastável no desktop (data-cursor="drag"), carrossel com snap no celular.
 * Parallax leve (y ±6%) e revelação por máscara só depois de img.decode().
 */
export default function Gallery({ photos }: { photos: Photo[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, x: 0, left: 0, moved: false });

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-g]", track.current);
      items.forEach((it) => {
        const img = it.querySelector("img");
        const run = () => {
          if (reduceMotion()) return;
          gsap.fromTo(
            it,
            { clipPath: "inset(0 0 100% 0)" },
            { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: it, start: "left 95%", horizontal: false } },
          );
          if (img) gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: it, scrub: true } });
        };
        if (img && !img.complete) img.decode().then(run, run);
        else run();
      });
    },
    { scope: track },
  );

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
          </div>
        ))}
      </div>
    </section>
  );
}
