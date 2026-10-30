---
name: NS Concept Hair
family: S08 Editorial Luxo (versão escura, seções marfim)
colors:
  ink: "#0B0B0B"
  graphite: "#161514"
  ivory: "#F3EEE6"
  sand: "#E7DDCF"
  champagne: "#CDB896"
  champagne-deep: "#8C7356"
  mute: "#8E877D"
  mute-dark: "#62594D"
  champagne-grad: "linear-gradient(120deg, #EFE3CF 0%, #C9AE88 45%, #8C7356 100%)"
typography:
  display: { family: "Bodoni Moda", weights: [400, 500], axes: { opsz: "variável" }, italic: true, sizes: "56px a 140px", tracking: "-0.02em", leading: 1.02 }
  body: { family: "Jost", weights: [300, 400, 500], size: "17px", leading: 1.6 }
  label: { family: "Jost", weight: 500, size: "12-13px", transform: uppercase, tracking: "0.28em" }
shapes: { radius: "0-2px", border: "1px hairline champagne a 30%", arcs: false }
motion: { ease: ["expo.out", "power3.out"], duration: "0.6-1.2s", bounce: false, rotation: false }
---

# NS Concept Hair — Design System

## Overview
Luxo noturno editorial. A logo é um monograma Didone champagne sobre preto e o feed do salão é preto, com cabelos
longos, lisos e brilhantes. O site se comporta como marca de alta beleza (referência de clima: Dior Beauty,
Kérastase), não como salão de bairro. Fundo escuro predominante, com seções marfim para respirar.
Ritmo: escuro (hero) → escuro → **marfim** → escuro → marfim → escuro (footer).

## Colors
Tokens em `src/app/globals.css`. Só usar estes.
- `--ink` fundo principal; `--graphite` cards e seções escuras alternadas; `--ivory` e `--sand` seções claras.
- `--champagne` detalhes, linhas e ícones; `--champagne-grad` só em títulos grandes, botões primários e brilho metálico, nunca em texto corrido.
- `--mute` texto secundário em fundo escuro; **em marfim usar `--mute-dark`** (o `--mute` não passa AA em marfim).
- Contraste AA verificado para texto corrido: ivory sobre ink, champagne sobre ink, ink sobre ivory, mute-dark sobre ivory.

## Typography
Display Bodoni Moda (itálico para a palavra de destaque, com gradiente champagne). Texto e interface em Jost.
Rótulos, menu e botões em Jost 500, 12–13px, caixa alta, tracking 0.28em (o espírito do "CONCEPT HAIR" da logo).
Carregadas com `next/font/google`, `display: swap`.

## Layout
Contêiner 1440px, gutter 20px (mobile) e 40px (desktop). Hairlines de 1px. A **diagonal do N** é o motivo gráfico:
divisores diagonais sutis, máscaras de revelação na diagonal, ângulo do brilho metálico e da cortina de transição.

## Elevation & Depth
Sem sombras pesadas. Profundidade por camadas de cor (ink/graphite), grão de filme muito leve nas seções escuras
(`.grain`) e véu em degradê sobre vídeo/foto.

## Shapes
Cantos retos (0px) ou 2px. Nada de cantos muito arredondados nem arcos. Exceção funcional: o puxador circular do
antes e depois e o ponto do cursor.

## Components
Botão primário (gradiente champagne) e fantasma (borda champagne), ambos com texto que troca por cópia que sobe e
magnetismo de até 6px. Header transparente sobre o hero, `--ink` com blur de 12px depois de 80px de scroll.
Cards sem sombra, borda hairline. Painel tipográfico (número grande + nome) quando falta foto real; nunca foto de banco.

## Motion
GSAP + ScrollTrigger, Lenis (lerp 0,1), Framer Motion só em transição de página e do stepper. Easing `expo.out` /
`power3.out`, durações de 0,6 a 1,2s, sem bounce e sem rotação.
- Intro do hero (~2,4s, uma vez por sessão): N e S entram de lados opostos e se encaixam, brilho metálico na diagonal, "CONCEPT HAIR" letra por letra.
- Rolagem: o monograma encolhe até virar o logo do header; vídeo dá zoom 1→1,1 e escurece.
- Títulos sobem por linha com máscara (stagger 90ms). Manifesto acende palavra por palavra.
- Vitrine de serviços fixa (pin) com máscara diagonal; só um título por vez.
- Cortina de transição diagonal ≤700ms. Cursor personalizado só em desktop, via rAF e translate3d.
- `prefers-reduced-motion`: sem intro, sem Lenis, sem pins, sem parallax, sem cursor; vídeo vira poster.

## Do's and Don'ts
- Fazer: usar apenas tokens deste arquivo; fotos reais do salão; um tratamento de cor único nas fotos.
- Fazer: manter o cursor do sistema dentro do agendamento e dos campos.
- Não fazer: gradiente roxo, Inter, emojis como ícones, sombras pesadas, cantos arredondados, arcos.
- Não fazer: nota média, contagem de avaliações, antes e depois gerado ou de banco, preços ou números inventados.
