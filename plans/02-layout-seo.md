# Etapa 02 — Layout, navegação e SEO base

**Objetivo:** esqueleto comum a todas as páginas (cabeçalho, rodapé, contêiner) e a base de SEO.

## 1. Problemas encontrados

- **Links do Next.js no base-ds.** `Button` aceita `as="a"` com `href` e `asChild`; o `Navbar`
  recebe `items`, `logo`, `actions`. Conferir em `dist/index.d.ts` se `asChild` permite envolver o
  `next/link` e se os `items` do `Navbar` aceitam um componente de link. Se não aceitarem,
  navegação vira recarregamento de página → abrir issue no base-ds antes de contornar.
- **Tudo do base-ds é client component.** O layout pode continuar Server Component e só renderizar
  `Navbar`/`Footer` como filhos; evitar marcar páginas inteiras com `'use client'`.
- **SEO ainda inexistente.** Sem `metadata`, `sitemap.xml`, `robots.txt` nem Open Graph.

## 2. Testes a incluir

**`src/components/layout/__tests__/SiteHeader.test.tsx`**
- Renderiza os links "Projetos", "Blog" e "Sobre" com os `href` corretos.
- Marca o link da rota atual com `aria-current="page"`.

**`src/components/layout/__tests__/SiteFooter.test.tsx`**
- Renderiza links para GitHub e LinkedIn com `rel="noopener noreferrer"` quando externos.

**`src/lib/__tests__/seo.test.ts`**
- `buildMetadata({ title, description, path })` gera título no formato "Título · Nome",
  `canonical` absoluto e bloco Open Graph.

**`src/app/__tests__/sitemap.test.ts`**
- O sitemap lista as rotas estáticas (as dinâmicas entram nas etapas 05–07).

## 3. O que entra no projeto

**Tipos**
- `src/config/site.ts`: nome, descrição, URL base, redes sociais, itens de navegação (tipados).

**BFF**
- `src/lib/seo.ts` com `buildMetadata`.
- `src/app/sitemap.ts` e `src/app/robots.ts`.

**Componentes**
- `SiteHeader` (base-ds `Navbar`) e `SiteFooter` (base-ds `Footer`), usando `Container`.
- Link "Pular para o conteúdo" para acessibilidade (verificar se o base-ds tem algo equivalente).

**Páginas**
- `src/app/layout.tsx`: `lang="pt-BR"`, fonte via `next/font`, `metadata` padrão, header/footer.
- `src/app/not-found.tsx` com `Heading`, `Text` e `Button` de volta à home.
