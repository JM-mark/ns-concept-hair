// Print da frase e da faixa em 1440 para comparar antes x depois. Uso: node scripts/rev-compare.mjs <live|local> <prefixo>
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const [mode, prefix] = [process.argv[2] || "local", process.argv[3] || "depois"];
const OUT = "scripts/_out/r4/cmp"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
let server, base = "https://jm-mark.github.io/ns-concept-hair";
if (mode === "local") {
  server = http.createServer((req, res) => {
    let f = join("out", decodeURIComponent(req.url.split("?")[0]));
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
    if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
    const size = statSync(f).size, range = req.headers.range;
    res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.setHeader("Accept-Ranges", "bytes");
    if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s = +a, e = b ? +b : size - 1; res.statusCode = 206; res.setHeader("Content-Range", `bytes ${s}-${e}/${size}`); res.setHeader("Content-Length", e - s + 1); res.end(readFileSync(f).subarray(s, e + 1)); }
    else { res.setHeader("Content-Length", size); res.end(readFileSync(f)); }
  }).listen(3297);
  base = "http://localhost:3297";
}
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const to = (page, sel, off = 0) => page.evaluate(([s, o]) => { const y = document.querySelector(s).getBoundingClientRect().top + window.scrollY + o; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); }, [sel, off]);
for (const [label, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto(base + "/", { waitUntil: "load" }); await sleep(8000);
  await to(page, "section[aria-labelledby='rev-title']", mobile ? 60 : 150); await sleep(2800);
  // fixa a avaliação 1 (Luciana) e para a troca automática
  await page.mouse.move(300, 450); await sleep(400);
  await page.screenshot({ path: `${OUT}/${prefix}-frase-${label}.png` });
  await page.mouse.move(5, 5);
  await to(page, ".palavra", -380); await sleep(1500);
  await page.screenshot({ path: `${OUT}/${prefix}-faixa-${label}.png` });
  // palavra preenchida (degradê) e contorno lado a lado, parando a faixa
  await page.evaluate(() => { const t = document.querySelector(".palavra").closest("div.flex"); const f = document.querySelectorAll(".palavra-cheia")[1]; t.style.animation = "none"; const r = f.getBoundingClientRect(); const base = t.getBoundingClientRect().left; t.style.transform = "translateX(" + (-(r.left - base) + 20) + "px)"; });
  await sleep(500);
  await page.screenshot({ path: `${OUT}/${prefix}-faixa2-${label}.png` });
  await ctx.close();
}
await browser.close(); server?.close(); console.log("ok", prefix);
