// Processa as fotos aprovadas: recorte, tratamento de cor único, WebP 2000px + 800px, LQIP.
// Entrada: scripts/_work/raw (posts) e scripts/_work/ba (frames dos reels). Saída: public/photos + src/content/photos.generated.ts
// Uso: node scripts/process-photos.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";

const RAW = "scripts/_work/raw";
const BA = "scripts/_work/ba";
const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });

const ig = (code, reel) => `https://www.instagram.com/${reel ? "reel" : "p"}/${code}/`;

// crop = [left, top, width, height] em fração da imagem original
// group = chave em PHOTOS; ordem = ordem de entrada no grupo
const SPEC = [
  // Home: vitrine de serviços (uma por serviço) e bloco do Mega Hair
  { name: "mh-vitrine", group: "home-mega-hair", file: `${RAW}/ig_DW6lzlhkYic_1.jpg`, post: ig("DW6lzlhkYic", 1), by: "@nettosillva.ns", alt: "Cabelo loiro longo e ondulado, com as mechas seguradas por um profissional", uso: "Home, vitrine de serviços (Mega Hair)" },
  { name: "mh-feature", group: "mega-hair-feature", file: `${RAW}/ig_DUJu_4mkfzA_1.jpg`, post: ig("DUJu_4mkfzA", 1), by: "@nettosillva.ns", alt: "Mulher de cabelo castanho longo, volumoso e com pontas douradas, sorrindo", crop: [0, 0.17, 1, 0.83], uso: "Home, bloco Mega Hair em destaque" },
  { name: "col-vitrine", group: "home-coloracao", file: `${RAW}/ig_DY-oAqtxOtJ_1.jpg`, post: ig("DY-oAqtxOtJ", 1), by: "@nettosillva.ns", alt: "Cabelo loiro mel, longo e volumoso, com ondas largas", crop: [0.03, 0.31, 0.94, 0.69], uso: "Home, vitrine de serviços (Coloração)" },
  { name: "corte-vitrine", group: "home-corte", file: `${RAW}/ig_DXSiZskD3Su_1.jpg`, post: ig("DXSiZskD3Su", 1), by: "@silvanakamer", alt: "Mulher de cabelo castanho ondulado, com corte em camadas, sorrindo", uso: "Home, vitrine de serviços (Corte e visagismo)" },
  { name: "trat-vitrine", group: "home-tratamentos", file: `${RAW}/ig_DedJkT4BtWs_1.jpg`, post: ig("DedJkT4BtWs", 1), by: "@mamoraesr", alt: "Cabelo preto, liso e brilhante, muito longo", crop: [0, 0, 1, 0.52], uso: "Home, vitrine de serviços (Tratamentos)" },

  // Mega Hair (página do serviço)
  { name: "mh-1", group: "mega-hair", file: `${RAW}/ig_DMJKFMHRBT-_1.jpg`, post: ig("DMJKFMHRBT-", 1), by: "@nsconcepthair", alt: "Cliente de cabelo loiro longo e ondulado ao lado do Netto Sillva", crop: [0, 0.1, 1, 0.9], uso: "Mega Hair, imagem principal" },
  { name: "mh-2", group: "mega-hair", file: `${RAW}/ig_DbGNfTJROOD_1.jpg`, post: ig("DbGNfTJROOD", 1), by: "@nettosillva.ns", alt: "Cabelo loiro em camadas longas, com luzes douradas, penteado pelo Netto Sillva", crop: [0.12, 0.3, 0.76, 0.45], uso: "Mega Hair, galeria" },

  // Coloração (página): do mais escuro ao mais claro
  { name: "col-1", group: "coloracao", file: `${RAW}/ig_Daqot_1qhwS_1.jpg`, post: ig("Daqot_1qhwS", 1), by: "@nsconcepthair", alt: "Cabelo marrom iluminado, longo e brilhante", legenda: "Marrom iluminado", uso: "Coloração, galeria 1/7" },
  { name: "col-2", group: "coloracao", file: `${RAW}/ig_DcepkS6R63g_1.jpg`, post: ig("DcepkS6R63g", 1), by: "@nettosillva.ns", alt: "Cabelo na cor mocha latte, longo e ondulado", legenda: "Mocha latte", uso: "Coloração, galeria 2/7" },
  { name: "col-3", group: "coloracao", file: `${RAW}/ig_DaAhSsnEell_2.jpg`, post: ig("DaAhSsnEell"), by: "@nettosillva.ns", alt: "Cabelo castanho com pontas em caramelo, visto de lado", legenda: "Caramel blond", uso: "Coloração, galeria 3/7" },
  { name: "col-4", group: "coloracao", file: `${RAW}/ig_De0KIqvBTZZ_1.jpg`, post: ig("De0KIqvBTZZ"), by: "@silvanakamer", alt: "Base marrom profunda com nuances de bege dourado e caramelo", legenda: "Caramelo iluminado", uso: "Coloração, galeria 4/7" },
  { name: "col-5", group: "coloracao", file: `${RAW}/ig_Dc1zdHwRQKn_1.jpg`, post: ig("Dc1zdHwRQKn", 1), by: "@thaina.pedroso", alt: "Loiro dourado longo e ondulado, em tom butter vanila", legenda: "Butter vanila", uso: "Coloração, galeria 5/7" },
  { name: "col-6", group: "coloracao", file: `${RAW}/ig_DakpzCcKI39_1.jpg`, post: ig("DakpzCcKI39", 1), by: "@nsconcepthair", alt: "Loiro manteiga, luminoso e longo, com jaqueta preta", legenda: "Loiro manteiga", uso: "Coloração, galeria 6/7" },
  { name: "col-7", group: "coloracao", file: `${RAW}/ig_DYaoEubuCV0_1.jpg`, post: ig("DYaoEubuCV0", 1), by: "@silvanakamer", alt: "Loiro claríssimo com luzes, em mulher tocando o cabelo", legenda: "Loiro claríssimo", uso: "Coloração, galeria 7/7" },

  // Corte e visagismo
  { name: "corte-1", group: "corte", file: `${RAW}/ig_DYF8fBjxrd2_1.jpg`, post: ig("DYF8fBjxrd2", 1), by: "@nettosillva.ns", alt: "Corte shaggy em cabelo castanho, com camadas leves", uso: "Corte e visagismo, imagem principal" },
  { name: "corte-2", group: "corte", file: `${RAW}/ig_DRNkN1wD2Fn_1.jpg`, post: ig("DRNkN1wD2Fn", 1), by: "@silvanakamer", alt: "Franja desfiada em cabelo castanho ondulado, mulher sorrindo", uso: "Corte e visagismo, galeria" },

  // Tratamentos
  { name: "trat-1", group: "tratamentos", file: `${RAW}/ig_DUZSrk2AbtR_1.jpg`, post: ig("DUZSrk2AbtR", 1), by: "@nettosillva.ns", alt: "Cabelo castanho escuro, longo, liso e brilhante", uso: "Tratamentos, imagem principal" },

  // Unhas
  { name: "unhas-1", group: "unhas", file: `${RAW}/ig_DTz4E5zDijH_1.jpg`, post: ig("DTz4E5zDijH"), by: "@gimarques.nails", alt: "Unhas amendoadas em rosa, com acabamento impecável", uso: "Unhas, imagem principal" },

  // O salão
  { name: "salao-equipe", group: "salao-equipe", file: `${RAW}/ig_DZiTLVex4Se_1.jpg`, post: ig("DZiTLVex4Se", 1), by: "@nsconcepthair", alt: "Equipe do NS Concept Hair reunida no salão", uso: "O Salão, foto principal" },
  { name: "salao-d1", group: "salao-detalhes", file: `${RAW}/ig_DVj0gicETsU_1.jpg`, post: ig("DVj0gicETsU", 1), by: "@nsconcepthair", alt: "Monograma NS entre flores e embalagens do salão", uso: "O Salão, detalhes 1/2" },
  { name: "salao-d2", group: "salao-detalhes", file: `${RAW}/ig_DVl_XekkQBG_1.jpg`, post: ig("DVl_XekkQBG", 1), by: "@nsconcepthair", alt: "Detalhe da fachada do salão, com folhagem e céu azul", uso: "O Salão, detalhes 2/2" },
  { name: "fachada", group: "fachada", file: `${RAW}/ig_DVFBN5gkUCh_1.jpg`, post: ig("DVFBN5gkUCh", 1), by: "@nsconcepthair", alt: "Fachada do prédio com o monograma NS, em Indaiatuba", crop: [0, 0, 1, 0.68], uso: "Contato, fachada" },

  // Antes e depois (pares reais)
  { name: "par-mari-antes", pair: "mari", side: "antes", file: `${BA}/DQcp_vykbOY_t9.jpg`, post: ig("DQcp_vykbOY", 1), by: "@nettosillva.ns", alt: "Mega Hair: antes", crop: [0, 0, 1, 0.703], uso: "Antes e depois, Mega Hair (quadro do reel)" },
  { name: "par-mari-depois", pair: "mari", side: "depois", file: `${BA}/DQcp_vykbOY_t45.jpg`, post: ig("DQcp_vykbOY", 1), by: "@nettosillva.ns", alt: "Mega Hair: depois", crop: [0, 0, 1, 0.703], uso: "Antes e depois, Mega Hair (quadro do reel)" },
  { name: "par-helen-antes", pair: "helen", side: "antes", file: `${BA}/DT3gfmiEelX_t7.jpg`, post: ig("DT3gfmiEelX", 1), by: "@nsconcepthair", alt: "Moreno iluminado: antes", crop: [0, 0.18, 1, 0.703], uso: "Antes e depois, Moreno iluminado (quadro do reel)" },
  { name: "par-helen-depois", pair: "helen", side: "depois", file: `${BA}/DT3gfmiEelX_t92.jpg`, post: ig("DT3gfmiEelX", 1), by: "@nsconcepthair", alt: "Moreno iluminado: depois", crop: [0, 0.18, 1, 0.703], uso: "Antes e depois, Moreno iluminado (quadro do reel)" },
  { name: "par-cor-antes", pair: "cor", side: "antes", file: `${RAW}/ig_DZGDsk_IHRU_1.jpg`, post: ig("DZGDsk_IHRU"), by: "@silvanakamer", alt: "Correção de cor: antes", crop: [0.086, 0, 0.828, 1], uso: "Antes e depois, Correção de cor (carrossel)" },
  { name: "par-cor-depois", pair: "cor", side: "depois", file: `${RAW}/ig_DZGDsk_IHRU_2.jpg`, post: ig("DZGDsk_IHRU"), by: "@silvanakamer", alt: "Correção de cor: depois", crop: [0.086, 0, 0.828, 1], uso: "Antes e depois, Correção de cor (carrossel)" },
  { name: "par-ilum-antes", pair: "ilum", side: "antes", file: `${BA}/DQ-Ki_0EYCL_t2.jpg`, post: ig("DQ-Ki_0EYCL", 1), by: "@nettosillva.ns", alt: "Iluminado: antes", crop: [0, 0.07, 1, 0.703], uso: "Antes e depois, Iluminado (quadro do reel)" },
  { name: "par-ilum-depois", pair: "ilum", side: "depois", file: `${BA}/DQ-Ki_0EYCL_t5.jpg`, post: ig("DQ-Ki_0EYCL", 1), by: "@nettosillva.ns", alt: "Iluminado: depois", crop: [0, 0.07, 1, 0.703], uso: "Antes e depois, Iluminado (quadro do reel)" },
];

