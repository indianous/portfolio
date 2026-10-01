# Etapa 07 — Blog

**Objetivo:** lista de artigos em `/blog` e página de cada post em `/blog/[slug]`, escritos em
Markdown.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.1 e o Next.js 16.3.6.

- **Escopo.** O estudo de caso cita Markdown "para os posts do blog", mas não lista o blog entre
  as funcionalidades principais. Decidido: o blog entra na primeira versão.
- **O blog precisa estar no ar no lançamento.** O item "Blog" já está no menu (etapa 02), e a home
  mostra os últimos posts (etapa 04). Para o site não sair com o menu apontando para uma página
  vazia, o lançamento (etapa 11) exige pelo menos 1 post publicado. Até lá, os posts de exemplo da
  etapa 03 ficam como `draft: true`.
- **Hoje todos os posts são rascunhos.** No build de produção, `/blog` mostra um aviso de "nenhum
  post publicado" e `generateStaticParams` devolve lista vazia. Com `dynamicParams = false` e sem
  `cacheComponents`, isso é aceito pelo Next.js 16: todo `/blog/[slug]` vira 404 (com
  `cacheComponents`, lista vazia seria erro de build). Em desenvolvimento os rascunhos aparecem,
  marcados com o `Badge` "Rascunho".
- **Tempo de leitura** calculado no carregador (`readingMinutes`, 200 palavras por minuto, nunca
  0), sem campo no frontmatter.
- **Uma lista de posts só.** A home (etapa 04) já tem a lista dos últimos posts; vira o componente
  `PostList`, usado na home (títulos `h3`) e no `/blog` (títulos `h2`), com tempo de leitura e
  marca de rascunho.
- **`formatDate` já existe** (etapa 04, com teste de fuso). Não entra de novo.
- **Página do post** reaproveita o que veio dos estudos de caso: `renderMarkdown` (com realce de
  código), `TableOfContents` e `extractHeadings`, e o `Breadcrumb` (Blog › título), que ainda
  recarrega a página no link ([indianous/base-ds#61](https://github.com/indianous/base-ds/issues/61)).
- **Feed RSS** em `/blog/rss.xml`, um Route Handler com `dynamic = 'force-static'`: desde o
  Next.js 15 os `GET` são dinâmicos por padrão. Só posts publicados; texto escapado para XML. O
  link do feed vai no `<head>` (`alternates.types`).
- **Paginação.** Com poucos posts, uma lista simples basta. O `Pagination` do base-ds entra só se
  passar de ~10 posts, com páginas estáticas (`/blog/page/2`); aí `page` vira slug reservado.
- **Sitemap.** `/blog` entra em `staticRoutes`, e os posts publicados, no sitemap.

## 2. Testes a incluir

**`src/lib/__tests__/readingTime.test.ts`**

- 200 palavras → 1 minuto; 401 → 3; texto vazio → 1 (nunca 0).
- Ignora a sintaxe do Markdown que não é texto (cercas de código, `#`, links só pelo texto).
- `formatReadingTime(3)` → "3 min de leitura".

**`src/content/__tests__/loaders.test.ts`**

- `getPosts()` traz `readingMinutes` de cada post.

**`src/components/blog/__tests__/PostList.test.tsx`**

- Posts do mais recente para o mais antigo, com título como link para `/blog/[slug]` no nível de
  título pedido, data em `<time dateTime>`, tempo de leitura e resumo.
- Rascunho ganha o `Badge` "Rascunho".

**`src/components/home/__tests__/LatestPosts.test.tsx`** (mantido, agora usando o `PostList`)

**`src/components/blog/__tests__/PostHeader.test.tsx`**

- Trilha Blog › título, `h1`, data, tempo de leitura e tags em lista.

**`src/app/blog/rss.xml/__tests__/route.test.ts`**

- Responde `application/rss+xml` com um `<item>` por post publicado (título, link absoluto,
  `pubDate`, descrição) e escapa `&`, `<` e `>`.

**`src/app/blog/[slug]/__tests__/page.test.ts`**

- `generateStaticParams` devolve os slugs dos posts publicados.
- `generateMetadata` usa título, resumo, `type: 'article'` e a data de publicação.

**`src/lib/__tests__/seo.test.ts`**

- `buildMetadata` com `publishedTime` gera Open Graph `article` com `publishedTime`.

**`src/config/__tests__/site.test.ts`** e **`src/app/__tests__/sitemap.test.ts`**

- `staticRoutes` inclui `/blog`; o sitemap lista os posts.

## 3. O que entra no projeto

**Lógica**

- `src/lib/readingTime.ts`: `countReadingMinutes`, `formatReadingTime`.
- `readingMinutes` no `Post` (calculado em `getPosts`).
- `buildMetadata` com `publishedTime` e `feed` (link do RSS).

**Componentes**

- `src/components/blog/PostList.tsx` (a home passa a usá-lo) e `PostHeader.tsx`.

**Páginas e rotas**

- `src/app/blog/page.tsx`: lista ou aviso de "nenhum post publicado".
- `src/app/blog/[slug]/page.tsx`: `generateStaticParams`, `dynamicParams = false`,
  `generateMetadata`, JSON-LD `BlogPosting`, índice quando houver títulos.
- `src/app/blog/rss.xml/route.ts` (`force-static`).
- Sitemap com `/blog` e os posts.
