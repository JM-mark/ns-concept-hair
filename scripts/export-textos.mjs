// Exporta os textos das páginas de serviço (src/content/services.ts) para docs/textos-servicos.md, para revisão do salão.
// Uso: node scripts/export-textos.mjs
import { writeFileSync } from "node:fs";
import { SERVICES } from "../src/content/services.ts";

const words = (s) => s.split(/\s+/).filter(Boolean).length;
let md = `# Textos das páginas de serviço (para aprovação)

Texto de cada página: **O que é**, **Para quem é**, **Como funciona** e **Perguntas frequentes**. Tom acolhedor, sem prometer resultado e sem
técnicas, marcas, preços, prazos ou nomes de profissionais. As etapas de "Como funciona" são genéricas e dependem de confirmação do salão.

Gerado por \`node scripts/export-textos.mjs\` a partir de \`src/content/services.ts\`. Para pedir ajustes, basta me dizer a frase e o serviço.

`;
const resumo = [];
for (const s of SERVICES) {
  const total = words([s.intro, ...s.oQueE, ...s.pontos, ...s.paraQuem, ...s.etapas.flatMap((e) => [e.titulo, e.texto]), ...s.faq.flatMap((f) => [f.q, f.a])].join(" "));
  resumo.push(`| ${s.nome} | ${total} |`);
  md += `## ${s.num}. ${s.nome} (/servicos/${s.slug}/)\n\n**Frase de abertura:** ${s.intro}\n\n### O que é\n${s.oQueE.map((p) => p + "\n").join("\n")}\n${s.pontos.map((p) => `- ${p}`).join("\n")}\n\n### Para quem é\n${s.paraQuem.map((p) => `- ${p}`).join("\n")}\n\n### Como funciona\n${s.etapas.map((e, i) => `${i + 1}. **${e.titulo}**: ${e.texto}`).join("\n")}\n\n### Perguntas frequentes\n${s.faq.map((f) => `**${f.q}**\n${f.a}\n`).join("\n")}\n**Combina com:** ${s.combinaCom.join(", ")}\n\n---\n\n`;
}
md += `## Tamanho de cada página (palavras, sem contar o texto fixo do template)\n\n| Serviço | Palavras |\n|---|---|\n${resumo.join("\n")}\n`;
writeFileSync("docs/textos-servicos.md", md);
console.log(resumo.join("\n"));
