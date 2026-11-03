// Gera as imagens de compartilhamento (1200x630) de cada serviço: nome + foto real da página + logo.
// Usa a fonte Archivo já empacotada no build (out/_next/static/media) e o Chrome do sistema. Rode depois de `npm run build`.
// Saída: public/og/og-<slug>.jpg. Uso: node scripts/make-og.mjs
import { readdirSync, statSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");

const MEDIA = "out/_next/static/media";
// a fonte variável do Archivo é a maior das .woff2 do build
const fonte = readdirSync(MEDIA).filter((f) => f.endsWith(".woff2")).map((f) => ({ f, s: statSync(`${MEDIA}/${f}`).size })).sort((a, b) => b.s - a.s)[0].f;
const FONT = pathToFileURL(resolve(MEDIA, fonte)).href;

const SERVICOS = [
  { slug: "mega-hair", nome: "Mega Hair", foto: "mh-1" },
  { slug: "coloracao", nome: "Coloração", foto: "col-1" },
  { slug: "corte-e-visagismo", nome: "Corte e visagismo", foto: "corte-1" },
  { slug: "tratamentos", nome: "Tratamentos e escova", foto: "trat-1" },
  { slug: "unhas", nome: "Unhas", foto: "unhas-1" },
  { slug: "sobrancelhas", nome: "Design de sobrancelhas", foto: null }, // sem foto: traço de sobrancelha desenhado
];
const logo = pathToFileURL(resolve("public/brand/ns-monograma-champagne.png")).href;
const BROW = `<svg viewBox="0 0 400 200" fill="none" style="width:80%;margin:auto"><path d="M20 128 C 90 40, 220 18, 380 72" stroke="#cdb896" stroke-opacity=".8" stroke-width="1.6" stroke-linecap="round"/><path d="M34 148 C 104 70, 226 48, 366 98" stroke="#cdb896" stroke-opacity=".4" stroke-width="1.2" stroke-linecap="round"/><path d="M52 164 C 118 100, 232 80, 350 120" stroke="#cdb896" stroke-opacity=".2" stroke-width="1.2" stroke-linecap="round"/></svg>`;

mkdirSync("public/og", { recursive: true });
mkdirSync("scripts/_work/og", { recursive: true });
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const s of SERVICOS) {
  const img = s.foto ? pathToFileURL(resolve(`public/photos/${s.foto}.webp`)).href : null;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Archivo;src:url("${FONT}") format("woff2");font-weight:100 900;font-stretch:62% 125%}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0b0b0b;color:#f3eee6;font-family:Archivo;display:flex;overflow:hidden}
.l{width:640px;padding:56px 56px 52px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid rgba(205,184,150,.3)}
.l img{height:84px;width:auto;align-self:flex-start}
.k{font-size:15px;letter-spacing:.08em;text-transform:uppercase;color:#cdb896}
h1{font-size:${s.nome.length > 14 ? 50 : 66}px;line-height:1.04;font-weight:300;font-stretch:125%;text-transform:uppercase;letter-spacing:-.01em;margin-top:18px}
.r{flex:1;position:relative;background:#161514;display:flex}
.r img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 20%}
</style></head><body><div class="l"><img src="${logo}"><div><p class="k">NS Concept Hair · Indaiatuba</p><h1>${s.nome}</h1></div></div><div class="r">${img ? `<img src="${img}">` : BROW}</div></body></html>`;
  const f = resolve(`scripts/_work/og/${s.slug}.html`);
  writeFileSync(f, html);
  await page.goto(pathToFileURL(f).href, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const png = await page.screenshot({ type: "png" });
  await sharp(png).jpeg({ quality: 86 }).toFile(`public/og/og-${s.slug}.jpg`);
  console.log("og", s.slug, (readFileSync(`public/og/og-${s.slug}.jpg`).length / 1024).toFixed(0) + " KB");
}
await browser.close();
