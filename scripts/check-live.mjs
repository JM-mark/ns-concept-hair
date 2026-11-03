// Confere o site publicado num Chrome real: erros de console, 404, vídeo do hero, fonte, rolagem horizontal. Uso: node scripts/check-live.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("../scripts/_work/tools/node_modules/playwright-core");
const B = "https://jm-mark.github.io/ns-concept-hair";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const [label, vp, mobile] of [["1440", { width: 1440, height: 900 }, false], ["390", { width: 390, height: 844 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  for (const path of ["/", "/servicos/", "/servicos/mega-hair/", "/o-salao/", "/avaliacoes/", "/agendar/", "/contato/"]) {
    const page = await ctx.newPage();
    const bad = [];
    page.on("response", (r) => r.status() >= 400 && !/_rsc=|__next\./.test(r.url()) && bad.push(`${r.status()} ${r.url().replace(B, "")}`));
    page.on("pageerror", (e) => bad.push("erro JS: " + String(e).slice(0, 100)));
    await page.goto(B + path, { waitUntil: "load" }); await sleep(path === "/" ? 8000 : 2500);
    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      font: getComputedStyle(document.querySelector("h1")).fontFamily.slice(0, 40),
      video: (() => { const v = document.querySelector(".h-layer video"); return v ? `${v.currentSrc.split("/").pop()} ${v.videoWidth}x${v.videoHeight} ${v.paused ? "parado" : "tocando"}` : null; })(),
    }));
    console.log(label, path, "| overflow", info.overflow, "| h1:", info.font, info.video ? "| " + info.video : "", bad.length ? "| PROBLEMAS: " + bad.join("; ") : "| ok");
    await page.close();
  }
  await ctx.close();
}
await browser.close();
