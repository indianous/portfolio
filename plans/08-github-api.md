# Etapa 08 — Integração com a API do GitHub

**Objetivo:** exibir estatísticas de contribuição e repositórios do GitHub.

## 1. Problemas encontrados

Levantados em 2026-10-01, com o base-ds v0.5.2 e o Next.js 16.3.6.

- **"Tempo real" x performance.** Buscar no navegador a cada visita pesa, expõe limite de taxa e
  prejudica o Lighthouse. A busca é no servidor, com revalidação diária (ISR): a página
  continua estática e os dados se atualizam uma vez por dia.
- **Cache de `POST` no Next.js 16.** A API GraphQL usa `POST`, e sem `cacheComponents` o cache do
  `fetch` é opcional: `cache: 'force-cache'` com `next: { revalidate: 86400 }`. A rota passa a
  revalidar uma vez por dia.
- **Repositórios fixados e calendário só existem na API GraphQL** (`user.pinnedItems` e
  `contributionsCollection`), que exige token: `GITHUB_TOKEN` só no servidor (Vercel e o ambiente
  local), nunca com prefixo `NEXT_PUBLIC_`. O usuário vem de `GITHUB_USERNAME` ou do link do GitHub
  em `site.ts`.
- **O perfil não tem repositórios fixados** (hoje `pinnedItems` vem vazio). Decisão do usuário:
  mostrar os fixados; sem nenhum, os 6 públicos atualizados mais recentemente, sem forks. O título
  da seção diz qual dos dois ("Repositórios fixados" ou "Repositórios recentes"). Repositório
  privado nunca aparece.
- **Falha da API não pode derrubar a página.** Sem token, fora do ar, limite estourado ou resposta
  com `errors`: o erro é registrado no log do servidor e a seção some, nunca erro 500 nem build
  quebrado. Com ISR, uma revalidação que falha mantém a última página boa.
- **Gráfico de contribuições.** O base-ds não tem calendário no formato do GitHub, mas o
  `BarChart` (sem biblioteca de gráficos, com tabela oculta para leitores de tela) mostra as
  contribuições por mês dos últimos 12 meses. Não precisa de componente novo nem de issue.
- **Cores de linguagem.** As cores do GitHub por linguagem são valores literais: a linguagem vai
  num `Badge`, sem cor própria.
- **Sem `Suspense`/`Skeleton`.** Com ISR, os dados chegam no build e na revalidação, nunca no
  navegador; não há estado de carregamento para mostrar.
- **base-ds 0.5.2.** Só acrescenta os subpaths `tokens` e `tailwind-preset` (React Native);
  atualizado sem ajustes.

## 2. Testes a incluir

**`src/lib/github/__tests__/client.test.ts`** (`fetch` simulado)

- Sem `GITHUB_TOKEN`, devolve `null` sem chamar a rede.
- Envia a query GraphQL com `Authorization: Bearer <token>`, o usuário nas variáveis e o cache de
  1 dia (`force-cache` + `revalidate: 86400`).
- Usa `GITHUB_USERNAME` quando definido; senão, o usuário do link do GitHub em `site.ts`.
- Resposta com `errors` ou status de erro vira `GitHubApiError`.
- `getGitHubProfile()` devolve `null` e registra o erro quando a API falha.

**`src/lib/github/__tests__/mappers.test.ts`**

- Repositórios: usa os fixados quando existem (`source: 'pinned'`), senão os recentes
  (`source: 'recent'`); ignora privados; no máximo 6; mapeia `name`, `description`, `url`, `stars`
  e `language`.
- Contribuições: total do ano e soma por mês dos últimos 12 meses, do mais recente para o mais
  antigo (pedido do usuário).

**`src/components/github/__tests__/RepoList.test.tsx`**

- Um card por repositório, com o nome como link para o GitHub, descrição, linguagem e estrelas.
- Título conforme a origem (fixados ou recentes).

**`src/components/github/__tests__/ContributionStats.test.tsx`**

- Mostra o total do ano e o gráfico com a tabela acessível (mês e quantidade).

**`src/components/github/__tests__/GitHubSection.test.tsx`**

- Seção com título, link para o perfil, estatísticas e repositórios; sem dados (`null`), não
  renderiza nada.

## 3. O que entra no projeto

**Tipos**

- `src/lib/github/types.ts`: `GitHubRepo`, `ContributionSummary`, `GitHubProfile`.

**BFF**

- `src/lib/github/client.ts` (`server-only`): `fetchGitHubProfile` (GraphQL, uma query com
  fixados, recentes e calendário) e `getGitHubProfile` (nunca lança).
- `src/lib/github/mappers.ts`: `mapRepos`, `mapContributions`.
- `.env.example` com `GITHUB_TOKEN` e `GITHUB_USERNAME`.

**Componentes**

- `src/components/github/`: `ContributionStats` (`BarChart`), `RepoList` (`Card`, `Badge`) e
  `GitHubSection`.

**Páginas**

- Seção GitHub na home e em `/about`.
- **Ambiente:** o usuário cria um token fine-grained (só leitura de dados públicos) e o define na
  Vercel; localmente, `export GITHUB_TOKEN=$(gh auth token)` antes do `npm run dev`.
