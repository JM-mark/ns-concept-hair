// Processa as fotos aprovadas: recorte, tratamento de cor único, WebP 2000px + 800px, LQIP.
// Entrada: scripts/_work/raw (posts do Instagram do salão). Saída: public/photos + src/content/photos.generated.ts + docs/fotos-usadas.md
// Regra do cliente: nenhuma foto de profissional do salão. Nenhuma foto repete entre seções/páginas.
// Uso: node scripts/process-photos.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";

const RAW = "scripts/_work/raw";
const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) unlinkSync(`${OUT}/${f}`); // começa limpo: só entra o que está no SPEC

const ig = (code, reel) => `https://www.instagram.com/${reel ? "reel" : "p"}/${code}/`;
const raw = (code, n = 1) => `${RAW}/ig_${code}_${n}.jpg`;

// crop = [left, top, width, height] em fração da imagem original
const SPEC = [
  // ---- Home ----
  // Selo do hero (miniaturas redondas)
  { name: "selo-1", group: "selo", file: raw("DfDfZFJJW1L"), post: ig("DfDfZFJJW1L", 1), by: "@silvanakamer", alt: "Cabelo castanho com luzes caramelo", uso: "Home, selo do hero" },
  { name: "selo-2", group: "selo", file: raw("DYDN0cMOMZg"), post: ig("DYDN0cMOMZg", 1), by: "@silvanakamer", alt: "Cabelo loiro com luzes suaves", uso: "Home, selo do hero" },
  { name: "selo-3", group: "selo", file: raw("DYcNh22MRnz"), post: ig("DYcNh22MRnz", 1), by: "@silvanakamer", alt: "Cabelo loiro bege, longo e ondulado", uso: "Home, selo do hero" },
  // Por que a NS (cápsulas)
  { name: "why-1", group: "why", file: raw("DPuSkQGEabO"), post: ig("DPuSkQGEabO", 1), by: "@nettosillva.ns", alt: "Cabelo castanho longo e ondulado, com blazer branco", crop: [0.42, 0, 0.58, 0.78], uso: "Home, Por que a NS (cápsula 1)" },
  { name: "why-2", group: "why", file: raw("DehZWEFtTXx"), post: ig("DehZWEFtTXx", 1), by: "@silvanakamer", alt: "Loiro bege em corte médio, com ondas suaves", uso: "Home, Por que a NS (cápsula 2)" },
  { name: "why-3", group: "why", file: raw("DUjOEewEa3M"), post: ig("DUjOEewEa3M", 1), by: "@nsconcepthair", alt: "Fachada do prédio com o monograma NS", crop: [0, 0, 1, 0.66], uso: "Home, Por que a NS (cápsula 3)" },
  // Jornada do Mega Hair: recortes só de cabelo, sem rosto
  { name: "jornada-1", group: "jornada", file: raw("DavzpAbKwko"), post: ig("DavzpAbKwko", 1), by: "@nsconcepthair", alt: "Cachos longos com pontas acobreadas", crop: [0, 0.42, 1, 0.58], uso: "Jornada, etapa 1" },
  { name: "jornada-2", group: "jornada", file: raw("DfFGfBgITTj"), post: ig("DfFGfBgITTj", 1), by: "@erikabombonatti", alt: "Ondas longas em castanho com pontas claras", crop: [0, 0.48, 1, 0.52], uso: "Jornada, etapa 2" },
  { name: "jornada-3", group: "jornada", file: raw("DeANqknPlAo"), post: ig("DeANqknPlAo", 1), by: "@silvanakamer", alt: "Cabelo castanho longo com pontas caramelo", crop: [0, 0.5, 1, 0.5], uso: "Jornada, etapa 3" },
  { name: "jornada-4", group: "jornada", file: raw("DeP1AqSP8qT"), post: ig("DeP1AqSP8qT", 1), by: "@silvanakamer", alt: "Loiro longo com ondas largas", crop: [0, 0.55, 1, 0.45], uso: "Jornada, etapa 4" },
  // Grade de serviços da Home (uma foto por serviço; Unhas e Sobrancelhas ficam em painel)
  { name: "grade-mega-hair", group: "home-mega-hair", file: raw("DQcp_vykbOY"), post: ig("DQcp_vykbOY", 1), by: "@nettosillva.ns", alt: "Cabelo loiro com luzes, longo e volumoso, em blusa amarela", crop: [0, 0, 1, 0.66], uso: "Home, grade de serviços (Mega Hair)" },
  { name: "grade-coloracao", group: "home-coloracao", file: raw("DdeTlcbRVzt"), post: ig("DdeTlcbRVzt", 1), by: "@nettosillva.ns", alt: "Loiro dourado, longo e luminoso, de perfil", uso: "Home, grade de serviços (Coloração)" },
  { name: "grade-corte", group: "home-corte", file: raw("DXSiZskD3Su"), post: ig("DXSiZskD3Su", 1), by: "@silvanakamer", alt: "Mulher de cabelo castanho ondulado, com corte em camadas, sorrindo", uso: "Home, grade de serviços (Corte e visagismo)" },
  { name: "grade-tratamentos", group: "home-tratamentos", file: raw("DedJkT4BtWs"), post: ig("DedJkT4BtWs", 1), by: "@mamoraesr", alt: "Cabelo preto, liso e brilhante, muito longo", crop: [0, 0, 1, 0.52], uso: "Home, grade de serviços (Tratamentos)" },
  // Bloco Mega Hair em destaque, FAQ e fundo do agendamento
  { name: "mh-feature", group: "mega-hair", file: raw("DUJu_4mkfzA"), post: ig("DUJu_4mkfzA", 1), by: "@nettosillva.ns", alt: "Mulher de cabelo castanho longo, volumoso e com pontas douradas, sorrindo", crop: [0, 0.17, 1, 0.83], uso: "Home, bloco Mega Hair em destaque" },
  { name: "faq", group: "faq", file: raw("Dcj5t-hEXoj"), post: ig("Dcj5t-hEXoj"), by: "@makebrunarosembaum", alt: "Retrato com cabelo castanho ondulado e maquiagem marcante", uso: "FAQ, cápsula" },
  { name: "agendar-bg", group: "agendar-bg", file: raw("DUJOzDuEboC"), post: ig("DUJOzDuEboC", 1), by: "@nsconcepthair", alt: "Fachada do salão com o monograma NS ao entardecer", crop: [0, 0.1, 1, 0.32], uso: "Agendamento, fundo em tela cheia" },

  // ---- Páginas dos serviços ----
  { name: "mh-1", group: "mega-hair", file: raw("DUZSrk2AbtR"), post: ig("DUZSrk2AbtR", 1), by: "@nettosillva.ns", alt: "Cabelo castanho escuro, longo e volumoso, com mega hair", uso: "Mega Hair, imagem principal" },
  { name: "col-1", group: "coloracao", file: raw("Daqot_1qhwS"), post: ig("Daqot_1qhwS", 1), by: "@nsconcepthair", alt: "Cabelo marrom iluminado, longo e brilhante", legenda: "Marrom iluminado", uso: "Coloração, galeria 1/7" },
  { name: "col-2", group: "coloracao", file: raw("DcepkS6R63g"), post: ig("DcepkS6R63g", 1), by: "@nettosillva.ns", alt: "Cabelo na cor mocha latte, longo e ondulado", legenda: "Mocha latte", uso: "Coloração, galeria 2/7" },
  { name: "col-3", group: "coloracao", file: raw("DaAhSsnEell", 2), post: ig("DaAhSsnEell"), by: "@nettosillva.ns", alt: "Cabelo castanho com pontas em caramelo, visto de lado", legenda: "Caramel blond", uso: "Coloração, galeria 3/7" },
  { name: "col-4", group: "coloracao", file: raw("De0KIqvBTZZ"), post: ig("De0KIqvBTZZ"), by: "@silvanakamer", alt: "Base marrom profunda com nuances de bege dourado e caramelo", legenda: "Caramelo iluminado", uso: "Coloração, galeria 4/7" },
  { name: "col-5", group: "coloracao", file: raw("Dc1zdHwRQKn"), post: ig("Dc1zdHwRQKn", 1), by: "@thaina.pedroso", alt: "Loiro dourado longo e ondulado, em tom butter vanila", legenda: "Butter vanila", uso: "Coloração, galeria 5/7" },
  { name: "col-6", group: "coloracao", file: raw("DakpzCcKI39"), post: ig("DakpzCcKI39", 1), by: "@nsconcepthair", alt: "Loiro manteiga, luminoso e longo, com jaqueta preta", legenda: "Loiro manteiga", uso: "Coloração, galeria 6/7" },
  { name: "col-7", group: "coloracao", file: raw("DYaoEubuCV0"), post: ig("DYaoEubuCV0", 1), by: "@silvanakamer", alt: "Loiro claríssimo com luzes, em mulher tocando o cabelo", legenda: "Loiro claríssimo", uso: "Coloração, galeria 7/7" },
  { name: "corte-1", group: "corte", file: raw("DYF8fBjxrd2"), post: ig("DYF8fBjxrd2", 1), by: "@nettosillva.ns", alt: "Corte shaggy em cabelo castanho, com camadas leves", uso: "Corte e visagismo, imagem principal" },
  { name: "corte-2", group: "corte", file: raw("DRNkN1wD2Fn"), post: ig("DRNkN1wD2Fn", 1), by: "@silvanakamer", alt: "Franja desfiada em cabelo castanho ondulado, mulher sorrindo", uso: "Corte e visagismo, galeria" },
  { name: "trat-1", group: "tratamentos", file: raw("DZGDsk_IHRU", 2), post: ig("DZGDsk_IHRU"), by: "@silvanakamer", alt: "Cabelo castanho escuro, longo, macio e brilhante", crop: [0.086, 0, 0.828, 1], uso: "Tratamentos, imagem principal" },
  { name: "unhas-1", group: "unhas", file: raw("DTz4E5zDijH"), post: ig("DTz4E5zDijH"), by: "@gimarques.nails", alt: "Unhas amendoadas em rosa, com acabamento impecável", uso: "Unhas, imagem principal" },

  // ---- O salão e contato ----
  { name: "salao-d1", group: "salao-detalhes", file: raw("DVj0gicETsU"), post: ig("DVj0gicETsU", 1), by: "@nsconcepthair", alt: "Monograma NS entre flores e embalagens do salão", uso: "O Salão, detalhes 1/2" },
  { name: "salao-d2", group: "salao-detalhes", file: raw("DVl_XekkQBG"), post: ig("DVl_XekkQBG", 1), by: "@nsconcepthair", alt: "Detalhe da fachada do salão, com folhagem e céu azul", uso: "O Salão, detalhes 2/2" },
  { name: "fachada", group: "fachada", file: raw("DVFBN5gkUCh"), post: ig("DVFBN5gkUCh", 1), by: "@nsconcepthair", alt: "Fachada do prédio com o monograma NS, em Indaiatuba", crop: [0, 0, 1, 0.68], uso: "Contato, fachada" },
];

