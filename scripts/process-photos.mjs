// Processa as fotos aprovadas: recorte, tratamento de cor único, WebP 2000px + 800px, LQIP.
// Entrada: scripts/_work/raw (posts do Instagram do salão) e scripts/_work/hl (quadros do destaque "O salão").
// Saída: public/photos + src/content/photos.generated.ts + docs/fotos-usadas.md
// Regra do cliente: nenhuma foto de profissional do salão (nem mão, braço ou reflexo). Nenhuma foto repete entre lugares.
// Uso: node scripts/process-photos.mjs
import sharp from "sharp";
import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";

const RAW = "scripts/_work/raw";
const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) unlinkSync(`${OUT}/${f}`); // começa limpo: só entra o que está no SPEC

const ig = (code, reel) => `https://www.instagram.com/${reel ? "reel" : "p"}/${code}/`;
const raw = (code, n = 1) => `${RAW}/ig_${code}_${n}.jpg`;

// crop = [left, top, width, height] em fração da imagem original.
// conf = por que é cliente/resultado (marcação da cliente ou legenda de resultado). minW = largura mínima do recorte final.
const SPEC = [
  // ---- Home: selo, Por que a NS, jornada, grade, FAQ ----
  { name: "agendar-1", group: "home-agendar", file: raw("DTFx-KIEYco"), post: ig("DTFx-KIEYco", 1), by: "@nsconcepthair", alt: "Mulher de cabelo longo e ondulado, em loiro dourado, diante do monograma NS", box: [0, 0.02, 1], aspect: 4 / 5, minW: 900, conf: "A CONFIRMAR: post do salão sem marcação verificada; trocar se for da equipe", uso: "Home, agendamento" },
  { name: "mh-feature", group: "home-mega-feature", file: raw("DUZSrk2AbtR"), post: ig("DUZSrk2AbtR", 1), by: "@nettosillva.ns", alt: "Mulher de cabelo castanho escuro, longo e volumoso, com mega hair, de colete branco", box: [0, 0, 1], aspect: 4 / 5, minW: 900, conf: "cliente marcada (@erikabombonatti)", uso: "Home, Mega Hair em destaque" },
  { name: "trat-2", group: "tratamentos", file: raw("DeANqknPlAo"), post: ig("DeANqknPlAo", 1), by: "@silvanakamer", alt: "Cabelo castanho longo com pontas caramelo", crop: [0, 0.5, 1, 0.5], conf: "legenda: \"A Isabela…\" (cliente); recorte só de cabelo", uso: "Tratamentos, galeria" },
  { name: "trat-3", group: "tratamentos", file: raw("DeP1AqSP8qT"), post: ig("DeP1AqSP8qT", 1), by: "@silvanakamer", alt: "Loiro longo com ondas largas", crop: [0, 0.55, 1, 0.45], conf: "cliente marcada (@pam_dovalle); recorte só de cabelo", uso: "Tratamentos, galeria" },
  { name: "grade-mega-hair", group: "home-mega-hair", file: raw("DQcp_vykbOY"), post: ig("DQcp_vykbOY", 1), by: "@nettosillva.ns", alt: "Cabelo loiro com luzes, longo e volumoso, em blusa amarela", box: [0, 0.02, 1], aspect: 3 / 4, minW: 900, conf: "cliente marcada (@maricarixtodesouza)", uso: "Home, grade de serviços (Mega Hair)" },
  { name: "grade-coloracao", group: "home-coloracao", file: raw("DdeTlcbRVzt"), post: ig("DdeTlcbRVzt", 1), by: "@nettosillva.ns", alt: "Loiro dourado, longo e luminoso, de perfil", box: [0, 0.02, 1], aspect: 3 / 4, minW: 900, conf: "cliente marcada (@janaina.lopes.souza)", uso: "Home, grade de serviços (Coloração)" },
  { name: "grade-corte", group: "home-corte", file: raw("DXSiZskD3Su"), post: ig("DXSiZskD3Su", 1), by: "@silvanakamer", alt: "Cabelo castanho ondulado, com corte em camadas e bom caimento", box: [0, 0.04, 1], aspect: 3 / 4, minW: 900, conf: "cliente marcada (@leeticia_fee)", uso: "Home, grade de serviços (Corte e visagismo)" },
  { name: "grade-tratamentos", group: "home-tratamentos", file: raw("DVSHfNaDFZP"), post: ig("DVSHfNaDFZP", 1), by: "@silvanakamer", alt: "Cabelo castanho longo, liso e brilhante, com pontos de luz", box: [0.125, 0, 0.75], aspect: 3 / 4, minW: 900, conf: "cliente marcada (@gabrielasabinoo_)", uso: "Home, grade de serviços (Tratamentos)" },
  { name: "grade-unhas", group: "home-unhas", file: raw("DTz4E5zDijH"), post: ig("DTz4E5zDijH"), by: "@gimarques.nails", alt: "Unhas amendoadas em rosa, com acabamento impecável", box: [0.1, 0, 0.8], aspect: 3 / 4, conf: "mãos de cliente, sem rosto (post da manicure)", uso: "Home, grade de serviços (Unhas e sobrancelhas)" },

  // ---- /servicos: grade com fotos diferentes das da Home ----
  { name: "lista-mega-hair", group: "list-mega-hair", file: raw("DfDfZFJJW1L"), post: ig("DfDfZFJJW1L", 1), by: "@nsconcepthair", alt: "Cabelo castanho longo com ondas e reflexos caramelo", box: [0, 0.03, 1], aspect: 3 / 4, conf: "A CONFIRMAR: post do salão sem marcação verificada; trocar se for da equipe", uso: "/servicos, grade (Mega Hair)" },
  { name: "lista-coloracao", group: "list-coloracao", file: raw("Da9FxK-lISa"), post: ig("Da9FxK-lISa"), by: "@ericavieraa", alt: "Cabelo castanho com luzes douradas, em mulher de colete preto", box: [0, 0.02, 1], aspect: 3 / 4, conf: "post da própria cliente (transformação)", uso: "/servicos, grade (Coloração)" },
  { name: "lista-corte", group: "list-corte-e-visagismo", file: raw("DV_401jETMQ"), post: ig("DV_401jETMQ", 1), by: "@nettosillva.ns", alt: "Corte curto loiro, leve e elegante", box: [0, 0.02, 1], aspect: 3 / 4, conf: "cliente marcada (@fabianegoncalves.s)", uso: "/servicos, grade (Corte e visagismo)" },
  { name: "lista-tratamentos", group: "list-tratamentos", file: raw("DdcgpA9SApe"), post: ig("DdcgpA9SApe", 1), by: "@silvanakamer", alt: "Cabelo castanho liso, com camadas suaves e brilho", box: [0, 0.02, 1], aspect: 3 / 4, conf: "cliente marcada (@snanttes)", uso: "/servicos, grade (Tratamentos)" },
  { name: "lista-unhas", group: "list-unhas", file: raw("DbLJJbWuwGx"), post: ig("DbLJJbWuwGx"), by: "@gimarques.nails", alt: "Unhas curtas e clássicas, em tom nude", box: [0, 0.02, 1], aspect: 3 / 4, conf: "mãos de cliente, sem rosto", uso: "/servicos, grade (Unhas)" },

  // ---- Páginas dos serviços ----
  // Mega Hair: resultado + recortes só de cabelo (>= 900px de largura, sem nada do profissional)
  { name: "mh-1", group: "mega-hair", file: raw("DWWJJJhjgto"), post: ig("DWWJJJhjgto", 1), by: "@nettosillva.ns", alt: "Cabelo loiro longo, volumoso e com luzes, em blusa rosa", box: [0, 0, 1], aspect: 4 / 5, conf: "cliente marcada (@cacaucolucci)", uso: "Mega Hair, imagem principal" },
  { name: "mh-2", group: "mega-hair", file: raw("DW6lzlhkYic"), post: ig("DW6lzlhkYic", 1), by: "@nettosillva.ns", alt: "Pontas longas e onduladas de um loiro dourado, com mega hair", crop: [0.1, 0.58, 0.6, 0.3], minW: 900, conf: "resultado de Mega Hair; recorte só de cabelo, sem mãos nem braço", uso: "Mega Hair, galeria" },
  { name: "mh-3", group: "mega-hair", file: raw("DMJKFMHRBT-"), post: ig("DMJKFMHRBT-", 1), by: "@nsconcepthair", alt: "Ondas longas em loiro dourado, com mega hair", crop: [0, 0.6, 0.5, 0.3], minW: 900, conf: "resultado de Mega Hair; recorte só de cabelo, sem o profissional", uso: "Mega Hair, galeria" },
  // Coloração: do mais escuro ao mais claro
  { name: "col-1", group: "coloracao", file: raw("Daqot_1qhwS"), post: ig("Daqot_1qhwS", 1), by: "@nsconcepthair", alt: "Cabelo marrom iluminado, longo e brilhante", legenda: "Marrom iluminado", conf: "clientes marcadas (@ericavieraa)", uso: "Coloração, galeria 1/8" },
  { name: "col-2", group: "coloracao", file: raw("DcepkS6R63g"), post: ig("DcepkS6R63g", 1), by: "@nettosillva.ns", alt: "Cabelo na cor mocha latte, longo e ondulado", legenda: "Mocha latte", conf: "cliente marcada (@maaytetu)", uso: "Coloração, galeria 2/8" },
  { name: "col-3", group: "coloracao", file: raw("De0KIqvBTZZ"), post: ig("De0KIqvBTZZ"), by: "@silvanakamer", alt: "Base marrom profunda com nuances de bege dourado e caramelo", legenda: "Caramelo iluminado", conf: "legenda de resultado (iluminação multidimensional)", uso: "Coloração, galeria 3/8" },
  { name: "col-4", group: "coloracao", file: raw("DaAhSsnEell", 2), post: ig("DaAhSsnEell"), by: "@nettosillva.ns", alt: "Cabelo castanho com pontas em caramelo, visto de lado", legenda: "Caramel blond", conf: "cliente marcada (@julianapistoni)", uso: "Coloração, galeria 4/8" },
  { name: "col-5", group: "coloracao", file: raw("DRiIAyuEe_Z"), post: ig("DRiIAyuEe_Z", 1), by: "@nettosillva.ns", alt: "Iluminado chic em castanho dourado, longo e ondulado", legenda: "Iluminado chic", conf: "cliente marcada (@brunna_meelo)", uso: "Coloração, galeria 5/8" },
  { name: "col-6", group: "coloracao", file: raw("DSaJ4AWkQHW"), post: ig("DSaJ4AWkQHW", 1), by: "@nettosillva.ns", alt: "Iluminado sutil em castanho claro, longo e ondulado", legenda: "Iluminado sutil", conf: "cliente marcada (@francinymari)", uso: "Coloração, galeria 6/8" },
  { name: "col-7", group: "coloracao", file: raw("DW3tr4jDinr"), post: ig("DW3tr4jDinr", 1), by: "@nettosillva.ns", alt: "Loiro dourado, longo e luminoso, com ondas", legenda: "Loiro dourado", conf: "cliente marcada (@amanda.tuany)", uso: "Coloração, galeria 7/8" },
  { name: "col-8", group: "coloracao", file: raw("DakpzCcKI39"), post: ig("DakpzCcKI39", 1), by: "@nsconcepthair", alt: "Loiro manteiga, luminoso e longo, com jaqueta preta", legenda: "Loiro manteiga", conf: "cliente marcada (@nathaliacaminhas)", uso: "Coloração, galeria 8/8" },
  // Corte, tratamentos, unhas
  { name: "corte-1", group: "corte", file: raw("DRNkN1wD2Fn"), post: ig("DRNkN1wD2Fn", 1), by: "@silvanakamer", alt: "Franja desfiada em cabelo castanho ondulado, mulher sorrindo", conf: "cliente marcada (@brunafraggatta)", uso: "Corte e visagismo, imagem principal" },
  { name: "corte-2", group: "corte", file: raw("DVbVLlTEcjD"), post: ig("DVbVLlTEcjD", 1), by: "@nettosillva.ns", alt: "Loiro com profundidade e acabamento de precisão", conf: "legenda de resultado (\"Loiro com profundidade…\")", uso: "Corte e visagismo, galeria" },
  { name: "corte-3", group: "corte", file: raw("DRpeNqikf5g"), post: ig("DRpeNqikf5g", 1), by: "@silvanakamer", alt: "Loiro claro com movimento e brilho", conf: "legenda de resultado (\"Faço esse loiro a anos…\")", uso: "Corte e visagismo, galeria" },
  { name: "trat-1", group: "tratamentos", file: raw("DZGDsk_IHRU", 2), post: ig("DZGDsk_IHRU"), by: "@silvanakamer", alt: "Cabelo castanho escuro, longo, macio e brilhante", crop: [0.086, 0, 0.828, 1], conf: "cliente marcada (@robsferreira7)", uso: "Tratamentos, imagem principal" },
  { name: "unhas-1", group: "unhas", file: raw("DdwQBD0OoN6"), post: ig("DdwQBD0OoN6"), by: "@gimarques.nails", alt: "Esmaltação em gel rosa com brilho, em unhas curtas", conf: "mãos de cliente, sem rosto", uso: "Unhas, imagem principal" },
  { name: "unhas-2", group: "unhas", file: raw("DeKee2QMAzK"), post: ig("DeKee2QMAzK"), by: "@gimarques.nails", alt: "Unhas curtas com francesinha delicada", conf: "mãos de cliente, sem rosto", uso: "Unhas, galeria" },
  { name: "unhas-3", group: "unhas", file: raw("Ddrg3aaMC1U"), post: ig("Ddrg3aaMC1U"), by: "@gimarques.nails", crop: [0, 0.22, 1, 0.78], alt: "Unhas em tom vinho com efeito de brilho", conf: "mãos de cliente, sem rosto", uso: "Unhas, galeria" },

  // ---- O salão (espaço sem pessoas) e contato ----
  { name: "salao-1", group: "salao-detalhes", file: "scripts/_work/hl/hl_00a.jpg", post: "https://www.instagram.com/stories/highlights/17893660139886340/", by: "@nsconcepthair (destaque \"O salão\")", alt: "Recepção do salão, com poltronas cinza e quadro na parede", conf: "espaço sem pessoas", uso: "O Salão, galeria" },
  { name: "salao-2", group: "salao-detalhes", file: raw("DVj0gicETsU"), post: ig("DVj0gicETsU", 1), by: "@nsconcepthair", alt: "Monograma NS entre flores e embalagens do salão", conf: "espaço sem pessoas", uso: "O Salão, galeria" },
  { name: "salao-3", group: "salao-detalhes", file: raw("DVl_XekkQBG"), post: ig("DVl_XekkQBG", 1), by: "@nsconcepthair", alt: "Detalhe da fachada do salão, com folhagem e céu azul", conf: "espaço sem pessoas", uso: "O Salão, galeria" },
  { name: "salao-4", group: "salao-detalhes", file: raw("DcELlnZqEea"), post: ig("DcELlnZqEea", 1), by: "@nsconcepthair", alt: "Frascos do perfume capilar Hair Splash sobre uma bancada de madeira", crop: [0, 0.18, 1, 0.44], conf: "produto, sem pessoas", uso: "O Salão, galeria" },
  { name: "fachada", group: "fachada", file: raw("DVFBN5gkUCh"), post: ig("DVFBN5gkUCh", 1), by: "@nsconcepthair", alt: "Fachada do prédio com o monograma NS, em Indaiatuba (placa com o nome anterior do salão)", crop: [0, 0, 1, 0.68], conf: "fachada, sem pessoas", uso: "Contato, fachada" },
];

