# Etapa 06 — Estudos de caso

**Objetivo:** página dedicada a cada aplicação principal (`/projects/[slug]`), explicando o
problema, a arquitetura e os resultados.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.1.

- **Estrutura padronizada.** O estudo de caso pede problema → arquitetura → resultados. O
  carregador exige as seções `## Problema`, `## Arquitetura` e `## Resultados` no corpo de todo
  projeto que tem estudo de caso, e falha com o caminho do arquivo e as seções que faltam.
- **Imagens com texto alternativo.** `cover` passa a exigir `coverAlt`. Imagens no corpo já usam o
  `alt` do Markdown, com o `Image` do base-ds (etapa 03).
- **Realce de código: resolvido no base-ds 0.5.1**
  ([indianous/base-ds#59](https://github.com/indianous/base-ds/issues/59)). Há tokens
  `--color-code-*` para o tema `css-variables` do Shiki, e componentes `Code` (inline) e
  `CodeBlock` (bloco, recebe o HTML do realçador). O Shiki roda no build, dentro de um plugin
  rehype próprio que guarda o HTML realçado no `<pre>`; o mapa de componentes troca esse `<pre>`
  pelo `CodeBlock` e o código inline pelo `Code`. Linguagem desconhecida cai para o bloco sem
  realce. Nada de JS de realce no cliente.
- **Índice da página.** Os `h2` do corpo viram um índice ("Nesta página"), com as âncoras geradas
  pelo mesmo `github-slugger` que o `rehype-slug` usa, para os links baterem com os `id`.
- **`Breadcrumb` sem `linkComponent`.** Renderiza `<a>` puro, então "Projetos" na trilha recarrega
  a página. Issue aberta: [indianous/base-ds#61](https://github.com/indianous/base-ds/issues/61);
  até lá, usar `href` e aceitar o recarregamento. O rótulo do `<nav>` vai em português
  (`label`).
- **`Button asChild` em Server Components** continua quebrando
  ([indianous/base-ds#60](https://github.com/indianous/base-ds/issues/60)): os links internos com
  cara de botão usam o `ButtonLink` da etapa 04.
- **Páginas estáticas.** `generateStaticParams` com os projetos que têm estudo de caso e
  `dynamicParams = false`: slug inexistente, ou de projeto sem estudo de caso, vira 404. O
  `cacheComponents` não está ligado, então o `dynamicParams` vale (no Next.js 16 ele some com o
  `cacheComponents`).
- **JSON-LD.** Dados estruturados `CreativeWork` num `<script type="application/ld+json">`, com o
  `<` trocado por `<`, como recomenda o guia do Next.js.
- **Mudanças em relação ao plano original:**
  - `role` e `period` não entram: o card e a trajetória já dizem isso, e o projeto tem `date`.
  - `results[]` vira `highlights` (opcional): pares `value`/`label` mostrados em `Card`s antes do
    corpo (ex.: "−95%" / "de JS do base-ds numa página").
  - Sem componente `MarkdownContent`: o `renderMarkdown` da etapa 03 já devolve os componentes.
- **Sitemap.** Os estudos de caso entram no sitemap, que passa a ler os projetos.

## 2. Testes a incluir

**`src/content/__tests__/schemas.test.ts`**

- `projectSchema` exige `coverAlt` quando há `cover`; aceita `highlights` com `value` e `label`.

**`src/content/__tests__/loaders.test.ts`**

- Projeto com estudo de caso sem `## Problema`, `## Arquitetura` ou `## Resultados` falha com o
  caminho do arquivo e as seções que faltam (fixture em `fixtures/invalid-case-study/`).
- `getCaseStudies()` devolve só os projetos com estudo de caso, na ordem da vitrine.

**`src/content/__tests__/markdown.test.tsx`**

- Bloco com linguagem conhecida sai realçado pelo `CodeBlock` (spans com os tokens
  `--color-code-token-*`), com a linguagem no cabeçalho.
- Bloco sem linguagem ou com linguagem desconhecida sai sem realce, com o código intacto.
- Código inline usa o `Code` do base-ds.

**`src/content/__tests__/headings.test.ts`**

- `extractHeadings(markdown)` devolve os `h2` com texto e `id` iguais aos do `renderMarkdown`
  (acentos, formatação inline, títulos repetidos).

**`src/lib/__tests__/seo.test.ts`**

- `buildMetadata` com `image` põe a imagem (URL absoluta e `alt`) no Open Graph e usa o tipo
  `article`.

**`src/components/case-study/__tests__/CaseStudyHeader.test.tsx`**

- `h1` com o título, resumo, tecnologias em lista e links de repositório e versão online quando
  existem.

**`src/components/case-study/__tests__/TableOfContents.test.tsx`**

- `nav` "Nesta página" com um link por título, apontando para `#id`.

**`src/components/case-study/__tests__/Highlights.test.tsx`**

- Mostra cada destaque (valor e rótulo) em lista; sem destaques, não renderiza nada.

**`src/app/projects/[slug]/__tests__/page.test.ts`**

- `generateStaticParams` devolve só os slugs com estudo de caso.
- `generateMetadata` usa título e resumo do projeto e a capa no Open Graph.

**`src/app/__tests__/sitemap.test.ts`**

- Lista as rotas estáticas e os estudos de caso.

## 3. O que entra no projeto

**Dependências**

- `shiki` (só no build), `github-slugger` e `mdast-util-to-string` (já vêm com o
  `rehype-slug`/`remark`, agora declarados).

**Tipos e carregadores**

- `projectSchema`: `coverAlt` (obrigatório com `cover`) e `highlights`.
- `getCaseStudies()` e a validação das seções em `src/content/loaders.ts`.
- `src/content/headings.ts`: `extractHeadings`.
- `src/content/highlight.ts`: plugin rehype que realça os blocos com o Shiki e o tema de tokens do
  base-ds.

**Componentes**

- `markdown-components`: `pre` → `CodeBlock`, código inline → `Code`.
- `src/components/case-study/`: `CaseStudyHeader`, `TableOfContents`, `Highlights`.
- `Breadcrumb` do base-ds: Projetos › Nome do projeto.

**Páginas**

- `src/app/projects/[slug]/page.tsx`: `generateStaticParams`, `dynamicParams = false`,
  `generateMetadata`, JSON-LD `CreativeWork`, link para o próximo estudo de caso quando houver.
- `src/app/sitemap.ts` com os estudos de caso.
