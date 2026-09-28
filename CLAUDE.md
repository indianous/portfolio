# CLAUDE.md

Este arquivo orienta o Claude Code ao trabalhar neste repositório.

@AGENTS.md

## Comandos

- `npm run dev` — servidor de desenvolvimento
- `npm test` — testes (Vitest); `npm run test:watch` em modo observação
- `npm run lint`, `npm run typecheck`, `npm run format:check` — as mesmas checagens da CI
- `npm run build` — build de produção

`npm install` precisa de `GITHUB_PACKAGES_TOKEN` no ambiente (ver seção UI).

Planos de implementação por etapa em `plans/` (índice em `plans/README.md`).

## Projeto

Portfólio interativo de alta performance para um desenvolvedor full-stack: exibe aplicações web, projetos open-source e trajetória profissional, com foco em conversão (recrutadores e clientes) e usabilidade. A especificação completa está em `estudo_de_caso_portf_lio_de_desenvolvedor_full_stack.md` — consulte-a antes de decisões de produto ou arquitetura.

## Stack

- **Framework:** Next.js (React)
- **Estilo:** Tailwind CSS
- **Componentes:** [base-ds](https://github.com/indianous/base-ds) — obrigatório (ver seção UI abaixo)
- **Animações:** Framer Motion
- **Conteúdo:** Markdown (posts do blog e descrições de projetos)
- **Deploy:** Vercel, com CI via GitHub Actions

## Funcionalidades

1. **Vitrine de projetos** com filtro por tecnologia (React, Node.js, Python etc.) e links para repositório e live preview.
2. **Dark/Light mode** nativo via Tailwind.
3. **Estudos de caso** — uma página por aplicação principal (problema, arquitetura, resultados).
4. **Integração com a API do GitHub** — estatísticas de contribuição e repositórios pinados.

## Requisitos não negociáveis

- **Performance e acessibilidade:** meta de 100/100 no Lighthouse em ambas. Evite dependências pesadas, otimize imagens e fontes, prefira renderização estática quando possível.
- **Mobile-first:** estilize primeiro para telas pequenas e expanda com breakpoints.
- **SEO:** metadados, HTML semântico e URLs legíveis em todas as páginas.
- **Conteúdo desacoplado do código:** adicionar ou editar projetos, tecnologias e artigos deve exigir apenas alterar arquivos Markdown, nunca componentes.
- **Arquitetura orientada a componentes:** componentes pequenos, reutilizáveis e sem conteúdo fixo no código.

### UI — `base-ds` é obrigatório

Sempre usar os componentes fornecidos pela biblioteca.
Só usar elemento HTML nativo quando genuinamente não houver equivalente no base-ds — avisar antes.

Se a aplicação precisar de uma alteração em um componente existente do `base-ds` ou de um componente novo, abrir uma issue no repositório `indianous/base-ds` (GitHub) descrevendo a necessidade — antes de implementar workaround local.

- A UI vem do `base-ds`, instalado do GitHub Packages pelo **nome com escopo**
  (`"@indianous/base-ds": "^<versão>"`, imports `from '@indianous/base-ds'`, `.npmrc` apontando
  `@indianous` para `https://npm.pkg.github.com`). Nada de alias `npm:` (o Dependabot não o resolve,
  frontend#24) nem de `file:../base-ds` (symlink: causa duas instâncias de React). O teste
  `__tests__/base-ds-dependency.test.ts` barra os dois. `npm install` precisa de
  `GITHUB_PACKAGES_TOKEN` no ambiente (`export GITHUB_PACKAGES_TOKEN=$(gh auth token)`).
- Antes de criar um componente de UI, conferir o que o base-ds exporta em
  `node_modules/@indianous/base-ds/dist/index.d.ts` e seguir as regras de
  `node_modules/@indianous/base-ds/README.md`.
- Estilizar só com os utilitários dos tokens do base-ds, sem valores literais.
- Faltou algo ou achou bug no base-ds: abrir issue em indianous/base-ds em vez de contornar no app.
- O Dependabot do frontend abre, toda semana, o PR de versão nova do `@indianous/base-ds`. Ao começar
  uma tarefa de UI, rodar `npm outdated @indianous/base-ds` mesmo assim; se estiver atrás, ler
  https://github.com/indianous/base-ds/blob/main/CHANGELOG.md e atualizar conforme o README
  do base-ds.

### Verificação visual

Toda verificação visual da aplicação (abrir no navegador, conferir layout, clicar em fluxos) é feita pelo usuário — não pela Claude.
Não usar a extensão do Chrome (`claude-in-chrome`) pra isso. Preparar o ambiente (subir serviços, aplicar migrations, configurar `.env`) é papel da Claude; testar visualmente é papel do usuário.

### TDD

- Testes **antes** da implementação, sempre
- Plano obrigatório em 3 seções antes de qualquer implementação:
  1. Problemas encontrados (arquivo, linha, diagnóstico)
  2. Testes a incluir/alterar (agrupados por arquivo)
  3. O que entra no projeto (tipos → backend → BFF → componentes → páginas)

## Idioma

Conteúdo do site, mensagens de commit e documentação em português. Rotas (URLs) em inglês:
`/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`.
