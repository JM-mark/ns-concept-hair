// Prints extras da revisão 4: /servicos, /contato, /avaliacoes e menu aberto (1440 e 390).
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.end(readFileSync(f));
}).listen(3293);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [label, vp] of [["1440", { width: 1440, height: 900 }], ["390", { width: 390, height: 844 }]]) {
  const mobile = label === "390";
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  for (const [n, path, y] of [["servicos", "/servicos/", 700], ["servicos2", "/servicos/", 1500], ["contato", "/contato/", 600], ["avaliacoes", "/avaliacoes/", 500]]) {
    await page.goto(`http://localhost:3293${path}`, { waitUntil: "load" }); await sleep(2500);
    await page.evaluate((v) => (window.__lenis ? window.__lenis.scrollTo(v, { immediate: true }) : window.scrollTo(0, v)), y); await sleep(1800);
    await page.screenshot({ path: `scripts/_out/r4/x-${label}-${n}.png` });
  }
  await page.goto("http://localhost:3293/servicos/", { waitUntil: "load" }); await sleep(2000);
  await page.click("button[aria-controls='menu-cheio']"); await sleep(1800);
  await page.screenshot({ path: `scripts/_out/r4/x-${label}-menu.png` });
  await ctx.close();
}
await browser.close(); server.close(); console.log("ok");
