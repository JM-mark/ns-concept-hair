/** Painel tipográfico para serviços sem foto (Design de sobrancelhas): traço de sobrancelha em champagne, nome e frase. Sem foto de banco. */
export default function BrowPanel({ nome, frase = "Um desenho que emoldura o olhar", className = "" }: { nome: string; frase?: string; className?: string }) {
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-graphite p-6 text-ivory md:p-8 ${className}`}>
      <svg viewBox="0 0 400 200" fill="none" className="mt-2 w-full max-w-[360px]" aria-hidden="true">
        <path d="M20 128 C 90 40, 220 18, 380 72" stroke="var(--champagne)" strokeOpacity="0.8" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M34 148 C 104 70, 226 48, 366 98" stroke="var(--champagne)" strokeOpacity="0.4" strokeWidth="1" strokeLinecap="round" />
        <path d="M52 164 C 118 100, 232 80, 350 120" stroke="var(--champagne)" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="round" />
      </svg>
      <div>
        <p className="font-display text-[clamp(22px,2.6vw,36px)] leading-[1.05]">{nome}</p>
        <p className="mt-3 text-[14px] text-champagne">{frase}</p>
      </div>
    </div>
  );
}
