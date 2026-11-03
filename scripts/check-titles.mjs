// Confere que nenhum título (h1/h2/h3 em .font-display) tem letra cortada nem palavra partida no meio,
// em 390, 768, 1024 e 1440px, em todas as páginas do build estático (out/).
// Para cada título: mede cada palavra inteira (inline-block, sem quebra) e compara com a largura disponível;
// também acusa scrollWidth > clientWidth e linhas que começam no meio de uma palavra.
// Uso: node scripts/check-titles.mjs [base-url]   (sem argumento, serve o out/ local)
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");

const PAGES = ["/", "/servicos/", "/servicos/mega-hair/", "/servicos/coloracao/", "/servicos/corte-e-visagismo/", "/servicos/tratamentos/", "/servicos/unhas/", "/servicos/sobrancelhas/", "/o-salao/", "/avaliacoes/", "/contato/", "/agendar/"];
const WIDTHS = [390, 768, 1024, 1440];
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
let server, base = process.argv[2];
if (!base) {
  server = http.createServer((req, res) => {
    let f = join("out", decodeURIComponent(req.url.split("?")[0]));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
    res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.end(readFileSync(f));
  }).listen(3298);
  base = "http://localhost:3298";
}
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let problemas = 0, titulos = 0;
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(base + path, { waitUntil: "load" }); await sleep(path === "/" ? 1500 : 700);
    const r = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("h1, h2, h3, .font-display")) {
        if (!el.offsetParent && getComputedStyle(el).position !== "fixed") continue;
        if (el.closest(".overflow-x-auto")) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden") continue;
        const text = (el.getAttribute("aria-label") && el.tagName === "H1" ? el.textContent : el.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) continue;
        const box = el.getBoundingClientRect();
        const avail = box.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        // largura de cada palavra inteira, com o mesmo estilo
        let maxW = 0, maxWord = "";
        for (const word of text.split(" ")) {
          const s = document.createElement("span");
          s.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;display:inline-block;";
          s.textContent = word;
          el.appendChild(s);
          const ww = s.getBoundingClientRect().width;
          el.removeChild(s);
          if (ww > maxW) { maxW = ww; maxWord = word; }
        }
        // linhas que vazam (máscaras de linha e o próprio título)
        let vaza = el.scrollWidth - el.clientWidth > 1;
        for (const m of el.querySelectorAll(".line-mask, .h-line")) if (m.scrollWidth - m.clientWidth > 1) vaza = true;
        // dentro da tela?
        const fora = box.right > window.innerWidth + 1;
        out.push({ text: text.slice(0, 40), font: Math.round(parseFloat(cs.fontSize)), avail: Math.round(avail), maxW: Math.round(maxW), maxWord, partida: maxW > avail + 0.5, vaza, fora });
      }
      return out;
    });
    for (const t of r) {
      titulos++;
      if (t.partida || t.vaza || t.fora) {
        problemas++;
        console.log(`${w}px ${path} | ${t.font}px | "${t.maxWord}" ${t.maxW}px > ${t.avail}px disponíveis | ${t.partida ? "PALAVRA PARTIDA " : ""}${t.vaza ? "VAZA " : ""}${t.fora ? "FORA DA TELA" : ""} | ${t.text}`);
      }
    }
  }
  await ctx.close();
}
await browser.close(); server?.close();
console.log(`\n${titulos} títulos conferidos, ${problemas} com problema`);
process.exit(problemas ? 1 : 0);
