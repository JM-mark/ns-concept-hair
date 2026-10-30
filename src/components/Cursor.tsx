"use client";

import { useEffect, useRef } from "react";
import { finePointer, reduceMotion } from "@/lib/gsap";

type CursorState = "dot" | "link" | "drag" | "view";

/**
 * Um único elemento fixo, movido só com translate3d dentro de rAF (lerp 0,18).
 * Nenhum setState a cada movimento; estados por delegação de pointerover/out.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reduceMotion()) return;
    document.documentElement.classList.add("has-cursor");

    let tx = 0,
      ty = 0,
      x = 0,
      y = 0,
      started = false,
      raf = 0;
    let state: CursorState = "dot";

    const setState = (s: CursorState, text = "") => {
      if (s === state && (!text || label.current?.textContent === text)) return;
      state = s;
      el.dataset.state = s;
      if (label.current) label.current.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!started) {
        started = true;
        x = tx;
        y = ty;
        el.style.opacity = "1";
      }
    };

    const loop = () => {
      x += (tx - x) * 0.18;
      y += (ty - y) * 0.18;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t || !t.closest) return;
      if (t.closest("iframe")) {
        el.style.opacity = "0";
        return;
      }
      if (started) el.style.opacity = "1";
      if (t.closest("[data-native-cursor]")) {
        el.style.opacity = "0";
        return;
      }
      const c = t.closest<HTMLElement>("[data-cursor]");
      const kind = c?.dataset.cursor;
      if (kind === "drag") setState("drag", "Arraste");
      else if (kind === "view") setState("view", "Ver");
      else if (t.closest("a, button, [role='button'], summary")) setState("link");
      else setState("dot");
    };

    const onLeave = () => {
      el.style.opacity = "0";
    };
    const onEnter = () => {
      if (started) el.style.opacity = "1";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} className="cursor" data-state="dot" aria-hidden="true">
      <span ref={label} />
    </div>
  );
}