const PAIRS = [
  { id: "mari", servico: "Mega Hair", categoria: "mega-hair" },
  { id: "helen", servico: "Moreno iluminado", categoria: "coloracao" },
  { id: "cor", servico: "Correção de cor", categoria: "coloracao" },
  { id: "ilum", servico: "Iluminado", categoria: "coloracao" },
];

// Tratamento de cor único: levemente quente, pretos profundos, saturate(0.95), contraste +5%
const treat = (img) =>
  img
    .linear([1.05 * 1.02, 1.05, 1.05 * 0.97], [-9, -9, -9])
    .modulate({ saturation: 0.95 });

const results = [];
for (const s of SPEC) {
  if (!existsSync(s.file)) throw new Error(`Falta ${s.file}`);
  let base = sharp(s.file).rotate();
  const meta = await base.metadata();
  const W = meta.width, H = meta.height;
  if (s.crop) {
    const [l, t, w, h] = s.crop;
    base = sharp(await base.extract({ left: Math.round(l * W), top: Math.round(t * H), width: Math.round(w * W), height: Math.round(h * H) }).toBuffer());
  }
  const buf = await treat(base).toBuffer();
  const m2 = await sharp(buf).metadata();
  const long = Math.max(m2.width, m2.height);
  const big = sharp(buf).resize({ width: m2.width >= m2.height ? Math.min(2000, m2.width) : undefined, height: m2.height > m2.width ? Math.min(2000, m2.height) : undefined, withoutEnlargement: true });
  const bigBuf = await big.webp({ quality: 82 }).toBuffer();
  const bm = await sharp(bigBuf).metadata();
  writeFileSync(`${OUT}/${s.name}.webp`, bigBuf);
  await sharp(buf).resize({ width: Math.min(800, m2.width), withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/${s.name}-800.webp`);
  const lq = await sharp(buf).resize({ width: 16 }).blur(0.5).webp({ quality: 40 }).toBuffer();
  results.push({ ...s, w: bm.width, h: bm.height, lqip: `data:image/webp;base64,${lq.toString("base64")}`, long });
}

// src/content/photos.generated.ts
const groups = {};
for (const r of results.filter((x) => !x.pair)) {
  (groups[r.group] ||= []).push({
    src: `/photos/${r.name}.webp`,
    src800: `/photos/${r.name}-800.webp`,
    alt: r.alt,
    fonte: r.post,
    lqip: r.lqip,
    w: r.w,
    h: r.h,
    ...(r.legenda ? { legenda: r.legenda } : {}),
  });
}
writeFileSync(
  "src/content/photos.generated.ts",
  `// Gerado por scripts/process-photos.mjs. Não editar à mão.\n// TODO confirmar uso com o salão e com as clientes que aparecem nas fotos.\nimport type { Photo } from "./photos";\n\nexport const GENERATED: Record<string, Photo[]> = ${JSON.stringify(groups, null, 2)};\n`,
);

const pairs = PAIRS.map((p) => {
  const a = results.find((r) => r.pair === p.id && r.side === "antes");
  const d = results.find((r) => r.pair === p.id && r.side === "depois");
  return { ...p, antes: `/photos/${a.name}-800.webp`, depois: `/photos/${d.name}-800.webp`, post: a.post };
});
writeFileSync(
  "src/content/pairs.generated.ts",
  `// Gerado por scripts/process-photos.mjs. Só pares reais publicados pelo salão.\nimport type { ResultPair } from "./results";\n\nexport const GENERATED_PAIRS: ResultPair[] = ${JSON.stringify(pairs, null, 2)};\n`,
);

// docs/fotos-usadas.md
const rows = results
  .map((r) => `| ${r.uso} | \`${r.name}.webp\` | ${r.w}×${r.h} | ${r.post} | ${r.by} |`)
  .join("\n");
writeFileSync(
  "docs/fotos-usadas.md",
  `# Fotos usadas

Fotos de clientes retiradas do Instagram do salão. Confirmar autorização antes da publicação oficial e pedir os originais em alta.
Tratamento único aplicado a todas (levemente quente, pretos profundos, saturação 0,95, contraste +5%). Recortes feitos para tirar
marcas de outros perfis, logos de produto e legendas. Antes e depois são quadros dos reels, sempre do mesmo enquadramento.

| Uso | Arquivo | Tamanho | Fonte | Crédito |
|---|---|---|---|---|
${rows}

## Avisos
- Nenhuma foto repete entre páginas.
- DWfRfE1keja (Netto e outra pessoa sentados): não usada; confirmar quem é a segunda pessoa.
- Posts 53 e 77 (Netto e Felipe): não usados. Pergunta para o salão: o Felipe faz parte da equipe?
- Fachada: o letreiro ainda mostra o nome antigo, "Netto Sillva Concept Hair". Confirmar se é a fachada atual.
`,
);
console.log(`${results.length} imagens processadas`);
