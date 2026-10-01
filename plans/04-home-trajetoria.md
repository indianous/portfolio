# Etapa 04 — Página inicial e trajetória

**Objetivo:** home que apresenta o desenvolvedor, destaca projetos e leva o visitante a entrar em
contato. Página `/about` com a trajetória profissional.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.0.

- **Conversão.** O estudo de caso mira recrutadores e clientes; a home precisa de chamadas claras
  (ver projetos, contato) acima da dobra no celular.
- **Textos de apresentação não podem ficar no código.** A frase de apresentação da home e o resumo
  do `/about` são conteúdo: vão para `content/profile.md` (frontmatter `headline`, corpo em
  Markdown), com schema e carregador como os outros tipos da etapa 03.
- **Não há foto nem currículo em `public/`.** Os dois viram campos opcionais do `profile.md`
  (`photo`, `resume`): a foto e o link do currículo só aparecem quando o campo existe. Sem foto, o
  LCP da home é o título, o que ajuda a performance.
- **Destino do "Contato".** O e-mail e o LinkedIn vêm do ambiente (etapa 02) e podem não existir.
  `getContactHref()` usa o e-mail (`mailto:`), depois o LinkedIn; sem nenhum dos dois, o botão não
  aparece.
- **O base-ds não tem linha do tempo nem lista.** A trajetória é um `<ol>` nativo com `Heading`,
  `Text` e `Badge` em cada item; as listas de projetos, posts e tecnologias são `<ul>` nativos.
  Usar listas semânticas é o que dá a contagem de itens ao leitor de tela. Não vale abrir issue
  enquanto a montagem for simples.
- **O `Card` é uma `<div>` sem semântica.** Cada card fica dentro de um `<li>`, com o título em
  `Heading` `h3`.
- **Links repetidos nos cards** ("Repositório", "Estudo de caso") teriam o mesmo nome e destinos
  diferentes. Cada um ganha o nome do projeto em texto só para leitores de tela (`sr-only`).
- **`Button asChild` quebra em Server Components** (achado na implementação): o filho client (o
  `AppLink`) chega ao `Button` como elemento lazy, sem `props`, e o `next dev` cai com `Cannot read
properties of undefined (reading 'className')`. Os testes não pegam (o jsdom não passa pela
  fronteira server/client), e o `next build` passa. Issue aberta:
  [indianous/base-ds#60](https://github.com/indianous/base-ds/issues/60). Decisão do usuário: até
  lá, `src/components/ButtonLink.tsx` (`'use client'`) monta o `Button asChild` com o `Link`; quando
  a issue sair, voltar ao `Button asChild` e apagar o `ButtonLink`.
- **Datas.** `AAAA-MM-DD` e `AAAA-MM` formatadas em pt-BR com `Intl.DateTimeFormat` em UTC, para
  não voltar um dia por causa do fuso.
- **Posts em produção.** Todos os posts ainda são rascunhos; no build de produção a seção "Últimos
  posts" some sozinha.
- **Sitemap.** `/about` passa a existir e entra em `staticRoutes`.
- **base-ds 0.5.0.** Muda só `FilterDropdown`, `MultiSelect` e `KanbanBoard`, que o portfólio não
  usa; atualizado sem ajustes. Se a etapa 05 usar o `FilterDropdown`, passar os rótulos em
  português.

## 2. Testes a incluir

**`src/content/__tests__/schemas.test.ts`** e **`loaders.test.ts`**

- `profileSchema` exige `headline`; `photo` e `resume` são opcionais.
- `getProfile()` lê `profile.md`, com o corpo; o `content/profile.md` real é válido.

**`src/config/__tests__/site.test.ts`**

- `getContactHref()` devolve `mailto:` com o e-mail; sem e-mail, o LinkedIn; sem os dois,
  `undefined`.
- `staticRoutes` inclui `/about` (e o teste do sitemap passa a esperar `/` e `/about`).

**`src/lib/__tests__/dates.test.ts`**

- `formatDate('2026-09-01')` → "1 de setembro de 2026", sem voltar um dia por fuso.
- `formatYearMonth('2016-01')` → "jan. de 2016".

**`src/components/home/__tests__/Hero.test.tsx`**

- Nome e cargo num único `h1`, e a frase de apresentação.
- "Ver projetos" leva a `/projects` pelo `Link` do Next.js; "Contato" usa o `contactHref`.
- Sem `contactHref`, não há botão "Contato".

**`src/components/projects/__tests__/ProjectCard.test.tsx`**

- Título em `h3`, resumo e as tecnologias em lista.
- Link "Estudo de caso" para `/projects/[slug]` só quando `hasCaseStudy`.
- Links "Repositório" e "Ver online" só quando há `repoUrl`/`liveUrl`, com o nome do projeto no
  nome acessível.

**`src/components/home/__tests__/FeaturedProjects.test.tsx`**

- Renderiza só projetos com `featured: true`, no máximo 3, e o link "Ver todos" para `/projects`.
- Sem projetos em destaque, a seção não é renderizada.

**`src/components/home/__tests__/LatestPosts.test.tsx`**

- No máximo 3 posts, do mais recente para o mais antigo, cada um com link para `/blog/[slug]` e a
  data em `<time>`.
- Sem posts, a seção não é renderizada.

**`src/components/about/__tests__/Timeline.test.tsx`**

- Lista semântica (`<ol>`), da experiência mais recente para a mais antiga.
- Período com "Atual" quando não há `end`; empresa, local e tecnologias.

## 3. O que entra no projeto

**Tipos e carregadores**

- `profileSchema` e `Profile` em `src/content/schemas.ts`; `getProfile()` em
  `src/content/loaders.ts`.
- `getContactHref()` em `src/config/site.ts`; `/about` em `staticRoutes`.
- `src/lib/dates.ts`: `formatDate`, `formatYearMonth`.

**Componentes**

- `src/components/ButtonLink.tsx` (temporário, base-ds#60), com teste.
- `src/components/home/`: `Hero`, `FeaturedProjects`, `LatestPosts`.
- `src/components/projects/ProjectCard.tsx`, reaproveitado na etapa 05.
- `src/components/about/Timeline.tsx`.

**Conteúdo**

- `content/profile.md`: frase de apresentação e resumo (rascunho para o usuário revisar).

**Páginas**

- `src/app/page.tsx`: Hero, projetos em destaque e os 3 últimos posts.
- `src/app/about/page.tsx`: resumo (`profile.md`), trajetória, tecnologias (dos projetos e da
  trajetória) e o link do currículo quando houver; metadados com `buildMetadata`.
