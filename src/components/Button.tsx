"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap, finePointer, reduceMotion } from "@/lib/gsap";

type Props = {
  href: string;
  children: string;
  variant?: "primary" | "ghost" | "ivory" | "glass";
  className?: string;
  external?: boolean;
  icon?: ReactNode;
  ariaLabel?: string;
};

/** Botão com efeito magnético leve (máx. 6px) e texto que sobe por baixo. */
export default function Button({ href, children, variant = "ghost", className = "", external, icon, ariaLabel }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || !finePointer() || reduceMotion()) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 12;
    gsap.to(el, { x: Math.max(-6, Math.min(6, x)), y: Math.max(-6, Math.min(6, y)), duration: 0.4, ease: "power3.out" });
  };
  const leave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
  };

  const cls = `btn ${variant === "primary" ? "btn-primary" : variant === "ivory" ? "btn-ivory" : variant === "glass" ? "btn-glass" : ""} ${className}`;
  const arrow = children.trimEnd().endsWith("→");
  const text = arrow ? children.trimEnd().slice(0, -1).trimEnd() : children;
  const inner = (
    <span className="btn-clip">
      <span className="btn-label" data-label={children}>
        {icon}
        {text}
        {arrow && (
          <span className="arrow" aria-hidden="true">
            →
          </span>
        )}
      </span>
    </span>
  );

  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a
        ref={ref}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
        onPointerMove={move}
        onPointerLeave={leave}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} className={cls} aria-label={ariaLabel} onPointerMove={move} onPointerLeave={leave}>
      {inner}
    </Link>
  );
}
