import type { Photo } from "@/content/photos";
import { asset } from "@/lib/asset";
import { PhotoReveal } from "./motion";
import BrowPanel from "./BrowPanel";

type Props = {
  photo?: Photo;
  label: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  dataCursor?: string;
  position?: string; // object-position, ex.: "50% 30%"
};

/**
 * Foto real quando existe; senão painel tipográfico (número grande + nome).
 * Nunca foto de banco.
 */
export default function Visual({ photo, label, className = "", sizes = "(min-width: 1024px) 50vw, 100vw", priority, dataCursor, position }: Props) {
  if (photo) {
    return (
      <PhotoReveal className={`relative overflow-hidden rounded-[6px] bg-graphite ${className}`} dataCursor={dataCursor}>
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
          style={{ objectPosition: position ?? "50% 20%", ...(photo.lqip ? { backgroundImage: `url(${photo.lqip})`, backgroundSize: "cover" } : {}) }}
        />
      </PhotoReveal>
    );
  }
  return <BrowPanel nome={label} className={className} />;
}
