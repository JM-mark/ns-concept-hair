// Mede a altura da Home (1440 e 390) e conta as fotos de /photos/ nela. Uso: node scripts/measure.mjs (build sem basePath em out/)
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
}).listen(3294);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
for (const [label, vp] of [["1440", { width: 1440, height: 900 }], ["390", { width: 390, height: 844 }]]) {
  const page = await (await browser.newContext({ viewport: vp })).newPage();
  await page.goto("http://localhost:3294/", { waitUntil: "networkidle" });
  await new Promise((r) => setTimeout(r, 2500));
  const r = await page.evaluate(() => ({
    altura: document.documentElement.scrollHeight,
    fotos: [...document.querySelectorAll("main img")].filter((i) => (i.currentSrc || i.src).includes("/photos/")).map((i) => (i.getAttribute("src") || "").split("/").pop().replace("-800.webp", "")),
  }));
  console.log(`${label}px: altura ${r.altura}px, ${r.fotos.length} fotos [${r.fotos.join(", ")}]`);
}
await browser.close();
server.close();
