// Prints de /tipografia (3 opções, 1440 e 390) e de Home/serviços após a revisão 4. Uso: node scripts/shots-tipografia.mjs
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const OUT = "scripts/_out/r4"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.end(readFileSync(f));
}).listen(3291);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [label, vp] of [["1440", { width: 1440, height: 900 }], ["390", { width: 390, height: 844 }]]) {
  const mobile = label === "390";
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3291/tipografia/", { waitUntil: "networkidle" });
  await sleep(2500);
  await page.evaluate(() => document.querySelectorAll("body *").forEach((e) => { if (getComputedStyle(e).position === "fixed") e.style.display = "none"; }));
  const blocks = await page.$$("section.border-t-4");
  for (const [i, b] of blocks.entries()) {
    await b.scrollIntoViewIfNeeded(); await sleep(600);
    await b.screenshot({ path: `${OUT}/tipo-${"ABC"[i]}-${label}.png` });
  }
  await ctx.close();
}
await browser.close(); server.close(); console.log("ok");
