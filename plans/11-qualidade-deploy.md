# Etapa 11 — Performance, acessibilidade e deploy

**Objetivo:** garantir 100/100 no Lighthouse em performance e acessibilidade, e publicar na
Vercel com integração contínua.

## 1. Problemas encontrados

- **Meta sem verificação automática.** Sem Lighthouse na CI, a nota cai sem ninguém perceber.
- **Peso do base-ds:** resolvido na v0.4.11 (+949 KB → +48 KB de JS na página `/`; ver o achado 2
  em `plans/README.md`). Medir de novo aqui, com as páginas finais, e não usar o `Icon` do base-ds.
- **Acessibilidade só por teste unitário não basta.** Rodar `axe` nas páginas renderizadas.
- **Segredos.** `GITHUB_PACKAGES_TOKEN` (instalar o base-ds no build) e `GITHUB_TOKEN` (etapa 08)
  precisam existir na Vercel e na CI.

## 2. Testes a incluir

**`__tests__/a11y/pages.test.tsx`** (`jest-axe`, como no base-ds)

- Home, `/projects`, um estudo de caso, `/blog`, um post e `/about` sem violações.

**`lighthouserc.json`** (Lighthouse CI)

- Asserções: `performance`, `accessibility`, `seo` e `best-practices` ≥ 1.0 (100) no perfil
  móvel, nas mesmas páginas acima.

**`__tests__/headers.test.ts`**

- `next.config` define cabeçalhos de segurança (`Content-Security-Policy`,
  `X-Content-Type-Options`, `Referrer-Policy`).

## 3. O que entra no projeto

**Configuração**

- `next.config.ts`: cabeçalhos de segurança, formatos de imagem AVIF/WebP.
- Revisão final: fontes com `display: swap` e subset, imagens com dimensões, nenhum client
  component desnecessário.

**CI / deploy**

- `.github/workflows/lighthouse.yml`: build e Lighthouse CI a cada PR, com falha abaixo de 100.
- Projeto na Vercel ligado ao repositório: preview por PR e produção na `main`.
  Criar o projeto, os segredos e o domínio é feito pelo usuário; o repositório fica pronto
  (`vercel.json` se necessário, `.env.example` completo, instruções no README).
- `README.md` do projeto: como rodar, variáveis de ambiente, como adicionar conteúdo.

**Checklist de lançamento**

- Pelo menos 1 post publicado (sem `draft`) e os posts de exemplo removidos (etapa 07).
- Projetos e trajetória de exemplo trocados pelo conteúdo real.
