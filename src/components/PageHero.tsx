import type { ReactNode } from "react";
import { Fade, SplitTitle } from "./motion";

export default function PageHero({
  label,
  lines,
  intro,
  children,
}: {
  label: string;
  lines: ReactNode[];
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink pb-16 pt-36 md:pb-24 md:pt-48">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "linear-gradient(122deg, transparent 0 62.7%, rgb(205 184 150 / 0.18) 62.7% 62.85%, transparent 62.85%)" }}
      />
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <Fade as="p" className="eyebrow mb-8" trigger="load">
          {label}
        </Fade>
        <SplitTitle as="h1" trigger="load" lines={lines} className="max-w-full font-display text-[clamp(28px,8.2vw,104px)] leading-[1.02] [hyphens:manual]" />
        {intro && (
          <Fade as="p" trigger="load" delay={0.3} className="mt-8 max-w-xl text-[18px] text-ivory/80">
            {intro}
          </Fade>
        )}
        {children && (
          <Fade trigger="load" delay={0.4} className="mt-10 flex flex-wrap gap-3">
            {children}
          </Fade>
        )}
      </div>
    </section>
  );
}
