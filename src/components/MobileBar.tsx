"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { whatsappLink } from "@/content/site";
import { WhatsAppIcon } from "./Icons";

/** Barra fixa no celular: aparece depois do hero. */
export default function MobileBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[80] flex gap-2 border-t border-[var(--line)] bg-ink/90 p-3 backdrop-blur-[12px] transition-transform duration-500 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <Link
        href="/agendar/"
        className="label btn-primary flex min-h-[48px] flex-1 items-center justify-center bg-[image:var(--champagne-grad)] text-ink"
      >
        Agendar
      </Link>
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="flex h-12 w-12 items-center justify-center border border-champagne text-champagne"
      >
        <WhatsAppIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
