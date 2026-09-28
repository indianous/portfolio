# Etapa 06 — Estudos de caso

**Objetivo:** página dedicada a cada aplicação principal (`/projects/[slug]`), explicando o
problema, a arquitetura e os resultados.

## 1. Problemas encontrados

- **Estrutura padronizada.** O estudo de caso pede problema → arquitetura → resultados. Garantir
  isso pelo schema (seções obrigatórias) em vez de depender de quem escreve o Markdown.
- **Diagramas de arquitetura.** Imagens em `public/` com `next/image` e texto alternativo
  obrigatório no schema.
- **Tipografia do corpo Markdown.** O HTML gerado precisa usar os tokens do base-ds. Estilizar
  por uma classe de conteúdo com utilitários de token; se faltar um componente/estilo de
  "prose" no base-ds, abrir issue.
- **Páginas estáticas.** Usar `generateStaticParams` e `dynamicParams = false` (slug inexistente
  vira 404).

## 2. Testes a incluir

**`src/content/__tests__/caseStudy.test.ts`**
- Um projeto com `hasCaseStudy: true` sem as seções "Problema", "Arquitetura" e "Resultados" no
  corpo falha a validação.
- `getCaseStudySlugs()` devolve só projetos com estudo de caso.

**`src/components/case-study/__tests__/CaseStudyHeader.test.tsx`**
- Mostra título, resumo, tecnologias como `Badge` e links de repositório/demo.

**`src/components/case-study/__tests__/TableOfContents.test.tsx`**
- Gera índice a partir dos `h2` com âncoras corretas.

**`src/app/projects/[slug]/__tests__/metadata.test.ts`**
- `generateMetadata` usa título e resumo do projeto e imagem de capa no Open Graph.

## 3. O que entra no projeto

**Tipos / BFF**
- Campos de estudo de caso no `projectSchema`: `role`, `period`, `results[]` (métricas), `cover`
  com `alt`.
- `getCaseStudySlugs()` e extração de cabeçalhos para o índice.

**Componentes**
- `CaseStudyHeader`, `TableOfContents`, `ResultsHighlights` (`Card`), `MarkdownContent`.
- `Breadcrumb` do base-ds: Projetos › Nome do projeto.

**Páginas**
- `src/app/projects/[slug]/page.tsx` com `generateStaticParams`, `generateMetadata`, dados
  estruturados JSON-LD (`CreativeWork`) e navegação para o próximo estudo de caso.
- Slugs adicionados ao sitemap.
