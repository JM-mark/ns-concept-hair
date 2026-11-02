// Gera public/brand/ns-mask.svg (monograma como máscara do vídeo) e src/content/monogram-focus.ts
// (ponto mais "grosso" do monograma: o círculo inscrito maior, usado como centro do zoom da intro).
import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";

const src = readFileSync("src/content/monogram.ts", "utf8");
const grab = (k) => new RegExp(`${k}: "([^"]+)"`).exec(src)[1];
const [W, H] = [1568, 1652];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${grab("n")}" fill="#000" fill-rule="evenodd"/><path d="${grab("s")}" fill="#000" fill-rule="evenodd"/></svg>`;
writeFileSync("public/brand/ns-mask.svg", svg);

const sc = 4, w = Math.round(W / sc), h = Math.round(H / sc);
const { data } = await sharp(Buffer.from(svg)).resize(w, h, { fit: "fill" }).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
const inside = (i) => data[i] > 128;
// distância ao fundo (chamfer 2 passadas)
const d = new Float32Array(w * h);
for (let i = 0; i < w * h; i++) d[i] = inside(i) ? 1e9 : 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (!d[i]) continue; let v = d[i]; if (x) v = Math.min(v, d[i - 1] + 1); if (y) v = Math.min(v, d[i - w] + 1); if (x && y) v = Math.min(v, d[i - w - 1] + 1.414); if (x < w - 1 && y) v = Math.min(v, d[i - w + 1] + 1.414); d[i] = v; }
for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) { const i = y * w + x; if (!d[i]) continue; let v = d[i]; if (x < w - 1) v = Math.min(v, d[i + 1] + 1); if (y < h - 1) v = Math.min(v, d[i + w] + 1); if (x < w - 1 && y < h - 1) v = Math.min(v, d[i + w + 1] + 1.414); if (x && y < h - 1) v = Math.min(v, d[i + w - 1] + 1.414); d[i] = v; }
let best = 0, bi = 0;
for (let i = 0; i < w * h; i++) if (d[i] > best && d[i] < 1e8) { best = d[i]; bi = i; }
const fx = ((bi % w) + 0.5) / w, fy = (Math.floor(bi / w) + 0.5) / h, r = best / h; // r em fração da altura
writeFileSync("src/content/monogram-focus.ts", `// Gerado por scripts/make-mask.mjs. Ponto mais grosso do monograma (fração da largura/altura) e raio do círculo inscrito (fração da altura).\nexport const MONO_FOCUS = { fx: ${fx.toFixed(4)}, fy: ${fy.toFixed(4)}, r: ${r.toFixed(4)} };\n`);
console.log({ fx, fy, r });
