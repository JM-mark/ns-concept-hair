import sharp from "sharp";
import { readdirSync } from "node:fs";
const dir = process.argv[2], out = process.argv[3], cols = +process.argv[4] || 8, tw = +process.argv[5] || 240, th = +process.argv[6] || 320;
const files = readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f) && !/-800\.webp$/.test(f)).sort();
const cells = [];
for (const [i, f] of files.entries()) {
  const label = f.replace(/^ig_/, "").replace(/\.\w+$/, "");
  const img = await sharp(`${dir}/${f}`).resize(tw, th, { fit: "cover", position: "attention" }).jpeg({ quality: 80 }).toBuffer();
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tw}" height="22"><rect width="100%" height="100%" fill="#000"/><text x="4" y="16" font-family="Arial" font-size="12" fill="#fff">${i} ${label}</text></svg>`);
  cells.push({ input: await sharp({ create: { width: tw, height: th + 22, channels: 3, background: "#000" } }).composite([{ input: img, top: 0, left: 0 }, { input: svg, top: th, left: 0 }]).jpeg().toBuffer(), i });
}
const rows = Math.ceil(cells.length / cols);
await sharp({ create: { width: cols * (tw + 4), height: rows * (th + 26), channels: 3, background: "#222" } })
  .composite(cells.map((c) => ({ input: c.input, left: (c.i % cols) * (tw + 4), top: Math.floor(c.i / cols) * (th + 26) })))
  .jpeg({ quality: 82 }).toFile(out);
console.log(files.length, "arquivos");
