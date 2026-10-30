"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, reduceMotion } from "@/lib/gsap";

const PATHS = [
  "M40 0 C120 120 -20 240 90 340 S60 520 140 600",
  "M110 0 C190 140 40 250 150 360 S130 540 210 600",
  "M190 0 C260 130 120 260 230 380 S200 550 290 600",
  "M270 0 C330 150 200 270 310 390 S280 560 360 600",
  "M340 0 C390 120 290 280 380 400 S360 540 400 590",
];

/** Ilustração própria: fios de cabelo longos em traço fino que se desenham no scroll (stroke-dashoffset). */
export default function HairStrands({ className = "", color = "var(--bronze)", opacity = 0.15 }: { className?: string; color?: string; opacity?: number }) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg || reduceMotion()) return;
      const paths = svg.querySelectorAll<SVGPathElement>("path");
      paths.forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: { trigger: svg, start: `top ${90 - i * 3}%`, end: "bottom 35%", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox="0 0 400 600" fill="none" aria-hidden="true" className={className} style={{ opacity }}>
      {PATHS.map((d) => (
        <path key={d} d={d} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      ))}
    </svg>
  );
}
