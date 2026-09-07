# Cashflow — Landing Page

Landing page do Cashflow. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Lenis.
Toda a UI de produto é reproduzida em código (sem imagens/vídeos).

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha os links de checkout e o Pixel
npm run dev
```

## Deploy na Vercel

1. Suba a pasta para um repositório Git (GitHub/GitLab).
2. Na Vercel: **Add New → Project**, importe o repositório. Framework detectado: Next.js.
3. Em **Environment Variables**, adicione as variáveis do `.env.example`.
4. Deploy. Cada push na branch principal gera um novo deploy.

## Estrutura

- `src/app/` — layout (fontes, metadata, Pixel) e página.
- `src/components/sections/` — uma seção da landing por arquivo, na ordem da página.
- `src/components/mock/` — UI do produto reproduzida em código (dashboard, gráficos, tabelas).
- `src/components/ui/` — primitivas (botão, reveal, tipografia, smooth scroll, Pixel).
- `src/lib/data.ts` — copy dos planos, integrações e FAQ.
- `src/fonts/` — Manrope e Geist Mono self-hosted.
- `public/brand/` — logos do Cashflow.
- `public/integrations/` — SVGs oficiais dos checkouts (ver README lá dentro).

## Barra de estatísticas ao vivo

A faixa fixa abaixo do menu consome `NEXT_PUBLIC_STATS_URL` (por padrão a function pública do Supabase)
a cada 5 segundos e anima os números a cada atualização. O polling pausa quando a aba está em segundo
plano e, se a requisição falhar (rede fora ou CORS bloqueado), a barra simplesmente não aparece —
a página continua normal. A function precisa responder com `Access-Control-Allow-Origin` liberado
para o domínio da landing.

## Fundo animado da hero

`src/components/ui/velaris.tsx` é um shader WebGL (simplex noise + vinheta + grain) usado como fundo
da primeira seção, na paleta vermelha escura. Ele pausa quando sai da viewport, renderiza um único
quadro em `prefers-reduced-motion` e é puramente decorativo (`pointer-events-none`).

## Eventos do Meta Pixel

`PageView` automático · `ViewContent` nos CTAs principais · `InitiateCheckout` (com nome do plano e valor) nos botões dos planos.
"# cashflow" 
