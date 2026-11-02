// Razão de contraste WCAG entre pares de cores. Uso: node scripts/contrast.mjs
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const blend = (fg, bg, a) => "#" + [1, 3, 5].map((i) => Math.round(parseInt(fg.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a)).toString(16).padStart(2, "0")).join("");
const PAIRS = [
  ["bronze-deep sobre sand (rótulos, textos pequenos, ícones)", "#5E4630", "#DCCFC0"],
  ["bronze sobre sand (só títulos >= 32px)", "#7A5F43", "#DCCFC0"],
  ["champagne sobre sand (NÃO usar)", "#CDB896", "#DCCFC0"],
  ["ink sobre sand", "#0B0B0B", "#DCCFC0"],
  ["champagne sobre ink", "#CDB896", "#0B0B0B"],
  ["ivory sobre ink", "#F3EEE6", "#0B0B0B"],
  ["mute sobre ink", "#8E877D", "#0B0B0B"],
  ["champagne sobre espresso", "#CDB896", "#1A140E"],
  ["ivory sobre espresso", "#F3EEE6", "#1A140E"],
  ["ink sobre champagne (botão)", "#0B0B0B", "#CDB896"],
  ["ivory sobre bronze (seta redonda)", "#F3EEE6", "#7A5F43"],
  ["ivory sobre bronze-deep", "#F3EEE6", "#5E4630"],
  ["ivory sobre vidro (espresso 70% sobre foto clara)", "#F3EEE6", blend("#1A140E", "#DCCFC0", 0.7)],
  ["ivory sobre header de vidro (ink 75% sobre sand)", "#F3EEE6", blend("#0B0B0B", "#DCCFC0", 0.75)],
  ["champagne sobre header de vidro (ink 75% sobre sand)", "#CDB896", blend("#0B0B0B", "#DCCFC0", 0.75)],
  ["bronze-deep sobre ivory", "#5E4630", "#F3EEE6"],
];
for (const [n, a, b] of PAIRS) console.log(`${ratio(a, b).toFixed(2).padStart(6)}:1  ${n}  (${a} / ${b})`);
