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
Stepper de 4 etapas (serviço, data e horário, dados, resumo; sem escolha de profissional) que gera uma **solicitação** pelo WhatsApp (`wa.me`) e um `.ics` marcado como pendente. O estado
fica na URL (`?servico=id1,id2&etapa=N`). Webhook opcional: defina `NEXT_PUBLIC_BOOKING_WEBHOOK` e cada pedido também
faz um `POST` com o JSON (n8n, Google Sheets). Sem a variável, nada é enviado.

## Estilo
Layout e motion inspirados na LuxySpa (Framer), somente inspiração. Tokens e pares de contraste no `DESIGN.md`; avaliações coletadas em `docs/avaliacoes-coletadas.md`.

## Pendências e avisos (para o cliente)
- **Logo**: extraída de print (784px). Pedir ao salão o arquivo original (SVG/PDF/PNG em alta). O vetor N/S do hero
  (`scripts/vectorize-monogram.mjs` → `src/content/monogram.ts`) é gerado a partir do PNG e só serve para a animação;
  quando o salão mandar o SVG original, ele substitui o vetor gerado.
- **Horário**: segundo o post do salão e o Google, ter a sex 8h–19h, sáb 8h–18h, domingo fechado. O briefing dizia "seg a sex"; confirmar a segunda.
- **Fotos**: lista usada e fonte de cada uma em `docs/fotos-usadas.md` (geradas por `scripts/process-photos.mjs`). Fotos de clientes retiradas do
  Instagram do salão. Confirmar autorização antes da publicação oficial e pedir os originais em alta.
- **Vídeo do hero**: nenhum reel do salão serviu (todos têm rosto ou legenda). Usado o clipe do Pexels "Blonde Woman Showcasing Silky Long Hair" (Zenia Diamond), https://www.pexels.com/video/blonde-woman-showcasing-silky-long-hair-36707549/ , licença Pexels (uso comercial livre, sem atribuição obrigatória). Gerado por `scripts/make-hero-video.mjs` (loop sem emenda, tratamento de cor da marca). Vertical 9:16: painel à direita no desktop, tela cheia no celular. Fallback: canvas de fios (reduced-motion e economia de dados). Se o salão tiver vídeo próprio, trocar os arquivos de `public/video/`.
- **Antes e depois**: removido do site a pedido do cliente. Os resultados reais sem profissional ficam nas galerias de cada página de serviço.
- **Avaliações**: trechos do Google conferir texto exato e salvar o link de cada avaliação. Sem nota média nem contagem.
## O que pedir ao salão
- Foto **atual da fachada** (a placa das fotos mostra o nome anterior, "Netto Sillva Concept Hair").
- **Autorização das clientes** que aparecem nas fotos e os **arquivos originais em alta**.
- **Logo em vetor** (SVG/PDF) e **horário confirmado** (segunda-feira).
- **Etapas reais** do Mega Hair e técnicas que o salão realiza; função de cada profissional, preços (se quiserem mostrar) e duração dos serviços.

## Fotos: onde cada arquivo aparece
Regra do cliente: nenhuma foto de profissional, selfie não entra, nenhum arquivo em mais de um lugar. `node scripts/process-photos.mjs` gera as imagens e `node scripts/check-unique.mjs` confere a unicidade. A tabela completa (lugar, fonte e confirmação de cliente/resultado) está em `docs/fotos-usadas.md`.
