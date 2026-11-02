// Lighthouse no celular (Performance e Acessibilidade) sobre o build estático. Uso: node scripts/lighthouse.mjs [caminho]
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const T = "../scripts/_work/tools/node_modules";
const { launch } = require(`${T}/chrome-launcher`);
const lighthouse = (await import(new URL("./_work/tools/node_modules/lighthouse/core/index.js", import.meta.url).href)).default;
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".webm": "video/webm", ".svg": "image/svg+xml", ".txt": "text/plain", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  let f = join("out", decodeURIComponent(req.url.split("?")[0]));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, "index.html");
  if (!existsSync(f)) { res.statusCode = 404; res.end("404"); return; }
  res.setHeader("Content-Type", MIME[extname(f)] || "application/octet-stream");
  res.end(readFileSync(f));
}).listen(3293);
const chrome = await launch({ chromePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", chromeFlags: ["--headless=new", "--no-sandbox"] });
for (const p of (process.argv[2] ? [process.argv[2]] : ["/", "/servicos/mega-hair/", "/agendar/"])) {
  const r = await lighthouse(`http://localhost:3293${p}`, { port: chrome.port, onlyCategories: ["performance", "accessibility"], output: "json", logLevel: "error" });
  const c = r.lhr.categories;
  const fails = Object.values(r.lhr.audits).filter((a) => a.score !== null && a.score < 0.9 && r.lhr.categories.accessibility.auditRefs.some((x) => x.id === a.id)).map((a) => a.id);
  const bad = (r.lhr.audits["aria-prohibited-attr"]?.details?.items || []).map((i) => i.node?.snippet).join(" | ");
  if (bad) console.log("aria-prohibited-attr:", bad);
  console.log(`${p}  Performance ${Math.round(c.performance.score * 100)}  Acessibilidade ${Math.round(c.accessibility.score * 100)}  LCP ${r.lhr.audits["largest-contentful-paint"].displayValue}  a11y falhas: ${fails.join(", ") || "nenhuma"}`);
}
await chrome.kill();
server.close();
