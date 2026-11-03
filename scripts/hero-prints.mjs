// Prints do hero (1440, 1920, 390) e a versão de vídeo escolhida em cada largura. Uso: node scripts/hero-prints.mjs
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const OUT = "scripts/_out/r4/hero"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  const size = statSync(f).size, range = req.headers.range;
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.setHeader("Accept-Ranges", "bytes");
  if (range) { const [a, b] = range.replace("bytes=", "").split("-"); const s = +a, e = b ? +b : size - 1; res.statusCode = 206; res.setHeader("Content-Range", `bytes ${s}-${e}/${size}`); res.setHeader("Content-Length", e - s + 1); res.end(readFileSync(f).subarray(s, e + 1)); }
  else { res.setHeader("Content-Length", size); res.end(readFileSync(f)); }
}).listen(3295);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [label, vp, dpr, mobile] of [["1440", { width: 1440, height: 900 }, 1, false], ["1920", { width: 1920, height: 1080 }, 1, false], ["2560-dpr2", { width: 1700, height: 950 }, 2, false], ["390", { width: 390, height: 844 }, 3, true]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3295/", { waitUntil: "load" }); await sleep(9000);
  const src = await page.evaluate(() => { const v = document.querySelector(".h-layer video"); return v ? `${v.currentSrc.split("/").pop()} (${v.videoWidth}x${v.videoHeight})` : "sem vídeo"; });
  console.log(label, "->", src);
  await page.screenshot({ path: `${OUT}/hero-${label}.png` });
  await ctx.close();
}
await browser.close(); server.close();