// Tratamento de cor único: levemente quente, pretos profundos, saturate(0.95), contraste +5%
const treat = (img) => img.linear([1.05 * 1.02, 1.05, 1.05 * 0.97], [-9, -9, -9]).modulate({ saturation: 0.95 });

const results = [];
for (const s of SPEC) {
  if (!existsSync(s.file)) throw new Error(`Falta ${s.file}`);
  let base = sharp(s.file).rotate();
  const meta = await base.metadata();
  const W = meta.width, H = meta.height;
  if (s.box) {
    const [l, tp, wf] = s.box;
    const cw = Math.round(wf * W), ch = Math.round(cw / s.aspect);
    const top = Math.min(Math.round(tp * H), Math.max(0, H - ch));
    base = sharp(await base.extract({ left: Math.round(l * W), top, width: cw, height: Math.min(ch, H - top) }).toBuffer());
  } else if (s.crop) {
    const [l, t, w, h] = s.crop;
    base = sharp(await base.extract({ left: Math.round(l * W), top: Math.round(t * H), width: Math.round(w * W), height: Math.round(h * H) }).toBuffer());
  }
  const buf = await treat(base).toBuffer();
  const m2 = await sharp(buf).metadata();
  if (s.minW && m2.width < s.minW) throw new Error(`${s.name}: recorte com ${m2.width}px (< ${s.minW})`);
  const bigBuf = await sharp(buf)
    .resize({ width: m2.width >= m2.height ? Math.min(2000, m2.width) : undefined, height: m2.height > m2.width ? Math.min(2000, m2.height) : undefined, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  const bm = await sharp(bigBuf).metadata();
  writeFileSync(`${OUT}/${s.name}.webp`, bigBuf);
  await sharp(buf).resize({ width: Math.min(800, m2.width), withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/${s.name}-800.webp`);
  const lq = await sharp(buf).resize({ width: 16 }).blur(0.5).webp({ quality: 40 }).toBuffer();
  results.push({ ...s, w: bm.width, h: bm.height, cw: m2.width, lqip: `data:image/webp;base64,${lq.toString("base64")}` });
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
for (const g of Object.keys(groups)) groups[g].sort((x, y) => x.src.localeCompare(y.src, undefined, { numeric: true }));
writeFileSync(
  "src/content/photos.generated.ts",
  `// Gerado por scripts/process-photos.mjs. Não editar à mão.\n// TODO confirmar uso com o salão e com as clientes que aparecem nas fotos.\nimport type { Photo } from "./photos";\n\nexport const GENERATED: Record<string, Photo[]> = ${JSON.stringify(groups, null, 2)};\n`,
);

// Lista de usos (para scripts/check-unique.mjs)
writeFileSync("scripts/_out/photo-uses.json", JSON.stringify(results.map((r) => ({ name: r.name, group: r.group, uso: r.uso, fonte: r.post })), null, 2));

const rows = results.map((r) => `| ${r.uso} | \`${r.name}.webp\` | ${r.cw}×… | ${r.post} | ${r.by} | ${r.conf} |`).join("\n");
writeFileSync(
  "docs/fotos-usadas.md",
  `# Fotos usadas

Fotos de clientes retiradas do Instagram do salão. Confirmar autorização antes da publicação oficial e pedir os originais em alta.
Tratamento único aplicado a todas (levemente quente, pretos profundos, saturação 0,95, contraste +5%).

Regras do cliente: **nenhuma foto de profissional do salão** (nem mão, braço ou reflexo no espelho); **selfie não entra**; nenhum arquivo aparece em mais de um lugar
(\`node scripts/check-unique.mjs\`). A coluna "Confirmado" diz por que a foto é de cliente/resultado: marcação da cliente no post ou legenda de resultado.

| Aparece em | Arquivo | Largura | Fonte | Crédito | Confirmado: cliente/resultado |
|---|---|---|---|---|---|
${rows}

## Avisos
- Posts com o Netto (DMJKFMHRBT-, DW6lzlhkYic, DbGNfTJROOD, DVrX9U4Ea7Q): só entram recortes de cabelo com pelo menos 900px de largura e nada do profissional. DbGNfTJROOD e DVrX9U4Ea7Q foram descartados (recorte limpo menor que 900px).
- Fachada: a placa mostra o nome anterior, "Netto Sillva Concept Hair". Só aparece em /contato, com legenda e \`// TODO pedir foto atual\`.
- Destaque "O salão": só o primeiro story (recepção) mostra o espaço sem pessoas; os outros dois têm a equipe e não foram usados.
- Maps, aba "Do proprietário": só traz retratos de clientes; a aba "Interior" tem uma selfie de academia. Nada de lá foi usado.
- Vídeo do hero: Pexels, "Blonde Woman Showcasing Silky Long Hair" (Zenia Diamond), https://www.pexels.com/video/blonde-woman-showcasing-silky-long-hair-36707549/
`,
);
console.log(`${results.length} imagens processadas`);
