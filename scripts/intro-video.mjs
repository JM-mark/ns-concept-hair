// Vídeo da abertura (intro N/S) no desktop e no celular: quadros de tela + ffmpeg da pasta de ferramentas.
// Uso: node scripts/intro-video.mjs   (saídas: scripts/_out/intro-desktop.mp4 e intro-celular.mp4)
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const FF = "scripts/_work/tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
}).listen(3292);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [name, vp, mobile] of [["desktop", { width: 1440, height: 900 }, false], ["celular", { width: 390, height: 844 }, true]]) {
  const FR = `scripts/_work/intro-${name}`;
  rmSync(FR, { recursive: true, force: true });
  mkdirSync(FR, { recursive: true });
  const ctx = await browser.newContext({ viewport: vp, hasTouch: mobile, isMobile: mobile });
  const page = await ctx.newPage();
  let n = 0, rec = true;
  await page.goto("about:blank");
  const grab = (async () => { while (rec) await page.screenshot({ path: `${FR}/f${String(n++).padStart(4, "0")}.jpg`, type: "jpeg", quality: 75 }); })();
  const t0 = Date.now();
  await page.goto("http://localhost:3292/", { waitUntil: "commit" });
  await sleep(7500);
  rec = false;
  await grab;
  const secs = (Date.now() - t0) / 1000;
  await ctx.close();
  const fps = Math.round(n / secs);
  execFileSync(FF, ["-v", "error", "-y", "-framerate", String(fps), "-i", `${FR}/f%04d.jpg`, "-r", "24", "-vf", mobile ? "scale=390:-2" : "scale=1280:-2", "-c:v", "libx264", "-crf", "27", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `scripts/_out/intro-${name}.mp4`], { stdio: "inherit" });
  console.log(name, n, "quadros", fps, "fps");
}
await browser.close();
server.close();
