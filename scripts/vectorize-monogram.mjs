// Vetoriza o monograma (PNG extraído de print) em dois grupos, N e S, só para a animação do hero.
// Quando o salão enviar o SVG original, ele substitui src/content/monogram.ts.
import sharp from "sharp";
import potrace from "potrace";
import { writeFileSync, mkdirSync } from "node:fs";

const SRC = "public/brand/ns-monograma-champagne.png";
const SCALE = 2;
const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const alpha = Buffer.alloc(W * H);
for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4 + 3] > 110 ? 255 : 0;

const svgMask = (polys, rects) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="black"/>` +
      polys.map((p) => `<polygon fill="white" points="${p.map((q) => q.join(",")).join(" ")}"/>`).join("") +
      rects.map(([x0, y0, x1, y1]) => `<rect fill="white" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}"/>`).join("") +
      `</svg>`,
  );
const raw = async (b) => (await sharp(b).greyscale().raw().toBuffer());

// Geometria do N (coordenadas do PNG 784x826)
const diag = [[88, 38], [214, 38], [356, 252], [527, 512], [527, 692], [495, 692], [88, 70]];
const leftStem = [45, 38, 142, 692];
const topSerifR = [465, 38, 572, 74];
const stemTop = [503, 74, 533, 380];
const stemTopCross = [503, 74, 533, 150]; // inclui o cruzamento com o arco do S (fica nos dois)
const stemBot = [503, 503, 533, 692];

const nFull = await raw(await sharp(svgMask([diag], [leftStem, topSerifR, stemTop, stemBot])).png().toBuffer());
// o que sai do S: N sem o cruzamento do arco
const nBig = await raw(await sharp(svgMask([diag], [leftStem])).png().toBuffer());
const nThin = await raw(
  await sharp(svgMask([], [topSerifR, [503, 150, 533, 380], stemBot])).png().toBuffer(),
);
// encolhe a máscara de exclusão ~4px para sobrepor N e S (sem emenda visível)
const blurred = await sharp(nBig, { raw: { width: W, height: H, channels: 1 } }).blur(9).extractChannel(0).raw().toBuffer();
const nExclShrunk = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) nExclShrunk[i] = blurred[i] > 228 || nThin[i] > 127 ? 255 : 0;

const nBmp = Buffer.alloc(W * H, 255), sBmp = Buffer.alloc(W * H, 255);
for (let i = 0; i < W * H; i++) {
  if (alpha[i] && nFull[i] > 127) nBmp[i] = 0;
  if (alpha[i] && nExclShrunk[i] < 128) sBmp[i] = 0;
}

await sharp(sBmp,{raw:{width:W,height:H,channels:1}}).png().toFile("scripts/_out/s-bmp.png");
await sharp(nExclShrunk,{raw:{width:W,height:H,channels:1}}).png().toFile("scripts/_out/n-excl.png");
async function trace(bmp) {
  const png = await sharp(bmp, { raw: { width: W, height: H, channels: 1 } })
    .resize(W * SCALE, H * SCALE, { kernel: "lanczos3" })
    .blur(1.4).png().toBuffer();
  const bin = await sharp(png).threshold(128).png().toBuffer();
  return new Promise((res, rej) => {
    const p = new potrace.Potrace({ turdSize: 60, optCurve: true, optTolerance: 0.35, alphaMax: 1.0, threshold: 128 });
    p.loadImage(bin, (err) => {
      if (err) return rej(err);
      const m = p.getSVG().match(/ d="([^"]+)"/);
      res(m[1]);
    });
  });
}

const n = await trace(nBmp);
const s = await trace(sBmp);
const vb = `0 0 ${W * SCALE} ${H * SCALE}`;
writeFileSync(
  "src/content/monogram.ts",
  `// Gerado por scripts/vectorize-monogram.mjs a partir do PNG extraído de print.\n// Só para a animação do hero. Substituir quando o salão enviar o SVG original.\nexport const MONOGRAM = {\n  viewBox: "${vb}",\n  width: ${W * SCALE},\n  height: ${H * SCALE},\n  n: ${JSON.stringify(n)},\n  s: ${JSON.stringify(s)},\n} as const;\n`,
);

// Comparação lado a lado: PNG original | vetor (N e S em cores distintas) | vetor champagne
mkdirSync("scripts/_out", { recursive: true });
const mk = (fillN, fillS) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#0b0b0b"/><path fill-rule="evenodd" fill="${fillS}" d="${s}"/><path fill-rule="evenodd" fill="${fillN}" d="${n}"/></svg>`,
  );
const orig = await sharp({ create: { width: W, height: H, channels: 4, background: "#0b0b0b" } })
  .composite([{ input: SRC }]).png().toBuffer();
const v1 = await sharp(mk("#d9c49e", "#d9c49e")).png().toBuffer();
const v2 = await sharp(mk("#e0a15a", "#6fb6d9")).png().toBuffer();
await sharp({ create: { width: W * 3 + 40, height: H, channels: 4, background: "#222" } })
  .composite([{ input: orig, left: 0, top: 0 }, { input: v1, left: W + 20, top: 0 }, { input: v2, left: W * 2 + 40, top: 0 }])
  .png().toFile("scripts/_out/monogram-compare.png");
console.log("ok", n.length, s.length);
