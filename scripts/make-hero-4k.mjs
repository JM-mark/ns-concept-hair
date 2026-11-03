// Gera os vídeos do hero a partir do ORIGINAL 4K do Pexels (nunca de versões menores).
// Fonte: https://www.pexels.com/video/a-woman-with-long-brown-hair-8955573/ (licença Pexels), salvo em scripts/_work/pexels/v8955573.mp4
// Trecho: 0–10s (mulher de costas, sem rosto), loop sem emenda com crossfade de 0,5s, leve tratamento de cor.
// Saídas em public/video: hero-1080.{mp4,webm,av1.mp4}, hero-1440.{mp4,webm}, hero-m.{mp4,webm}, poster.webp (2560px).
// Uso: node scripts/make-hero-4k.mjs
import { execFileSync } from "node:child_process";
import { statSync, mkdirSync, unlinkSync, existsSync, readdirSync } from "node:fs";
import sharp from "sharp";

const FF = "scripts/_work/tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe";
const SRC = "scripts/_work/pexels/v8955573.mp4";
const OUT = "public/video";
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) unlinkSync(`${OUT}/${f}`); // começa limpo: só entra o que está aqui

const MB = (f) => statSync(f).size / 1048576;
const T = 10, X = 0.5; // trecho de 10s, crossfade de 0,5s → vídeo final de 9,5s

// recorte (em pixels do 4K), tratamento de cor (pretos profundos, tom levemente quente, saturação 0,9) e loop sem emenda
const chain = (crop, w, h) =>
  `[0:v]crop=${crop},scale=${w}:${h}:flags=lanczos,eq=saturation=0.9:contrast=1.06:gamma=0.96,colorbalance=rs=0.03:gs=0.01:bs=-0.03:rm=0.02:bm=-0.02,format=yuv420p,split=2[a][b];` +
  `[a]trim=start=${X}:end=${T},setpts=PTS-STARTPTS[main];` +
  `[b]trim=start=0:end=${X},setpts=PTS-STARTPTS+${T - X - X}/TB,format=yuva420p,fade=t=in:st=${T - X - X}:d=${X}:alpha=1[head];` +
  `[main][head]overlay=eof_action=pass,format=yuv420p[v]`;

const run = (args) => execFileSync(FF, ["-v", "error", "-y", ...args], { stdio: "inherit" });
const base = (crop, w, h) => ["-ss", "0", "-t", String(T), "-i", SRC, "-an", "-filter_complex", chain(crop, w, h), "-map", "[v]"];

// versões: recorte horizontal 16:9 do 4K em volta do cabelo; celular 4:5 vertical
const V = {
  "1080": { crop: "2560:1440:640:300", w: 1920, h: 1080, mp4: 6, webm: 6 },
  "1440": { crop: "2560:1440:640:300", w: 2560, h: 1440, mp4: 10, webm: 10 },
  m: { crop: "1728:2160:1056:0", w: 1080, h: 1350, mp4: 3, webm: 3 },
};

for (const [k, v] of Object.entries(V)) {
  // H.264: sobe o CRF até caber no alvo de tamanho
  let crf = 20;
  for (;;) {
    run([...base(v.crop, v.w, v.h), "-c:v", "libx264", "-crf", String(crf), "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/hero-${k}.mp4`]);
    const s = MB(`${OUT}/hero-${k}.mp4`);
    console.log(`hero-${k}.mp4 crf ${crf}: ${s.toFixed(2)} MB (alvo ${v.mp4})`);
    if (s <= v.mp4 || crf >= 34) break;
    crf += 2;
  }
  // WebM VP9
  let vc = 30;
  for (;;) {
    run([...base(v.crop, v.w, v.h), "-c:v", "libvpx-vp9", "-crf", String(vc), "-b:v", "0", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", `${OUT}/hero-${k}.webm`]);
    const s = MB(`${OUT}/hero-${k}.webm`);
    console.log(`hero-${k}.webm crf ${vc}: ${s.toFixed(2)} MB (alvo ${v.webm})`);
    if (s <= v.webm || vc >= 42) break;
    vc += 3;
  }
}

// AV1 (desktop 1080p), se o encoder aguentar
try {
  run([...base(V["1080"].crop, 1920, 1080), "-strict", "-2", "-c:v", "libaom-av1", "-crf", "34", "-b:v", "0", "-cpu-used", "6", "-row-mt", "1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/hero-1080-av1.mp4`]);
  console.log(`hero-1080-av1.mp4: ${MB(`${OUT}/hero-1080-av1.mp4`).toFixed(2)} MB`);
} catch (e) {
  console.log("AV1 não gerado:", String(e).slice(0, 120));
  if (existsSync(`${OUT}/hero-1080-av1.mp4`)) unlinkSync(`${OUT}/hero-1080-av1.mp4`);
}

// poster: primeiro frame (com o mesmo tratamento), 2560px, WebP qualidade 85
run([...base(V["1440"].crop, 2560, 1440), "-frames:v", "1", "scripts/_work/poster.png"]);
await sharp("scripts/_work/poster.png").resize({ width: 2560 }).webp({ quality: 85 }).toFile(`${OUT}/poster.webp`);
console.log(`poster.webp: ${(MB(`${OUT}/poster.webp`) * 1024).toFixed(0)} KB`);
