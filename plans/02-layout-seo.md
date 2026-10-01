# Etapa 02 — Layout, navegação e SEO base

**Objetivo:** esqueleto comum a todas as páginas (cabeçalho, rodapé, contêiner) e a base de SEO.

## 1. Problemas encontrados

Levantados em `node_modules/@indianous/base-ds/dist/` (v0.4.7) em 2026-09-28.

- **`Navbar` e `Footer` renderizam `<a>` puro** (`dist/index.js`, `DesktopNavItem`,
  `MobileNavItem` e `Footer`). `NavItem` e `FooterColumn.links` só aceitam `href`, sem `asChild` nem
  componente de link, então não compõem com `next/link`: toda navegação interna recarrega a página.
  Issue aberta: [indianous/base-ds#54](https://github.com/indianous/base-ds/issues/54). Até lá,
  usar `href` e aceitar o recarregamento (é site estático, o custo é pequeno).
  **Resolvido na v0.4.9:** `Navbar` e `Footer` recebem `linkComponent`. O `SiteHeader` passa o
  `Link` do Next.js e o `SiteFooter` (Server Component) passa o `AppLink`, reexportado de um arquivo
  `'use client'`.
- **Rótulos do `Navbar` fixos em inglês** (`"Main navigation"`, `"Open navigation menu"`,
  `"More actions"`, títulos `"Menu"`/`"Actions"` dos drawers) num site `pt-BR`. Issue aberta:
  [indianous/base-ds#55](https://github.com/indianous/base-ds/issues/55). Sem contorno no app.
  **Resolvido na v0.4.8:** os rótulos em português vêm de `siteConfig.navLabels`.
- **Estado ativo do menu.** `NavItem.active` gera `aria-current="page"`, mas quem calcula é o app:
  `SiteHeader` precisa de `usePathname()`, então é client component (o base-ds já é todo client).
- **Sem ícones de GitHub/LinkedIn.** O `Icon` usa o `lucide-react@1.x`, que removeu ícones de marca.
  Redes sociais vão como links de texto numa coluna do `Footer`, não em `socialLinks`.
- **LinkedIn e e-mail vêm do ambiente** (`LINKEDIN_URL`, `CONTACT_EMAIL`), decisão do usuário: não
  ficam no código, e o link só aparece quando a variável existe. Como as páginas são estáticas, os
  valores entram no build (defini-los também na Vercel).
- **`Icon` importa o lucide inteiro** (`import * as LucideIcons`, 1.854 ícones). Registrado na
  [#53](https://github.com/indianous/base-ds/issues/53#issuecomment-5872621595). Na v0.4.11 os
  outros componentes passaram a importar só os ícones que usam; o `Icon` continua trazendo todos.
  Não usá-lo: importar do `lucide-react` direto.
- **`Footer` sem `copyright` mostra "© ano base-ds"**: sempre passar `copyright`.
- **Link "pular para o conteúdo".** O base-ds não tem um componente próprio; usar `Button as="a"`
  com `sr-only focus:not-sr-only` (sem elemento nativo).
- **Rotas ainda inexistentes.** `/projects`, `/blog` e `/about` só nascem nas etapas 04–07. O menu
  já aponta para elas (caem no `not-found` até lá), mas o sitemap só lista rotas que existem: cada
  etapa acrescenta a sua.
- **URL do site.** Ainda não há domínio. `siteUrl` vem de `NEXT_PUBLIC_SITE_URL`, depois de
  `VERCEL_PROJECT_PRODUCTION_URL` (Vercel), e por fim `http://localhost:3000`.
- **Links sociais do rodapé.** Com links externos na mesma aba, `rel="noopener noreferrer"` não é
  necessário (o `Footer` não abre nova aba). Teste ajustado.

## 2. Testes a incluir

**`src/config/__tests__/site.test.ts`**

- `getSiteUrl()` usa `NEXT_PUBLIC_SITE_URL` sem barra final; senão `https://` +
  `VERCEL_PROJECT_PRODUCTION_URL`; senão `http://localhost:3000`.
- `getSocialLinks()` devolve GitHub sempre, e LinkedIn e e-mail (`mailto:`) só quando
  `LINKEDIN_URL`/`CONTACT_EMAIL` têm valor, sem espaços em volta.

**`src/lib/__tests__/seo.test.ts`**

- `buildMetadata({ title, description, path })` gera título "Título · Nome", `canonical` absoluto e
  Open Graph (`url`, `siteName`, `locale: 'pt_BR'`, `type: 'website'`).
- Sem `title`, o título é "Nome — Cargo" (home).
- Sem `description`, usa a descrição do site.

**`src/components/layout/__tests__/SiteHeader.test.tsx`** (`usePathname` simulado)

- Logo com o nome do desenvolvedor é link para `/`.
- Links "Projetos", "Blog" e "Sobre" com `href` `/projects`, `/blog`, `/about`.
- Em `/projects/algum-projeto`, "Projetos" tem `aria-current="page"` e os outros não.
- Em `/`, nenhum item do menu está ativo.

**`src/components/layout/__tests__/SiteFooter.test.tsx`**

- Coluna de navegação com os mesmos itens do menu.
- Coluna "Redes" com os links recebidos (GitHub, LinkedIn, e-mail).
- Copyright com o ano informado e o nome do desenvolvedor (nunca "base-ds").

**`src/components/layout/__tests__/SkipLink.test.tsx`**

- Link "Pular para o conteúdo" aponta para `#conteudo`.

**`src/app/__tests__/sitemap.test.ts`** e **`src/app/__tests__/robots.test.ts`**

- O sitemap lista `/` com URL absoluta.
- O robots libera tudo e aponta para o `sitemap.xml` absoluto.

## 3. O que entra no projeto

**Tipos**

- `src/config/site.ts`: `siteConfig` (nome, cargo, descrição, locale, itens de navegação, GitHub),
  `getSiteUrl()`, `getSocialLinks()`, `staticRoutes`.
- `.env.example` com `NEXT_PUBLIC_SITE_URL`, `LINKEDIN_URL` e `CONTACT_EMAIL`.

**BFF**

- `src/lib/seo.ts` com `buildMetadata`.
- `src/app/sitemap.ts` e `src/app/robots.ts`.

**Componentes**

- `SiteHeader` (client, `Navbar` + `Button` do logo), `SiteFooter` (`Footer`), `SkipLink`
  (`Button as="a"`).

**Páginas**

- `src/app/layout.tsx`: `metadataBase`, `metadata` padrão, `SkipLink`, `SiteHeader`,
  `<Container as="main" id="conteudo">` e `SiteFooter`.
- `src/app/not-found.tsx` com `Heading`, `Text` e `Button` de volta à home.
- `src/app/page.tsx` provisória passa a ser só o conteúdo (o `<main>` agora vem do layout).
