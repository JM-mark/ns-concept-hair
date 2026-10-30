// Gera o vídeo do hero a partir do clipe do Pexels (scripts/_work/video/pexels_36707549.mp4).
// Loop sem emenda (crossfade do fim com o começo, via overlay com alfa; o ffmpeg empacotado não tem xfade), tratamento de cor da marca, sem áudio.
// Vídeo vertical (o clipe é 9:16). Desktop: 1080x1920, exibido num painel à direita com a borda esquerda dissolvendo no preto (CSS).
// Mobile: 720x1280, ocupa a tela toda.
// Uso: node scripts/make-hero-video.mjs [pasta-de-saida]   (padrão: scripts/_out/hero)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const FF = "scripts/_work/tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe";
const SRC = "scripts/_work/video/pexels_36707549.mp4";
const OUT = process.argv[2] || "scripts/_out/hero";
mkdirSync(OUT, { recursive: true });

const DUR = 8.63; // duração do clipe
const XF = 1; // crossfade
const loop = `[0:v]trim=start=${XF}:end=${DUR},setpts=PTS-STARTPTS,fps=30,format=yuva420p[a];[0:v]trim=start=0:end=${XF},setpts=PTS-STARTPTS,fps=30,format=yuva420p,fade=t=in:st=0:d=${XF}:alpha=1,setpts=PTS+${(DUR - XF - XF).toFixed(2)}/TB[b];[a][b]overlay=eof_action=pass,format=yuv420p[v]`;
const grade = "eq=contrast=1.06:saturation=0.9:brightness=-0.05,colorbalance=rm=0.04:gm=0.01:bm=-0.04,format=yuv420p";

const run = (args) => execFileSync(FF, ["-v", "error", "-y", ...args], { stdio: "inherit" });

// Desktop: 1080x1920
const desk = `${loop};[v]scale=1080:1920,${grade}[o]`;
run(["-i", SRC, "-filter_complex", desk, "-map", "[o]", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "27", "-movflags", "+faststart", `${OUT}/hero-1080.mp4`]);
run(["-i", SRC, "-filter_complex", desk, "-map", "[o]", "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "41", "-row-mt", "1", `${OUT}/hero.webm`]);

// Mobile: 720x1280
const mob = `${loop};[v]scale=720:1280,${grade}[o]`;
run(["-i", SRC, "-filter_complex", mob, "-map", "[o]", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "28", "-movflags", "+faststart", `${OUT}/hero-720.mp4`]);

// Poster (primeiro quadro, versão desktop) e tira de quadros para conferir o loop
run(["-i", `${OUT}/hero-1080.mp4`, "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", `${OUT}/poster.jpg`]);
run(["-i", `${OUT}/hero-1080.mp4`, "-vf", "fps=1.5,scale=160:-2,tile=12x1", "-frames:v", "1", `${OUT}/tira.jpg`]);
console.log("hero ok ->", OUT);
