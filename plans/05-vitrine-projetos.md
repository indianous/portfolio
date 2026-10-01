# Etapa 05 — Vitrine de projetos com filtro

**Objetivo:** página `/projects` com todos os projetos e filtro por tecnologia (React, Node.js,
Python etc.), com links para repositório e live preview.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.0.

- **Componente do filtro.** O base-ds tem o `FilterDropdown`, que esconde as opções num menu com
  "Aplicar". Decisão do usuário: **botões de alternar**, com todas as tecnologias à vista. Cada
  uma é um `Button` do base-ds com `aria-pressed` (`primary` ligado, `outline` desligado), num
  grupo nativo (`role="group"`, sem equivalente no base-ds) com rótulo. O `FilterDropdown` não é
  usado, então os rótulos que a 0.5.0 exige não se aplicam.
- **Filtro compartilhável.** Fica na URL (`?tech=react,node.js`), para o link poder ser enviado a
  um recrutador. Cada clique faz `history.pushState`, que o Next.js sincroniza com o
  `useSearchParams`, e o "voltar" desfaz o filtro. O valor na URL é a tecnologia em minúsculas,
  com hífen no lugar de espaço (`Tailwind CSS` → `tailwind-css`); valores desconhecidos são
  ignorados.
- **`useSearchParams` numa página estática.** O Next.js 16 exige um `<Suspense>` em volta, e o
  que está dentro dele não vai no HTML estático. O `fallback` é a própria vitrine sem filtro, então
  o HTML pré-renderizado continua com todos os projetos (SEO e primeira pintura); depois da
  hidratação, o filtro da URL é aplicado.
- **Página estática com filtro no cliente.** A lista vem do build; só o filtro roda no cliente,
  sobre os projetos já serializados. Nada de buscar conteúdo no cliente.
- **Estado vazio não acontece.** O filtro mostra quem tem **qualquer uma** das tecnologias
  selecionadas, e só oferece tecnologias que existem em algum projeto, então sempre há resultado.
  Fica o botão "Limpar filtros" sempre que houver seleção, e não há tela de "nenhum projeto".
- **Links dos cards na mesma aba.** O plano original pedia nova aba com `rel="noopener
noreferrer"`. Mantido o que já vale no site desde a etapa 02: links na mesma aba, sem surpresa
  para leitores de tela. O `ProjectCard` da etapa 04 já mostra repositório e versão online só
  quando existem, com o nome do projeto no rótulo.
- **Anúncio do resultado.** A contagem ("2 projetos") fica numa região `role="status"`, lida pelo
  leitor de tela a cada mudança de filtro.
- **Sitemap.** `/projects` entra em `staticRoutes`.

## 2. Testes a incluir

**`src/lib/__tests__/technologies.test.ts`**

- `toTechSlug('Tailwind CSS')` → `tailwind-css`; `toTechSlug('Node.js')` → `node.js`.
- `parseTechQuery('react,node.js', technologies)` devolve as tecnologias com a grafia original;
  ignora vazios, repetidos e desconhecidos; `null` devolve `[]`.
- `serializeTechQuery([])` → `null`; com tecnologias, os slugs separados por vírgula.
- `filterProjects(projects, [])` devolve todos.
- Com várias tecnologias, devolve os projetos que têm qualquer uma, uma vez só, na ordem original.
- Compara sem diferenciar maiúsculas.

**`src/components/projects/__tests__/ProjectGallery.test.tsx`**

- Mostra um botão por tecnologia, com `aria-pressed` refletindo a seleção, num grupo com rótulo.
- Lista só os projetos filtrados e anuncia a contagem em `role="status"`.
- Clicar numa tecnologia chama `onSelectedChange` com ela acrescentada (ou retirada, se já
  estava).
- "Limpar filtros" só aparece com seleção e chama `onSelectedChange([])`.

**`src/components/projects/__tests__/ProjectShowcase.test.tsx`** (`next/navigation` simulado)

- Lê a seleção de `?tech=` e filtra a lista.
- Clicar numa tecnologia grava o filtro na URL com `history.pushState`.

**`src/config/__tests__/site.test.ts`** e **`src/app/__tests__/sitemap.test.ts`**

- `staticRoutes` inclui `/projects`.

## 3. O que entra no projeto

**Lógica (funções puras)**

- `src/lib/technologies.ts`: `toTechSlug`, `parseTechQuery`, `serializeTechQuery`,
  `filterProjects`.

**Componentes**

- `ProjectGallery` (client): grupo de botões de filtro, contagem anunciada e grade de
  `ProjectCard`; recebe a seleção e avisa a mudança.
- `ProjectShowcase` (client): liga a `ProjectGallery` à URL (`useSearchParams` + `pushState`).

**Páginas**

- `src/app/projects/page.tsx`: carrega `getProjects()` e `getAllTechnologies()` no servidor e
  renderiza `<Suspense fallback={<ProjectGallery … />}><ProjectShowcase … /></Suspense>`;
  `metadata` com `buildMetadata`; `/projects` no sitemap.
