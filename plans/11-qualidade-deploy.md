# Etapa 11 — Performance, acessibilidade e deploy

**Objetivo:** garantir 100/100 no Lighthouse em performance e acessibilidade, e publicar na
Vercel com integração contínua.

## 1. Problemas encontrados

Medido em 2026-10-01 com Lighthouse 13.5.0 (perfil móvel, simulado) sobre o `next build` +
`next start`, com `GITHUB_TOKEN`, nesta máquina.

- **Ponto de partida.** Boas práticas e SEO em 100 em todas as páginas; CLS 0; acessibilidade 100,
  menos a `/projects` (98); performance 99 (LCP simulado 1,8–2,0 s, TBT 20–70 ms).
- **Ordem dos títulos na `/projects`** (`heading-order`): o `h1` da página ia direto para o `h3`
  dos cards. O `ProjectCard` ganha `headingLevel`; na vitrine os cards são `h2`. Acessibilidade
  100 em todas as páginas depois disso.
- **O LCP simulado depende do peso do JS.** O elemento do LCP é texto (o parágrafo de abertura) e
  aparece ~60 ms depois do primeiro byte, mas a simulação de rede lenta do Lighthouse conta os
  downloads iniciados antes dele, e o JS começa a baixar logo. Medidas:
  - `experimental.inlineCss` (CSS dentro do HTML): sem efeito no LCP; não entra.
  - Sem o Motion (commit da etapa 09): `/` 100 (LCP 1,8 s), `/about` 99.
  - Com `LazyMotion` + `m` (etapa 10): +19,5 KB gzip e LCP ~0,2 s pior.
  - **O `Reveal` passa a usar só o `inView` e o `animate` do `motion/mini`** (Web Animations API),
    sem `LazyMotion`, `MotionConfig` nem `m`: o JS da `/` cai de 215,2 para 199,0 KB gzip (+3,4 KB
    em relação a antes do Motion). O comportamento é o mesmo da etapa 10.
- **Piso do framework.** Mesmo assim, a performance fica entre 99 e 100 (três rodadas por página:
  LCP 1,7–2,0 s, TBT 60–70 ms). A única tarefa longa (~120 ms) e ~114 KB dos ~173 KB de JS
  transferidos são do próprio Next.js/React (roteador e hidratação), não do código do app.
  **Decisão do usuário:** o Lighthouse CI falha abaixo de 98 em performance e abaixo de 100 nas
  outras categorias; a meta de 100 continua valendo e aparece no relatório. (Começou em 99; ver o
  item sobre a CI abaixo.)
- **A `/projects` reprovou na primeira execução da CI** (96, 97 e 98; as outras páginas passaram).
  O `<Suspense>` exigido pelo `useSearchParams` (etapa 05) fazia a hidratação trocar o HTML
  estático inteiro da vitrine pela versão do cliente: o elemento do LCP saía do DOM e a troca
  custava TBT. O `ProjectShowcase` passou a ler `?tech=` de `window.location` com
  `useSyncExternalStore` (sem filtro no servidor e na hidratação), avisando as mudanças pelo
  `popstate` e por um evento próprio depois do `pushState`; a página não usa mais `Suspense`.
  Localmente, a `/projects` foi de TBT 70 ms para 30 ms e de 99 fixo para 99–100. O artefato com os
  relatórios também não subia: o `upload-artifact` ignora pastas ocultas sem
  `include-hidden-files: true`.
- **Ruído da simulação no runner.** Na segunda execução da CI, a `/projects` passou e a home
  reprovou (80, 98, 98). Os relatórios mostram que o `lhci` 0.15.1 usa o Lighthouse 12.6.1 (não o
  13.5.0 local) e que a mesma página, no mesmo build, alterna entre LCP simulado de 1,7–1,9 s e
  2,3–2,4 s, com o mesmo elemento e LCP observado de ~100 ms; a primeira rodada (máquina fria) chega
  a TBT de 700–800 ms. O `lhci` já usa a melhor rodada nas asserções. Decisão do usuário: baixar o
  limite de performance da CI para 98.
- **Segredos.** `GITHUB_PACKAGES_TOKEN` (instalar o base-ds no build) e `GITHUB_TOKEN` (etapa 08)
  precisam existir na Vercel. Na CI do Lighthouse o build roda sem `GITHUB_TOKEN` (a seção do
  GitHub some), como na CI de testes.
- **CSP num site estático.** Nonce exige renderização dinâmica, e o SRI do Next.js não cobre
  scripts inline (o do tema e os do próprio Next.js). Fica o CSP "sem nonces" do guia do Next.js
  16: `'unsafe-inline'` em `script-src` e `style-src` (o `Reveal` e o realce do Shiki usam estilo
  inline), mais `'unsafe-eval'` só em desenvolvimento. Ainda restringe origens, `object-src`,
  `base-uri`, `form-action` e `frame-ancestors`. Junto: `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy` e `X-Frame-Options`. A Vercel já envia HSTS.
- **Imagens.** O site ainda não tem imagens (capas e foto são opcionais); o `Image` do base-ds já
  carrega em modo lazy e aceita `priority`. Configurar AVIF/WebP do `next/image` fica para quando
  houver imagens.
- **`axe` no jsdom** não calcula contraste (sem CSS): a regra `color-contrast` fica desligada no
  teste, e o contraste fica com o Lighthouse e com o teste de contraste do base-ds.

## 2. Testes a incluir

**`__tests__/a11y/pages.test.tsx`** (`axe-core`)

- Home, `/projects`, um estudo de caso, `/blog`, um post, `/about`, o cabeçalho e o rodapé sem
  violações.

**`__tests__/headers.test.ts`**

- `next.config` envia em todas as rotas `Content-Security-Policy` (com `object-src 'none'`,
  `frame-ancestors 'none'` e `base-uri 'self'`, sem `'unsafe-eval'` em produção),
  `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` e
  `X-Frame-Options: DENY`.

**`src/components/projects/__tests__/ProjectCard.test.tsx`**

- `headingLevel` define o nível do título.

**`lighthouserc.json`** (Lighthouse CI, perfil móvel, mediana de 3 rodadas)

- Acessibilidade, boas práticas e SEO = 100 e performance ≥ 98 nas páginas principais.

## 3. O que entra no projeto

**Configuração**

- `next.config.ts`: cabeçalhos de segurança.

**Componentes**

- `Reveal` sobre `motion/mini`; `MotionProvider` e `LazyMotion` removidos.
- `ProjectCard` com `headingLevel`.

**CI / deploy**

- `.github/workflows/lighthouse.yml`: build e Lighthouse CI a cada PR e push na `main`.
- Projeto na Vercel ligado ao repositório: preview por PR e produção na `main`. Criar o projeto,
  as variáveis e o domínio é feito pelo usuário; o repositório fica pronto (`.env.example`
  completo, instruções no README).
- `README.md` do projeto: como rodar, variáveis de ambiente, como adicionar conteúdo e publicar.

**Checklist de lançamento**

- Pelo menos 1 post publicado (sem `draft`) e os posts de exemplo removidos (etapa 07).
- Revisar `content/profile.md` (rascunho da etapa 04) e a trajetória.
