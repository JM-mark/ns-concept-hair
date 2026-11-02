// Prints e vídeo curto da seção de avaliações da Home (troca de avaliações + faixa rolando). Uso: node scripts/reviews-shots.mjs
import http from "node:http";
import { readFileSync, existsSync, statSync, mkdirSync, rmSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const FF = "scripts/_work/tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe";
const FR = "scripts/_work/frames-rev"; rmSync(FR, { recursive: true, force: true }); mkdirSync(FR, { recursive: true });
const OUT = "scripts/_out/r4/rev"; mkdirSync(OUT, { recursive: true });
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream"); res.end(readFileSync(f));
}).listen(3294);
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const toRev = (page, off = 0) => page.evaluate((o) => { const y = document.querySelector("section[aria-labelledby='rev-title']").getBoundingClientRect().top + window.scrollY + o; window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); }, off);
for (const [label, vp] of [["390", { width: 390, height: 844 }], ["1440", { width: 1440, height: 900 }]]) {
  const mobile = label === "390";
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3294/", { waitUntil: "load" }); await sleep(5000);
  await toRev(page, -40); await sleep(2500);
  await page.screenshot({ path: `${OUT}/rev-${label}-a.png` });
  await toRev(page, mobile ? 700 : 560); await sleep(1500);
  await page.screenshot({ path: `${OUT}/rev-${label}-b.png` });
  if (label === "1440") {
    await toRev(page, 120); await sleep(800);
    let n = 0, rec = true; const t0 = Date.now();
    const grab = (async () => { while (rec) await page.screenshot({ path: `${FR}/f${String(n++).padStart(4, "0")}.jpg`, type: "jpeg", quality: 74 }); })();
    await sleep(3000);
    await page.click("button[aria-label='Próxima avaliação']"); await sleep(2500);
    await page.mouse.move(700, 880); await sleep(500); // fora do card: a barra volta a andar
    await sleep(8500); // troca automática
    await page.evaluate(() => window.scrollBy(0, 330)); await sleep(1200);
    const p = await page.evaluate(() => { const e = document.querySelectorAll(".palavra")[1]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await page.mouse.move(p.x, p.y, { steps: 6 }); await sleep(2500);
    rec = false; await grab;
    const fps = Math.round(n / ((Date.now() - t0) / 1000));
    execFileSync(FF, ["-v", "error", "-y", "-framerate", String(fps), "-r", "24", "-i", `${FR}/f%04d.jpg`, "-vf", "scale=1280:-2", "-c:v", "libx264", "-crf", "28", "-pix_fmt", "yuv420p", "-movflags", "+faststart", `${OUT}/avaliacoes.mp4`], { stdio: "inherit" });
  }
  await ctx.close();
}
await browser.close(); server.close(); console.log("ok");
