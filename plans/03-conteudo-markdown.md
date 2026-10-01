# Etapa 03 — Camada de conteúdo em Markdown

**Objetivo:** projetos, estudos de caso, posts e trajetória vivem em arquivos Markdown em
`content/`, validados na hora do build. Adicionar conteúdo não exige mexer em componentes.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.4.14.

- **Requisito de manutenibilidade.** O estudo de caso exige atualizar projetos, tecnologias e
  artigos sem alterar o código-fonte principal.
- **Frontmatter inválido quebra em silêncio.** Sem validação, um campo faltando só aparece como
  página vazia em produção. Validar com schema (zod) e falhar o build com o nome do arquivo.
- **Renderizar Markdown sem pesar no cliente.** O Markdown é convertido no servidor (build); o
  parser (`unified` e plugins) nunca vai para o navegador.
- **O base-ds não tem componente para texto longo.** Decisão do usuário: o Markdown é convertido
  numa árvore de componentes (`hast-util-to-jsx-runtime`), e não numa string de HTML. Títulos viram
  `Heading`, parágrafos `Text`, imagens `Image` e links usam o `AppLink`. **Listas, citações,
  código, tabelas e linhas divisórias ficam como HTML nativo**, porque o base-ds não tem equivalente
  (o `Table` recebe dados, não filhos), estilizados só com tokens.
- **Sem tokens de realce de código.** Os temas de realce trazem cores literais. Decisão do usuário:
  issue aberta, [indianous/base-ds#59](https://github.com/indianous/base-ds/issues/59); até lá, os
  blocos de código saem sem realce, em `font-mono` com fundo `muted`.
- **Imagem dentro de parágrafo.** O Markdown põe `![]()` dentro de `<p>`, e o `Image` do base-ds
  renderiza uma `<div>`: `<div>` dentro de `<p>` é HTML inválido (erro de hidratação).
  `rehype-unwrap-images` tira as imagens sozinhas do parágrafo.
- **`rehype-sanitize` prefixa os `id` com `user-content-`.** O `rehype-slug` roda depois da
  sanitização, para as âncoras dos títulos ficarem limpas (`#arquitetura`).
- **O YAML converte `date: 2026-09-01` em `Date`.** O schema aceita a data com ou sem aspas e a
  normaliza para `AAAA-MM-DD`.
- **`server-only` lança erro fora do servidor do React**, inclusive no Vitest. Os testes apontam o
  módulo para um arquivo vazio (alias no `vitest.config.mts`).
- **Mudanças em relação ao plano original:**
  - O `slug` vem do nome do arquivo, não do frontmatter: a URL legível é o próprio arquivo e não há
    como os dois divergirem.
  - `hasCaseStudy` é derivado: o projeto tem estudo de caso quando o corpo do arquivo não está
    vazio.
  - A trajetória vira `content/experience/*.md` (um arquivo por experiência, com o corpo como
    descrição), no lugar de um `experience.md` único, para seguir o mesmo carregador dos outros
    tipos.

## 2. Testes a incluir

**`src/content/__tests__/schemas.test.ts`**

- `projectSchema` aceita um projeto completo; rejeita sem `title`, sem `summary` ou com
  `technologies` vazio; aplica `featured: false` por padrão; rejeita `repoUrl` que não é URL.
- `postSchema` aceita `date` em `AAAA-MM-DD` (texto ou `Date` do YAML) e rejeita data inválida;
  `draft` é `false` por padrão.
- `experienceSchema` exige `start` em `AAAA-MM`; `end` é opcional (emprego atual).

**`src/content/__tests__/loaders.test.ts`** (com `src/content/__tests__/fixtures/`)

- `getProjects()` lê os `.md` de `projects/`, com o `slug` do nome do arquivo, e ordena por `order`
  (sem `order` vai para o fim) e depois por data, da mais recente.
- `hasCaseStudy` é `true` só quando o corpo não está vazio.
- `getProjectBySlug('x')` devolve `null` para slug inexistente.
- Frontmatter inválido gera erro com o caminho do arquivo na mensagem.
- `getAllTechnologies()` devolve a lista única e ordenada das tecnologias de todos os projetos.
- `getPosts()` ordena da data mais recente para a mais antiga e ignora `draft: true` quando
  `includeDrafts` é `false` (o padrão em produção).
- `getPostBySlug()` devolve `null` para rascunho quando `includeDrafts` é `false`.
- `getExperience()` ordena do início mais recente para o mais antigo.

**`src/content/__tests__/markdown.test.tsx`** (`next/link` simulado)

- Títulos ganham `id` (`## Arquitetura` → `id="arquitetura"`).
- `<script>` e atributos `on*` são removidos.
- Links internos passam pelo `Link` do Next.js; externos continuam com o `href` original.
- Parágrafos, listas, tabelas (GFM) e blocos de código (`<pre><code class="language-ts">`) são
  renderizados.
- Imagem sozinha numa linha não fica dentro de `<p>`.

## 3. O que entra no projeto

**Dependências**

- `zod`, `gray-matter`, `server-only`, `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`,
  `rehype-sanitize`, `rehype-slug`, `rehype-unwrap-images`, `hast-util-to-jsx-runtime`. Todas só
  no servidor.

**Tipos**

- `src/content/schemas.ts` (zod): `projectSchema`, `postSchema`, `experienceSchema` e os tipos
  `Project`, `Post`, `Experience` (frontmatter + `slug` + `body`).
  - `Project`: `title`, `summary`, `technologies[]`, `date`, `repoUrl?`, `liveUrl?`, `cover?`,
    `featured`, `order?`, e os derivados `slug` e `hasCaseStudy`.
  - `Post`: `title`, `summary`, `date`, `tags[]`, `draft`.
  - `Experience`: `role`, `company`, `start`, `end?`, `location?`, `technologies[]`.

**Carregadores (BFF)**

- `src/content/loaders.ts` (`server-only`): `getProjects`, `getProjectBySlug`,
  `getAllTechnologies`, `getPosts`, `getPostBySlug`, `getExperience`. Leitura com `gray-matter`; o
  diretório é `content/` por padrão e pode ser trocado (fixtures nos testes).
- `src/content/markdown.ts` (`server-only`): `renderMarkdown(markdown)` → `unified` +
  `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-sanitize` + `rehype-slug` +
  `rehype-unwrap-images`, convertido em componentes por `hast-util-to-jsx-runtime`.

**Componentes**

- `src/components/content/markdown-components.tsx`: o mapa elemento → componente (`Heading`,
  `Text`, `Image`, `AppLink`) e os elementos nativos estilizados com tokens.

**Conteúdo**

- `content/projects/`, `content/posts/` e `content/experience/` com 2–3 exemplos cada, para as
  próximas etapas. Os posts de exemplo ficam com `draft: true` para não irem ao ar (ver etapa 07).
- `content/README.md` explicando os campos de cada tipo.
