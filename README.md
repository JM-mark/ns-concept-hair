# NS Concept Hair — site (prévia)

Site multipágina do salão NS Concept Hair (Indaiatuba/SP). Next.js 16 (App Router), TypeScript, Tailwind v4,
GSAP + ScrollTrigger, Lenis e Framer Motion. Exportação estática.

Prévia: https://jm-mark.github.io/ns-concept-hair/

## Rodar
```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build      # Cloudflare Pages: sem basePath, pasta out/
```
GitHub Pages (basePath): `NEXT_PUBLIC_BASE_PATH=/ns-concept-hair npm run build` (o workflow já faz isso).
Todo caminho de `public/` passa por `asset()` (`src/lib/asset.ts`).

## Onde editar
Todo conteúdo fica em `src/content/` (`site`, `services`, `team`, `hours`, `reviews`, `photos`, `results`, `monogram`).
Design system em `DESIGN.md`; decisão de estilo em `docs/design-direction.md`.

## Agendamento (`/agendar`)
Stepper de 5 etapas que gera uma **solicitação** pelo WhatsApp (`wa.me`) e um `.ics` marcado como pendente. O estado
fica na URL (`?servico=id1,id2&etapa=N`). Webhook opcional: defina `NEXT_PUBLIC_BOOKING_WEBHOOK` e cada pedido também
faz um `POST` com o JSON (n8n, Google Sheets). Sem a variável, nada é enviado.

## Pendências e avisos (para o cliente)
- **Logo**: extraída de print (784px). Pedir ao salão o arquivo original (SVG/PDF/PNG em alta). O vetor N/S do hero
  (`scripts/vectorize-monogram.mjs` → `src/content/monogram.ts`) é gerado a partir do PNG e só serve para a animação;
  quando o salão mandar o SVG original, ele substitui o vetor gerado.
- **Horário**: segundo o post do salão e o Google, ter a sex 8h–19h, sáb 8h–18h, domingo fechado. O briefing dizia "seg a sex"; confirmar a segunda.
- **Fotos e vídeo**: ainda não incluídos. Lista proposta em `docs/fotos-propostas.md`. Fotos de clientes retiradas do
  Instagram/Google do salão. Confirmar autorização antes da publicação oficial e pedir os originais em alta.
- **Vídeo do hero**: se vier de reel do Instagram do salão, confirmar autorização e pedir o arquivo original. Se vier do
  Pexels/Coverr, registrar aqui o link e a licença.
- **Antes e depois**: só pares reais publicados pelo salão. O componente `BeforeAfter` está pronto; a seção não aparece
  enquanto não houver pares. Pedir ao salão fotos de antes e depois autorizadas pelas clientes.
- **Avaliações**: trechos do Google conferir texto exato e salvar o link de cada avaliação. Sem nota média nem contagem.
- Perguntar ao salão: função de cada profissional, técnicas de Mega Hair, preços (se quiserem mostrar), duração dos serviços.
