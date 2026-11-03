// Prints de página inteira (1440 e 390) de todas as páginas + menu aberto. Movimento reduzido: tudo visível, sem animação.
// Uso: node scripts/shots-all.mjs [base-url] [pasta]   (sem base-url, serve o out/ local)
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");

const OUT = process.argv[3] || "scripts/_out/r5";
mkdirSync(OUT, { recursive: true });
const PAGES = [["home", "/"], ["servicos", "/servicos/"], ["mega-hair", "/servicos/mega-hair/"], ["coloracao", "/servicos/coloracao/"], ["corte-e-visagismo", "/servicos/corte-e-visagismo/"], ["tratamentos", "/servicos/tratamentos/"], ["unhas", "/servicos/unhas/"], ["sobrancelhas", "/servicos/sobrancelhas/"], ["o-salao", "/o-salao/"], ["avaliacoes", "/avaliacoes/"], ["contato", "/contato/"], ["agendar", "/agendar/"]];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
let server, base = process.argv[2];
if (!base) {
  server = http.createServer((req, res) => {
    let f = join("out", decodeURIComponent(req.url.split("?")[0]));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
    const size = statSync(f).size, range = req.headers.range;
    res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.setHeader("Accept-Ranges", "bytes");
    if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s = +a, e = b ? +b : size - 1; res.statusCode = 206; res.setHeader("Content-Range", `bytes ${s}-${e}/${size}`); res.setHeader("Content-Length", e - s + 1); res.end(readFileSync(f).subarray(s, e + 1)); }
    else { res.setHeader("Content-Length", size); res.end(readFileSync(f)); }
  }).listen(3300);
  base = "http://localhost:3300";
}
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [label, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const [nome, path] of PAGES) {
    await page.goto(base + path, { waitUntil: "load" }); await sleep(2200);
    // rola a página para carregar imagens preguiçosas
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
    await sleep(900);
    await page.screenshot({ path: `${OUT}/${nome}-${label}.png`, fullPage: true });
  }
  await page.goto(base + "/servicos/", { waitUntil: "load" }); await sleep(1500);
  await page.click("button[aria-controls='menu-cheio']"); await sleep(1400);
  await page.screenshot({ path: `${OUT}/menu-${label}.png` });
  await ctx.close();
}
await browser.close(); server?.close();
// miniaturas para conferência rápida
console.log("prints ok ->", OUT);
