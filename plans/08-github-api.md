# Etapa 08 — Integração com a API do GitHub

**Objetivo:** exibir estatísticas de contribuição e repositórios pinados do GitHub.

## 1. Problemas encontrados

- **"Tempo real" x performance.** Buscar no navegador a cada visita pesa, expõe limite de taxa e
  prejudica o Lighthouse. Buscar no servidor com revalidação (ISR, ex.: a cada 1 h) entrega dados
  quase em tempo real com página estática.
- **Repositórios pinados só existem na API GraphQL** (`user.pinnedItems`), assim como o calendário
  de contribuições (`contributionsCollection`). A GraphQL exige token → `GITHUB_TOKEN` só no
  servidor (Vercel), nunca exposto ao cliente.
- **Falha da API não pode derrubar a página.** Sem token, fora do ar ou limite estourado: mostrar
  o último dado em cache ou esconder a seção, nunca erro 500.
- **Gráfico de contribuições.** Conferir se algum gráfico do base-ds serve (`BarChart`) ou se o
  calendário no formato do GitHub precisa de um componente novo → issue no base-ds.

## 2. Testes a incluir

**`src/lib/github/__tests__/client.test.ts`** (com `fetch` simulado)

- Envia a query GraphQL com `Authorization: Bearer <token>`.
- Resposta com `errors` vira erro tipado.
- Sem `GITHUB_TOKEN`, devolve `null` sem chamar a rede.

**`src/lib/github/__tests__/mappers.test.ts`**

- Converte `pinnedItems` em `PinnedRepo` (`name`, `description`, `url`, `stars`, `language`).
- Soma o total de contribuições do ano e mapeia as semanas.

**`src/components/github/__tests__/PinnedRepos.test.tsx`**

- Renderiza um card por repositório com link externo.
- Com lista vazia/`null`, não renderiza a seção.

**`src/components/github/__tests__/ContributionStats.test.tsx`**

- Mostra total do ano e o gráfico com descrição textual acessível.

## 3. O que entra no projeto

**Tipos**

- `src/lib/github/types.ts`: `PinnedRepo`, `ContributionSummary`.

**BFF**

- `src/lib/github/client.ts` (`server-only`): GraphQL com `fetch(..., { next: { revalidate: 3600 } })`.
- `src/lib/github/mappers.ts`.
- `.env.example` com `GITHUB_TOKEN` e `GITHUB_USERNAME`.

**Componentes**

- `PinnedRepos` (`Card`, `Badge`), `ContributionStats`.
- Seções dentro de `<Suspense>` com `Skeleton` do base-ds como fallback.

**Páginas**

- Seção GitHub na home e em `/about`.
- **Ambiente:** o usuário cria o token (leitura pública) e o define no `.env.local` e na Vercel.
