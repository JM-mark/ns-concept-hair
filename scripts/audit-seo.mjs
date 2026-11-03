// Auditoria de SEO do HTML gerado (out/): por página, title e description (com tamanho), canonical, robots, H1,
// imagens sem alt e tipos de JSON-LD. Também confere o JSON-LD (campos obrigatórios) e o sitemap.
// Uso: node scripts/audit-seo.mjs   (rode depois de `npm run build`)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const achar = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  if (n === "_next" || n === "_not-found") return [];
  return statSync(p).isDirectory() ? achar(p) : n === "index.html" ? [p] : [];
});
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, re) => { const m = html.match(re); return m ? decode(m[1]) : ""; };

const linhas = [];
const erros = [];
for (const f of achar(OUT).sort()) {
  if (/404/.test(f)) continue; // página de erro: sem canonical por definição
  const html = readFileSync(f, "utf8");
  const rota = "/" + f.replace(/^out[\\/]?/, "").replace(/index\.html$/, "").replace(/\\/g, "/");
  const title = meta(html, /<title>([^<]*)<\/title>/);
  const desc = meta(html, /<meta name="description" content="([^"]*)"/);
  const canon = meta(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = meta(html, /<meta name="robots" content="([^"]*)"/);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()));
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  const semAlt = imgs.filter((t) => !/\balt=/.test(t)).length;
  const altVazio = imgs.filter((t) => /\balt=""/.test(t)).length;
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => {
    try { const j = JSON.parse(m[1]); return Array.isArray(j) ? j : [j]; } catch { erros.push(`${rota}: JSON-LD inválido`); return []; }
  });
  const tipos = ld.map((j) => j["@type"]);
  // JSON-LD: campos obrigatórios
  for (const j of ld) {
    if (!j["@context"]) erros.push(`${rota}: ${j["@type"]} sem @context`);
    if (j["@type"] === "Service" && !(j.serviceType && j.provider && j.areaServed)) erros.push(`${rota}: Service incompleto`);
    if (j["@type"] === "BreadcrumbList" && !(j.itemListElement?.length && j.itemListElement.every((x, i) => x.position === i + 1 && x.name && x.item))) erros.push(`${rota}: BreadcrumbList incompleto`);
    if (j["@type"] === "HairSalon" && !(j.name && j.address && j.telephone)) erros.push(`${rota}: HairSalon incompleto`);
  }
  if (h1s.length !== 1) erros.push(`${rota}: ${h1s.length} H1`);
  if (!/noindex/.test(robots) && process.env.NEXT_PUBLIC_INDEXABLE !== "true") erros.push(`${rota}: prévia sem noindex`);
  linhas.push({ rota, title, tt: title.length, desc, dd: desc.length, canon, robots, h1: h1s.join(" / "), n: h1s.length, semAlt, altVazio, tipos: tipos.join("+") });
}

const esc = (s) => String(s).replace(/|/g, "¦"); // "|" do título quebraria a tabela markdown
const faixaT = (n) => (n >= 50 && n <= 60 ? "ok" : n < 50 ? "curto" : "longo");
const faixaD = (n) => (n >= 140 && n <= 160 ? "ok" : n < 140 ? "curta" : "longa");
console.log("| Página | Title (chars) | Description (chars) | Canonical | Robots | H1 | Imgs sem alt (alt vazio) | JSON-LD |");
console.log("|---|---|---|---|---|---|---|---|");
for (const l of linhas) {
  console.log(`| ${l.rota} | ${esc(l.title)} (${l.tt}, ${faixaT(l.tt)}) | ${l.dd} (${faixaD(l.dd)}) | ${l.canon.replace(/^https?:\/\/[^/]+/, "") || "AUSENTE"} | ${l.robots || "—"} | ${l.n}: ${l.h1} | ${l.semAlt} (${l.altVazio}) | ${l.tipos || "—"} |`);
  if (!l.canon) erros.push(`${l.rota}: sem canonical`);
  if (l.semAlt) erros.push(`${l.rota}: ${l.semAlt} imagem(ns) sem atributo alt`);
}
// sitemap
try {
  const sm = readFileSync(join(OUT, "sitemap.xml"), "utf8");
  const urls = [...sm.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({ loc: /<loc>([^<]*)/.exec(m[1])?.[1], mod: /<lastmod>([^<]*)/.exec(m[1])?.[1] }));
  console.log(`\nSitemap: ${urls.length} URLs`);
  for (const u of urls) console.log(`- ${u.loc}  lastmod ${u.mod}`);
} catch { erros.push("sem sitemap.xml"); }
console.log("\nrobots.txt:\n" + readFileSync(join(OUT, "robots.txt"), "utf8"));
console.log(erros.length ? "PROBLEMAS:\n" + erros.map((e) => "- " + e).join("\n") : "Sem problemas.");
process.exit(erros.length ? 1 : 0);
