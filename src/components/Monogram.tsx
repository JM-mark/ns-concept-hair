import { MONOGRAM } from "@/content/monogram";

/**
 * Monograma vetorizado (N e S em grupos separados) só para a animação do hero.
 * Nos demais lugares use os PNGs oficiais de public/brand/.
 */
export default function Monogram({ className = "" }: { className?: string }) {
  const { viewBox, width, height, n, s } = MONOGRAM;
  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="NS Concept Hair"
      style={{ aspectRatio: `${width} / ${height}`, overflow: "visible" }}
    >
      <defs>
        <linearGradient id="mono-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={width} y2={height}>
          <stop offset="0" stopColor="#efe3cf" />
          <stop offset="0.45" stopColor="#c9ae88" />
          <stop offset="1" stopColor="#8c7356" />
        </linearGradient>
        <linearGradient id="mono-shine" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="mono-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
          <path d={n} fill="#fff" fillRule="evenodd" />
          <path d={s} fill="#fff" fillRule="evenodd" />
        </mask>
      </defs>
      <g id="mono-n" data-mono="n">
        <path d={n} fill="url(#mono-grad)" fillRule="evenodd" />
      </g>
      <g id="mono-s" data-mono="s">
        <path d={s} fill="url(#mono-grad)" fillRule="evenodd" />
      </g>
      <g mask="url(#mono-mask)" pointerEvents="none">
        <rect
          data-mono="shine"
          x={-width * 0.5}
          y={-height * 0.1}
          width={width * 0.4}
          height={height * 1.2}
          fill="url(#mono-shine)"
          transform={`skewX(-28)`}
          opacity="0"
        />
      </g>
    </svg>
  );
}
