// Quadros da intro (e do encolhimento no scroll) para conferir a animação. Uso: node scripts/intro-frames.mjs [1440|390]
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const label = process.argv[2] || "1440";
const vp = label === "390" ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const OUT = "scripts/_out/r4/intro"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.end(readFileSync(f));
}).listen(3292);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const ctx = await browser.newContext({ viewport: vp, isMobile: label === "390", hasTouch: label === "390" });
const page = await ctx.newPage();
const errs = []; page.on("response", (r) => r.status() === 404 && errs.push("404 " + r.url())); page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => m.type() === "error" && errs.push(m.text()));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto("http://localhost:3292/", { waitUntil: "load" });
const t0 = Date.now();
const times = [400, 900, 1400, 1900, 2300, 2800, 3200, 3600, 4000, 5000];
const shots = [];
for (const t of times) { await sleep(Math.max(0, t - (Date.now() - t0))); shots.push({ t, b: await page.screenshot() }); }
// rolagem: encolhimento
const sc = [];
for (const y of [150, 350, 600, 800]) { await page.evaluate((v) => (window.__lenis ? window.__lenis.scrollTo(v, { immediate: true }) : window.scrollTo(0, v)), y); await sleep(1300); sc.push({ t: `scroll ${y}`, b: await page.screenshot() }); }
const all = [...shots, ...sc];
const tw = label === "390" ? 195 : 480, th = label === "390" ? 422 : 300, cols = label === "390" ? 7 : 4;
const cells = await Promise.all(all.map(async (s, i) => {
  const img = await sharp(s.b).resize(tw, th).jpeg({ quality: 80 }).toBuffer();
  const lab = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="18"><rect width="100%" height="100%" fill="#000"/><text x="4" y="13" font-family="Arial" font-size="12" fill="#fff">${s.t}</text></svg>`);
  return { input: await sharp({ create: { width: tw, height: th + 18, channels: 3, background: "#000" } }).composite([{ input: img, left: 0, top: 0 }, { input: lab, left: 0, top: th }]).jpeg().toBuffer(), i };
}));
const rows = Math.ceil(cells.length / cols);
await sharp({ create: { width: cols * (tw + 4), height: rows * (th + 22), channels: 3, background: "#333" } }).composite(cells.map((c) => ({ input: c.input, left: (c.i % cols) * (tw + 4), top: Math.floor(c.i / cols) * (th + 22) }))).jpeg({ quality: 82 }).toFile(`${OUT}/frames-${label}.jpg`);
console.log("erros:", errs.length ? errs : "nenhum");
await browser.close(); server.close();
