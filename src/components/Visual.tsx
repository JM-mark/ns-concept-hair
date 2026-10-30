import type { Photo } from "@/content/photos";
import { asset } from "@/lib/asset";

type Props = {
  photo?: Photo;
  num?: string;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  dataCursor?: string;
};

/**
 * Foto real quando existe; senão painel tipográfico (número grande + nome).
 * Nunca foto de banco.
 */
export default function Visual({ photo, num, label, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", priority, dataCursor }: Props) {
  if (photo) {
    return (
      <div className={`relative overflow-hidden bg-graphite ${className}`} data-cursor={dataCursor}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(photo.src800)}
          srcSet={`${asset(photo.src800)} 800w, ${asset(photo.src)} 2000w`}
          sizes={sizes}
          alt={photo.alt}
          width={photo.w}
          height={photo.h}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          className="h-full w-full object-cover"
          style={photo.lqip ? { backgroundImage: `url(${photo.lqip})`, backgroundSize: "cover" } : undefined}
        />
      </div>
    );
  }
  return (
    <div
      className={`relative flex items-end overflow-hidden bg-graphite p-6 md:p-8 ${className}`}
      role="img"
      aria-label={label}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(122deg, transparent 0 48.6%, rgb(205 184 150 / 0.28) 48.6% 49%, transparent 49% 100%), radial-gradient(120% 90% at 85% 10%, rgb(205 184 150 / 0.08), transparent 60%)",
        }}
      />
      {num && (
        <span className="absolute right-5 top-2 font-display text-[clamp(90px,14vw,200px)] italic leading-none text-champagne/20" aria-hidden="true">
          {num}
        </span>
      )}
      <span className="label relative text-champagne">{label}</span>
    </div>
  );
}
