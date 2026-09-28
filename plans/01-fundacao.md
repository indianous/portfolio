# Etapa 01 — Fundação do projeto

**Objetivo:** projeto Next.js rodando, com base-ds instalado do jeito certo, testes e CI
funcionando, antes de qualquer tela.

## 1. Problemas encontrados

- **Repositório vazio.** Só há `CLAUDE.md` e o estudo de caso. Não há `package.json`, testes nem CI.
- **`CLAUDE.md` exige `__tests__/base-ds-dependency.test.ts`**, que ainda não existe. Sem ele,
  nada impede instalar o base-ds por alias `npm:` ou por `file:../base-ds`.
- **base-ds client-only e em bundle único** (`tsup.config.ts`: `splitting: false`, `'use client'`
  prefixado; `package.json` sem `sideEffects`). Risco para o Lighthouse; precisa ser medido agora,
  enquanto trocar de estratégia ainda é barato.
- **base-ds sem modo escuro** (`src/styles/theme*.css` só têm `:root`). Bloqueia a etapa 09.
- **Versão do Tailwind.** O base-ds suporta v3 e v4. O Next.js atual gera projetos com v4, que usa
  `@import '@indianous/base-ds/styles/v4'` e `@source` apontando para
  `node_modules/@indianous/base-ds`.

## 2. Testes a incluir

**`__tests__/base-ds-dependency.test.ts`**
- `package.json` declara `@indianous/base-ds` em `dependencies` com faixa semver (`^x.y.z`).
- Nenhuma dependência usa alias `npm:@indianous/base-ds`.
- Nenhuma dependência aponta para `file:` ou `link:` do base-ds.
- `.npmrc` mapeia `@indianous:registry` para `https://npm.pkg.github.com` e lê o token de
  `${GITHUB_PACKAGES_TOKEN}` (sem token literal).

**`__tests__/smoke.test.tsx`**
- Um componente do base-ds (`Button`) renderiza no ambiente de teste (confirma React único e
  configuração do Vitest).

## 3. O que entra no projeto

**Tipos / configuração**
- `create-next-app` com TypeScript, App Router, Tailwind v4, ESLint, diretório `src/`.
- Branch `main` e remoto `origin` (`https://github.com/indianous/portfolio.git`) já configurados.
- `.npmrc` conforme o README do base-ds; `npm install @indianous/base-ds@^0.4.7`.
- `src/app/globals.css`: `@import '@indianous/base-ds/styles/v4'` e `@source` do pacote.
- Vitest + Testing Library + jsdom; scripts `test`, `lint`, `typecheck`.
- Prettier alinhado ao do base-ds.

**CI**
- `.github/workflows/ci.yml`: `npm ci` (com `GITHUB_PACKAGES_TOKEN` como segredo), lint,
  typecheck, testes e build em cada push e PR.
- `.github/dependabot.yml` conforme o README do base-ds; o segredo `GH_PACKAGES_TOKEN` do Dependabot
  é criado pelo usuário.

**Medição do base-ds**
- Página provisória que importa só `Heading` e `Button`; `next build` e anotar o JS de primeira
  carga. Se o bundle trouxer código não usado, abrir issue em indianous/base-ds pedindo
  `"sideEffects": false` e/ou code splitting por componente.

**Issues no base-ds**
- ~~Abrir issue pedindo suporte a tema escuro nos tokens~~ — aberta: [indianous/base-ds#52](https://github.com/indianous/base-ds/issues/52) (necessária na etapa 09).

## Pronto quando

`npm test`, `npm run lint`, `npm run typecheck` e `npm run build` passam localmente e na CI, e as
issues necessárias foram abertas.
