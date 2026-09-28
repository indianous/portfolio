# Etapa 05 — Vitrine de projetos com filtro

**Objetivo:** página `/projects` com todos os projetos e filtro por tecnologia (React, Node.js,
Python etc.), com links para repositório e live preview.

## 1. Problemas encontrados

- **Qual componente de filtro.** O base-ds tem `FilterDropdown`, `MultiSelect` e `Badge`. Conferir
  em `dist/index.d.ts` qual cobre seleção múltipla com contagem; preferir o `FilterDropdown`
  (feito para isso, issue #29 do base-ds).
- **Filtro compartilhável.** Guardar o filtro na URL (`?tech=react,node`) para o link poder ser
  enviado a um recrutador, e para o botão "voltar" funcionar.
- **Página estática com filtro no cliente.** A lista é gerada no build; só o filtro roda no
  cliente, sobre dados já serializados. Nada de buscar conteúdo no cliente.

## 2. Testes a incluir

**`src/lib/__tests__/filterProjects.test.ts`**

- Sem tecnologias selecionadas, devolve todos.
- Com várias, devolve projetos que têm **qualquer uma** delas (união, decidido com o usuário).
- Um projeto que tem duas das tecnologias selecionadas aparece uma vez só.
- Comparação sem diferenciar maiúsculas (`react` = `React`).

**`src/lib/__tests__/techQuery.test.ts`**

- `parseTechQuery('react,node')` → `['react', 'node']`; ignora vazios e desconhecidos.
- `serializeTechQuery([])` remove o parâmetro.

**`src/components/projects/__tests__/ProjectGallery.test.tsx`**

- Selecionar uma tecnologia atualiza a lista e a URL.
- Estado vazio mostra mensagem e botão "Limpar filtros".
- A contagem de resultados é anunciada em região `aria-live`.

**`src/components/projects/__tests__/ProjectCard.test.tsx`**

- Links "Código" e "Demo" só aparecem quando `repoUrl`/`liveUrl` existem; abrem em nova aba com
  `rel="noopener noreferrer"` e rótulo acessível que cita o projeto.

## 3. O que entra no projeto

**Tipos / BFF**

- `src/lib/filterProjects.ts`, `src/lib/techQuery.ts` (funções puras).

**Componentes**

- `ProjectGallery` (client): filtro + grade de `ProjectCard`.
- `ProjectCard` (da etapa 04) com links de repositório e demo.

**Páginas**

- `src/app/projects/page.tsx`: carrega `getProjects()` e `getAllTechnologies()` no servidor,
  passa para `ProjectGallery`, `metadata` própria, rota no sitemap.
