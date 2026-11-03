// Data real de alteração de cada página para o sitemap: o commit mais recente que mexeu nos arquivos da página.
// Arquivo com mudança ainda não commitada conta como "agora". Escreve src/content/lastmod.generated.ts (roda antes do build).
// No CI o checkout precisa de histórico completo (fetch-depth: 0).
// Observação: as 6 páginas de serviço compartilham src/content/services.ts, então mudam juntas quando esse arquivo muda.
import { execFileSync } from "node:child_process";
import { writeFileSync, statSync, existsSync } from "node:fs";

const SERVICOS = ["mega-hair", "coloracao", "corte-e-visagismo", "tratamentos", "unhas", "sobrancelhas"];
const COMUM = ["src/components/Header.tsx", "src/components/Footer.tsx", "src/components/PageHero.tsx", "src/app/layout.tsx", "src/app/globals.css", "src/content/site.ts"];
const ROTAS = {
  "": ["src/app/page.tsx", "src/components/Hero.tsx", "src/components/WhyNS.tsx", "src/components/ServicesGrid.tsx", "src/components/MegaHairFeature.tsx", "src/components/ReviewsHome.tsx", "src/components/BookHome.tsx", "src/components/FaqSection.tsx", "src/content/faq.ts", "src/content/seo.ts"],
  "servicos/": ["src/app/servicos/page.tsx", "src/components/ServicesGrid.tsx", "src/content/services.ts", "src/content/seo.ts"],
  "o-salao/": ["src/app/o-salao/page.tsx", "src/components/Gallery.tsx", "src/components/MapCard.tsx"],
  "avaliacoes/": ["src/app/avaliacoes/page.tsx", "src/content/reviews.ts", "src/components/ReviewsHome.tsx", "src/components/MapCard.tsx"],
  "agendar/": ["src/app/agendar/page.tsx", "src/components/AgendarClient.tsx", "src/components/BookingStepper.tsx", "src/lib/booking.ts"],
  "contato/": ["src/app/contato/page.tsx", "src/components/MapCard.tsx"],
};
for (const s of SERVICOS) ROTAS[`servicos/${s}/`] = ["src/app/servicos/[slug]/page.tsx", "src/components/ServicePage.tsx", "src/components/StepsRow.tsx", "src/content/services.ts", "src/content/seo.ts"];

const git = (args) => {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
};
const sujo = new Set(git(["status", "--porcelain"]).split("\n").map((l) => l.slice(3).trim().replace(/^"|"$/g, "")).filter(Boolean));

const out = {};
for (const [rota, arqs] of Object.entries(ROTAS)) {
  const arquivos = [...arqs, ...COMUM.filter(() => false)].filter((f) => existsSync(f));
  let mais = 0;
  for (const f of arquivos) {
    let t = 0;
    if (sujo.has(f)) t = Date.now();
    else {
      const iso = git(["log", "-1", "--format=%cI", "--", f]);
      t = iso ? Date.parse(iso) : statSync(f).mtimeMs;
    }
    if (t > mais) mais = t;
  }
  out[rota] = new Date(mais || Date.now()).toISOString();
}
writeFileSync("src/content/lastmod.generated.ts", `// Gerado por scripts/gen-lastmod.mjs. Não editar à mão.\nexport const LASTMOD: Record<string, string> = ${JSON.stringify(out, null, 2)};\n`);
console.log("lastmod:", out);
