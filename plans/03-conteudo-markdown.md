# Etapa 03 — Camada de conteúdo em Markdown

**Objetivo:** projetos, estudos de caso, posts e trajetória vivem em arquivos Markdown em
`content/`, validados na hora do build. Adicionar conteúdo não exige mexer em componentes.

## 1. Problemas encontrados

- **Requisito de manutenibilidade.** O estudo de caso exige atualizar projetos, tecnologias e
  artigos sem alterar o código-fonte principal.
- **Frontmatter inválido quebra em silêncio.** Sem validação, um campo faltando só aparece como
  página vazia em produção. Validar com schema e falhar o build.
- **Renderizar Markdown sem pesar no cliente.** Converter Markdown para HTML no servidor (build),
  sem enviar parser para o navegador.

## 2. Testes a incluir

**`src/content/__tests__/schemas.test.ts`**
- `projectSchema` aceita um projeto completo e rejeita sem `title`, `slug` ou `technologies`.
- `postSchema` exige `date` válida no formato ISO.
- `experienceSchema` exige `start`; `end` opcional (emprego atual).

**`src/content/__tests__/loaders.test.ts`** (com diretório de fixtures)
- `getProjects()` lê todos os `.md` de `content/projects`, ordena por `order` e depois por data.
- `getProjectBySlug('x')` devolve `null` para slug inexistente.
- Arquivo com frontmatter inválido gera erro com o nome do arquivo na mensagem.
- `getAllTechnologies()` devolve a lista única e ordenada das tecnologias de todos os projetos.
- `getPosts()` ignora posts com `draft: true` em produção.

**`src/content/__tests__/markdown.test.ts`**
- `renderMarkdown()` gera HTML com cabeçalhos com `id`, código com realce e remove HTML
  perigoso (`<script>`).

## 3. O que entra no projeto

**Tipos**
- `src/content/schemas.ts` (zod): `Project`, `CaseStudy` (corpo do projeto), `Post`, `Experience`.
  - `Project`: `slug`, `title`, `summary`, `technologies[]`, `repoUrl?`, `liveUrl?`, `cover?`,
    `featured`, `order`, `hasCaseStudy`.

**Carregadores (BFF)**
- `src/content/loaders.ts`: `getProjects`, `getProjectBySlug`, `getAllTechnologies`, `getPosts`,
  `getPostBySlug`, `getExperience`. Leitura com `gray-matter`, só no servidor (`server-only`).
- `src/content/markdown.ts`: `unified` + `remark-parse` + `remark-gfm` + `remark-rehype` +
  `rehype-sanitize` + `rehype-slug` + realce de código no build.

**Conteúdo**
- `content/projects/`, `content/posts/`, `content/experience.md` com 2–3 exemplos cada, para as
  próximas etapas. Os posts de exemplo ficam com `draft: true` para não irem ao ar (ver etapa 07).
- `content/README.md` explicando os campos de cada tipo.
