// Capturas de tela (1440 e 390) e vídeo do scroll da Home, a partir do build estático em out/.
// Uso: node scripts/shots.mjs [saida]   (padrão: scripts/_out/prints)
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, renameSync } from "node:fs";
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
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
}).listen(3290);

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const shoot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });
const jump = async (page, y, wait = 1500) => { await page.evaluate((v) => (window.__lenis ? window.__lenis.scrollTo(v, { immediate: true }) : window.scrollTo(0, v)), y); await sleep(wait); };
const toSel = async (page, sel, offset = 0, wait = 1600) => {
  const y = await page.evaluate(([s, o]) => { const el = document.querySelector(s); return el ? el.getBoundingClientRect().top + window.scrollY + o : null; }, [sel, offset]);
  if (y !== null) await jump(page, y, wait);
};

for (const [label, vp] of [["1440", { width: 1440, height: 900 }], ["390", { width: 390, height: 844 }]]) {
  const mobile = label === "390";
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  const go = async (path, wait = 3200) => { await page.goto(`http://localhost:3290${path}`, { waitUntil: "networkidle" }); await sleep(wait); };

  await go("/", 6200);
  await shoot(page, `${label}-01-header-hero`);
  await page.click("[aria-controls='menu-cheio']");
  await sleep(1800);
  await shoot(page, `${label}-02-menu-aberto`);
  await page.keyboard.press("Escape");
  await sleep(900);
  await toSel(page, "section[aria-labelledby='why-title']", -40, 2800);
  await shoot(page, `${label}-03-por-que-a-ns`);
  await toSel(page, "section[aria-labelledby='jr-title']", mobile ? 200 : 700, 2400);
  await shoot(page, `${label}-04-jornada`);
  await toSel(page, "section[aria-labelledby='rev-title']", 60, 2200);
  await shoot(page, `${label}-05-avaliacoes`);
  await toSel(page, "section[aria-labelledby='sv-title']", 0, 1800);
  if (!mobile) { await page.hover("section[aria-labelledby='sv-title'] li.group >> nth=0"); await sleep(900); }
  await shoot(page, `${label}-06-servicos-grade`);
  await toSel(page, "section[aria-labelledby='tm-title']", -40, 2200);
  await shoot(page, `${label}-07-equipe`);
  await toSel(page, "section[aria-labelledby='faq-home']", -40, 2400);
  await shoot(page, `${label}-09-faq`);

  await go("/agendar/?servico=avaliacao-mega-hair", 2500);
  await shoot(page, `${label}-08-agendamento-vidro`);
  await go("/servicos/", 3000);
  await shoot(page, `${label}-12-servicos`);
  await go("/contato/", 4000);
  await jump(page, mobile ? 500 : 400, 2000);
  await shoot(page, `${label}-13-contato`);
  await go("/servicos/mega-hair/", 3000);
  await shoot(page, `${label}-10-mega-hair-topo`);
  await go("/o-salao/", 3000);
  await jump(page, mobile ? 700 : 900, 2000);
  await shoot(page, `${label}-11-o-salao`);
  await ctx.close();
}

await browser.close();
server.close();
console.log("prints ok ->", OUT);
