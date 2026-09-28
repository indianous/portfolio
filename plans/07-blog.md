# Etapa 07 — Blog

**Objetivo:** lista de artigos em `/blog` e página de cada post em `/blog/[slug]`, escritos em
Markdown.

## 1. Problemas encontrados

- **Escopo.** O estudo de caso cita Markdown "para os posts do blog", mas não lista o blog entre
  as funcionalidades principais. Decidido: o blog entra na primeira versão.
- **O blog precisa estar no ar no lançamento.** O item "Blog" já entra no menu (etapa 02), e a home
  mostra os últimos posts (etapa 04). Para o site não sair com o menu apontando para uma página
  vazia, o lançamento (etapa 11) exige pelo menos 1 post publicado. Até lá, os posts de exemplo da
  etapa 03 ficam como `draft: true`.
- **Paginação.** Com poucos posts, uma lista simples basta; o `Pagination` do base-ds entra só se
  passar de ~10 posts, com páginas estáticas (`/blog/page/2`). Nesse caso, `page` vira um slug
  reservado: o schema de posts deve rejeitá-lo.
- **Feed RSS.** Útil para quem acompanha, barato de gerar no build.

## 2. Testes a incluir

**`src/lib/__tests__/readingTime.test.ts`**
- 200 palavras → "1 min de leitura"; nunca devolve 0.

**`src/lib/__tests__/formatDate.test.ts`**
- Formata em pt-BR ("28 de setembro de 2026") sem depender do fuso da máquina.

**`src/components/blog/__tests__/PostList.test.tsx`**
- Posts em ordem decrescente de data, cada um com título como link, data em `<time dateTime>` e
  tempo de leitura.

**`src/app/blog/__tests__/rss.test.ts`**
- O feed é XML válido com um `<item>` por post publicado.

## 3. O que entra no projeto

**Tipos / BFF**
- `readingTime`, `formatDate`.
- `src/app/blog/rss.xml/route.ts` gerado de forma estática.

**Componentes**
- `PostList`, `PostHeader`; reutiliza `MarkdownContent` da etapa 06.

**Páginas**
- `src/app/blog/page.tsx` e `src/app/blog/[slug]/page.tsx` com `generateStaticParams`,
  `generateMetadata` e JSON-LD (`BlogPosting`).
- Posts no sitemap e link do feed RSS no `<head>` (`alternates.types`).