// Tratamento de cor único: levemente quente, pretos profundos, saturate(0.95), contraste +5%
const treat = (img) => img.linear([1.05 * 1.02, 1.05, 1.05 * 0.97], [-9, -9, -9]).modulate({ saturation: 0.95 });

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
  const bigBuf = await sharp(buf)
    .resize({ width: m2.width >= m2.height ? Math.min(2000, m2.width) : undefined, height: m2.height > m2.width ? Math.min(2000, m2.height) : undefined, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const bm = await sharp(bigBuf).metadata();
  writeFileSync(`${OUT}/${s.name}.webp`, bigBuf);
  await sharp(buf).resize({ width: Math.min(800, m2.width), withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/${s.name}-800.webp`);
  const lq = await sharp(buf).resize({ width: 16 }).blur(0.5).webp({ quality: 40 }).toBuffer();
  results.push({ ...s, w: bm.width, h: bm.height, lqip: `data:image/webp;base64,${lq.toString("base64")}` });
}

const groups = {};
for (const r of results) {
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

const rows = results.map((r) => `| ${r.uso} | \`${r.name}.webp\` | ${r.w}×${r.h} | ${r.post} | ${r.by} |`).join("\n");
writeFileSync(
  "docs/fotos-usadas.md",
  `# Fotos usadas

Fotos de clientes retiradas do Instagram do salão. Confirmar autorização antes da publicação oficial e pedir os originais em alta.
Tratamento único aplicado a todas (levemente quente, pretos profundos, saturação 0,95, contraste +5%).

Regras do cliente: **nenhuma foto de profissional do salão**; nenhuma foto repete entre seções ou páginas; Pexels/Pixabay só sem rosto
(nenhuma usada até agora). Recortes tiram marcas de outros perfis, logos de produto e legendas. Na jornada do Mega Hair as imagens são
recortes só de cabelo.

| Uso | Arquivo | Tamanho | Fonte | Crédito |
|---|---|---|---|---|
${rows}

## Avisos
- Posts 53, 77 e 89 (Netto e Felipe) e a foto da equipe não são usados.
- Fachada: o letreiro mostra o nome antigo, "Netto Sillva Concept Hair". Confirmar se é a fachada atual (aparece em /contato, no fundo do agendamento e numa cápsula da Home).
- Maps, aba "Do proprietário": só traz retratos de clientes; a aba "Interior" tem uma selfie de academia. Nada de lá foi usado.
- Vídeo do hero: Pexels, "Blonde Woman Showcasing Silky Long Hair" (Zenia Diamond), https://www.pexels.com/video/blonde-woman-showcasing-silky-long-hair-36707549/
`,
);
console.log(`${results.length} imagens processadas`);
