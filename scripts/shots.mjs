// Capturas de tela da prévia (1440 e 390) a partir do build estático em out/.
// Uso: node scripts/shots.mjs [saida]   (padrão: scripts/_out/prints)
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");

const ROOT = "out";
const OUT = process.argv[2] || "scripts/_out/prints";
mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2" };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  let f = join(ROOT, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  const buf = readFileSync(f);
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.setHeader("Accept-Ranges", "bytes");
  res.end(buf);
}).listen(3290);

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shoot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
}
async function toSel(page, sel, offset = 0, wait = 1400) {
  await page.evaluate(([s, o]) => {
    const el = document.querySelector(s);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + o;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
  }, [sel, offset]);
  await sleep(wait);
}

for (const [label, vp] of [["1440", { width: 1440, height: 900 }], ["390", { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, hasTouch: label === "390", isMobile: label === "390" });
  const page = await ctx.newPage();
  const go = async (path, wait = 3200) => { await page.goto(`http://localhost:3290${path}`, { waitUntil: "networkidle" }); await sleep(wait); };

  // Home
  await go("/", 4200);
  await shoot(page, `${label}-home-1-hero`);
  await toSel(page, "section[aria-labelledby='sv-title']", 0, 1800);
  await shoot(page, `${label}-home-2-vitrine`);
  if (label === "1440") {
    await page.evaluate(() => window.__lenis?.scrollTo(window.scrollY + 1400, { immediate: true }));
    await sleep(1600);
    await shoot(page, `${label}-home-2b-vitrine-meio`);
  }
  await toSel(page, ".mh-photo", -80, 2200);
  await shoot(page, `${label}-home-3-megahair`);
  await toSel(page, "section[aria-labelledby='res-title']", 0, 2600);
  await shoot(page, `${label}-home-4-resultados`);
  await toSel(page, "section[aria-labelledby='rev-title']", 0, 1800);
  await shoot(page, `${label}-home-5-avaliacoes-mapa`);

  // /servicos/mega-hair
  await go("/servicos/mega-hair/", 3000);
  await shoot(page, `${label}-mega-hair-1-topo`);
  await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 1.0, { immediate: true }));
  await sleep(1800);
  await shoot(page, `${label}-mega-hair-2-meio`);
  await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 2.0, { immediate: true }));
  await sleep(1800);
  await shoot(page, `${label}-mega-hair-3-baixo`);

  // /resultados
  await go("/resultados/", 3000);
  await shoot(page, `${label}-resultados-1`);
  await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 0.9, { immediate: true }));
  await sleep(2200);
  await shoot(page, `${label}-resultados-2`);

  // /o-salao
  await go("/o-salao/", 3000);
  await shoot(page, `${label}-o-salao-1`);
  await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 1.0, { immediate: true }));
  await sleep(1800);
  await shoot(page, `${label}-o-salao-2`);
  await page.evaluate(() => window.__lenis?.scrollTo(window.innerHeight * 2.2, { immediate: true }));
  await sleep(1800);
  await shoot(page, `${label}-o-salao-3`);
  await ctx.close();
}
await browser.close();
server.close();
console.log("prints ok ->", OUT);
