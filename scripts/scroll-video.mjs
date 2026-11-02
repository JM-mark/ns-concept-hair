// Vídeo curto rolando a Home inteira (1440x900): quadros de tela montados com o ffmpeg da pasta de ferramentas.
// Uso: node scripts/scroll-video.mjs   (saída: scripts/_out/home-scroll.mp4)
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const FF = "scripts/_work/tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe";
const FR = "scripts/_work/frames";
rmSync(FR, { recursive: true, force: true });
mkdirSync(FR, { recursive: true });

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
}).listen(3291);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const t0 = Date.now();
await page.goto("http://localhost:3291/", { waitUntil: "domcontentloaded" });

let n = 0, rec = true;
const grab = (async () => {
  while (rec) {
    await page.screenshot({ path: `${FR}/f${String(n++).padStart(4, "0")}.jpg`, type: "jpeg", quality: 72 });
  }
})();

await sleep(6500); // intro (N/S, vídeo dentro das letras, máscara crescendo)
const total = await page.evaluate(() => document.documentElement.scrollHeight);
for (let y = 0; y < total - 900; y += 600) {
  await page.evaluate((v) => window.__lenis?.scrollTo(v, { duration: 1.3 }), y + 600);
  await sleep(1500);
  const c = await page.evaluate(() => { const e = [...document.querySelectorAll(".shine")].find((x) => { const r = x.getBoundingClientRect(); return r.top > 100 && r.bottom < 800; }); if (!e || window.__hovered) return null; window.__hovered = true; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  if (c) { await page.mouse.move(c.x, c.y, { steps: 8 }); await sleep(1400); await page.mouse.move(c.x + 240, c.y, { steps: 8 }); await sleep(1400); }
}
await sleep(800);
rec = false;
await grab;
const secs = (Date.now() - t0) / 1000;
await browser.close();
server.close();

execFileSync(FF, ["-v", "error", "-y", "-framerate", String(Math.round(n / secs)), "-r", "24", "-i", `${FR}/f%04d.jpg`, "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "scripts/_out/home-scroll.mp4"], { stdio: "inherit" });
console.log("video ok,", n, "quadros em", secs.toFixed(1), "s");
