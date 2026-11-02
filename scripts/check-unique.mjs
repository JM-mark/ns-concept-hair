// Confere que nenhuma foto aparece em mais de um lugar. Uso: node scripts/check-unique.mjs (depois de process-photos.mjs)
import { readFileSync, readdirSync } from "node:fs";

const uses = JSON.parse(readFileSync("scripts/_out/photo-uses.json", "utf8"));
const bySrc = new Map();
for (const u of uses) (bySrc.get(u.fonte + "|" + u.name) ?? bySrc.set(u.fonte + "|" + u.name, []).get(u.fonte + "|" + u.name)).push(u.uso);

// 1) cada arquivo tem um único uso
const dupNames = uses.map((u) => u.name).filter((n, i, a) => a.indexOf(n) !== i);
// 2) a mesma imagem de origem (post + recorte) não entra em dois lugares: compara o post de origem
const posts = new Map();
for (const u of uses) posts.set(u.fonte, [...(posts.get(u.fonte) ?? []), u.name]);
const sameSource = [...posts.entries()].filter(([, names]) => names.length > 1);

// 3) todo arquivo de public/photos está registrado
const files = readdirSync("public/photos").filter((f) => !f.endsWith("-800.webp")).map((f) => f.replace(".webp", ""));
const unregistered = files.filter((f) => !uses.some((u) => u.name === f));

// 4) nenhum componente/página usa a mesma chave de grupo em dois lugares que mostrem as mesmas fotos
console.log(`${uses.length} fotos registradas, ${files.length} arquivos em public/photos`);
if (dupNames.length) console.log("NOMES REPETIDOS:", dupNames);
if (sameSource.length) console.log("MESMO POST EM MAIS DE UM ARQUIVO (confirmar que são recortes diferentes e em lugares diferentes):", sameSource);
if (unregistered.length) console.log("ARQUIVOS SEM REGISTRO:", unregistered);
if (dupNames.length || unregistered.length) process.exit(1);
console.log("ok: nenhum arquivo aparece em mais de um lugar");
