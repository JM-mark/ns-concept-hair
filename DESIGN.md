---
name: NS Concept Hair
family: S08 Editorial Luxo (escuro) com seções em areia; layout e motion inspirados na LuxySpa
colors:
  ink: "#0B0B0B"
  graphite: "#161514"
  espresso: "#1A140E"
  ivory: "#F3EEE6"
  sand: "#DCCFC0"
  champagne: "#CDB896"
  bronze: "#7A5F43"
  bronze-deep: "#5E4630"
  mute: "#8E877D"
  champagne-grad: "linear-gradient(120deg, #EFE3CF 0%, #C9AE88 45%, #8C7356 100%)"
typography:
  display: { family: "Archivo", stretch: "125%", weight: 300, transform: uppercase, hero: "clamp(34px, 6.3vw, 96px)", h2: "clamp(22px, 3.3vw, 50px)", h3: "clamp(16px, 1.7vw, 24px)", tracking: "-0.01em" }
  body: { family: "Archivo", stretch: "100%", weight: 400, size: "17px", leading: 1.6 }
  eyebrow: { family: "Archivo", weight: 400, size: "13px", transform: uppercase, tracking: "0.08em", uso: "só como número de seção (01 — Serviços)" }
  label: { family: "Archivo", weight: 400, size: "13px", transform: uppercase, tracking: "0.08em" }
  button: { family: "Archivo", weight: 400, size: "13px", transform: uppercase, tracking: "0.08em", height: "52px" }
shapes: { photo: "6px", button: "pílula", glass: "20px" }
motion: { assinaturas: ["intro: vídeo dentro do monograma", "o fio (um traço que se desenha no scroll)", "pentear (fotos grandes)", "brilho diagonal no hover"], titulos: "máscara linha a linha, 600ms, sem blur", ease: ["expo.inOut", "power3.out"] }
---

# NS Concept Hair — Design System

**Referência de layout e motion: LuxySpa (Framer), somente inspiração.** Nenhum código, texto, foto ou ilustração foi copiado.

## Overview
Luxo noturno editorial com seções em areia, o "irmão claro" do champagne. Ritmo da Home: hero escuro → areia (por que a NS) →
areia (jornada) → areia (avaliações) → escuro (serviços em grade) → areia (equipe) → agendamento (espresso/vidro) → areia (FAQ) → footer escuro.

## Colors
Tokens em `src/app/globals.css`. Só usar estes.
- `--ink`, `--graphite`, `--espresso`: fundos escuros. `--sand`: fundo claro principal. `--ivory`: texto sobre escuro e botão sólido.
- **Champagne só sobre fundo escuro.** Sobre areia ele dá 1,26:1 e nunca vai em texto, ícone ou linha fina.
- Sobre areia: `--bronze-deep` (#5E4630) para rótulos, textos pequenos, ícones e linhas; `--bronze` (#7A5F43) só em títulos >= 32px.

Pares de contraste (conferidos com `node scripts/contrast.mjs`):

| Par | Razão | Uso |
|---|---|---|
| bronze-deep sobre sand | 5,73:1 | rótulos, textos, ícones, linhas |
| bronze sobre sand | 3,87:1 | só títulos >= 32px (AA para texto grande) |
| champagne sobre sand | 1,26:1 | **não usar** |
| ink sobre sand | 12,87:1 | texto corrido |
| champagne sobre ink | 10,21:1 | rótulos, linhas, ícones |
| ivory sobre ink | 17,04:1 | texto |
| mute sobre ink | 5,54:1 | texto secundário |
| champagne sobre espresso | 9,47:1 | rótulos no vidro |
| ivory sobre espresso | 15,81:1 | texto |
| ivory sobre vidro (espresso 70% sobre foto clara) | 7,30:1 | agendamento |
| ivory sobre bronze | 5,13:1 | setas redondas |
| ivory sobre bronze-deep | 7,59:1 | botão em areia |
| ink sobre champagne | 10,21:1 | botão primário |
| ivory sobre header de vidro (ink 75% sobre areia) | 9,50:1 | menu e links do header sobre seções areia |
| champagne sobre header de vidro (ink 75% sobre areia) | 5,69:1 | link "Agendar" e MENU |

## Typography
Uma família só: **Archivo**. Títulos em largura expandida (`font-stretch: 125%`), peso 300, caixa alta; texto em largura normal, peso 400 (2 pesos). Sem itálico colorido, sem rótulo com tracking largo. A logo é a única Didone do site: a tipografia contrasta com ela.

## Layout, Shapes e Components
Contêiner de 1440px. Fotos com cantos de 16px, botões em pílula (fundo preenche da esquerda para a direita), cards com moldura deslocada
de 8px em linha fina. Header com monograma centralizado e pílula MENU (vira pílula de vidro após 80px); menu em tela cheia sobre areia.
Agendamento em card de vidro (`.glass`: espresso 70%, blur 18px, borda branca 10%, cantos de 20px).

## Elevation & Depth
Sem sombras pesadas. Profundidade por camadas, grão de filme nas seções escuras e vidro no agendamento.

## Motion
GSAP + ScrollTrigger, Lenis, Framer Motion só no stepper. Easing `expo.out`/`power3.out`, 0,6 a 1,2s, sem bounce.
- Títulos: palavra por palavra (blur 10px → 0, y 24px); títulos de seção em areia "preenchem" no scroll (letras de 18% à cor cheia).
- Fotos: `clip-path` com cantos de 16px e escala 1,1 → 1, só após `img.decode()`.
- Jornada do Mega Hair: título sticky de CSS (sem pin do GSAP) e cards por cima com moldura em parallax de 6px; odômetro nos números 01–04.
- Avaliações em 3 colunas rolando em sentidos opostos (pausa no hover/foco); fios de cabelo em traço se desenham no scroll.
- `prefers-reduced-motion`: títulos prontos, sem blur, sem odômetro, sem colunas rolando, sem sticky, sem parallax, vídeo vira canvas estático.

## Do's and Don'ts
- Fazer: usar só os tokens; fotos reais do salão sem profissionais; fotos de Pexels/Pixabay só sem rosto.
- Não fazer: champagne em texto sobre areia, nota ou contagem de avaliações, antes e depois, preço, número inventado, foto de profissional do salão.

## Header (revisão 4)
Barra de largura total, 64px, `--ink` a 92% com hairline champagne depois do hero; Menu à esquerda, monograma centralizado, "Agendar" à direita (botão). Na Home, o vídeo do hero encolhe de volta para dentro do monograma e vira o logo do header.

## Fotos (revisão 4)
Retrato 3:4 (cards de serviço) e 4:5 (Mega Hair), cabeça inteira, `object-position` 50% 20%. Nunca cortar entre a testa e o queixo.
