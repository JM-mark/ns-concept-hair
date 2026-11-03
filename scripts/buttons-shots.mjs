// Prints da revisão de tipografia/botões: avaliações (duas opções de aspas), hero, agendamento. Uso: node scripts/buttons-shots.mjs
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const OUT = "scripts/_out/r4/btn"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  const size = statSync(f).size, range = req.headers.range;
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.setHeader("Accept-Ranges", "bytes");
  if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s = +a, e = b ? +b : size - 1; res.statusCode = 206; res.setHeader("Content-Range", `bytes ${s}-${e}/${size}`); res.setHeader("Content-Length", e - s + 1); res.end(readFileSync(f).subarray(s, e + 1)); }
  else { res.setHeader("Content-Length", size); res.end(readFileSync(f)); }
}).listen(3296);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const to = (page, sel, off = 0) => page.evaluate(([s, o]) => { const y = document.querySelector(s).getBoundingClientRect().top + window.scrollY + o; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); }, [sel, off]);
for (const [label, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3296/", { waitUntil: "load" }); await sleep(8000);
  await page.screenshot({ path: `${OUT}/hero-${label}.png` });
  await to(page, "section[aria-labelledby='rev-title']", mobile ? 40 : 120); await sleep(2800);
  await page.screenshot({ path: `${OUT}/rev-${label}-traco.png` });
  await page.evaluate(() => document.querySelector("section[data-aspas]").setAttribute("data-aspas", "aspa")); await sleep(600);
  await page.screenshot({ path: `${OUT}/rev-${label}-aspa.png` });
  await page.evaluate(() => document.querySelector("section[data-aspas]").setAttribute("data-aspas", "traco"));
  // faixa de palavras com uma palavra sob o mouse + botão em hover
  await to(page, ".palavra", -300); await sleep(1200);
  const p = await page.evaluate(() => { const e = document.querySelectorAll(".palavra")[1]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (!mobile) await page.mouse.move(p.x, p.y, { steps: 5 });
  await sleep(700);
  await page.screenshot({ path: `${OUT}/faixa-${label}.png` });
  await page.goto("http://localhost:3296/agendar/", { waitUntil: "load" }); await sleep(3000);
  await page.screenshot({ path: `${OUT}/agendar-${label}.png` });
  await page.goto("http://localhost:3296/servicos/mega-hair/", { waitUntil: "load" }); await sleep(3000);
  await page.screenshot({ path: `${OUT}/servico-${label}.png` });
  await ctx.close();
}
await browser.close(); server.close(); console.log("ok");
