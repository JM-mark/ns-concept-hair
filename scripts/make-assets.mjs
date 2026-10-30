// Gera favicons e og.jpg a partir dos PNGs oficiais da logo (extraídos de print).
import sharp from "sharp";
import { mkdirSync } from "node:fs";

mkdirSync("public", { recursive: true });
const icon = "public/brand/icon-512.png";

await sharp(icon).resize(32, 32).png().toFile("src/app/icon.png");
await sharp(icon).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(icon).resize(192, 192).png().toFile("public/icon-192.png");

// og.jpg 1200x630: logo completa champagne sobre preto (trocar por logo + foto real quando as fotos forem aprovadas)
const logo = await sharp("public/brand/ns-logo-completo-champagne.png").resize({ height: 430 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#0b0b0b" } })
  .composite([{ input: logo, gravity: "center" }])
  .jpeg({ quality: 88 })
  .toFile("public/og.jpg");
console.log("assets ok");
