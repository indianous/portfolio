# Etapas de implementação

Implementação do portfólio descrito em `estudo_de_caso_portf_lio_de_desenvolvedor_full_stack.md`,
dividida em etapas que podem ser entregues (e commitadas) uma de cada vez. Cada etapa tem um plano
no formato exigido pelo `CLAUDE.md`: problemas encontrados, testes e o que entra no projeto.

| #   | Etapa                                                          | Depende de            |
| --- | -------------------------------------------------------------- | --------------------- |
| 01  | [Fundação do projeto](01-fundacao.md)                          | —                     |
| 02  | [Layout, navegação e SEO base](02-layout-seo.md)               | 01                    |
| 03  | [Camada de conteúdo em Markdown](03-conteudo-markdown.md)      | 01                    |
| 04  | [Página inicial e trajetória](04-home-trajetoria.md)           | 02, 03                |
| 05  | [Vitrine de projetos com filtro](05-vitrine-projetos.md)       | 02, 03                |
| 06  | [Estudos de caso](06-estudos-de-caso.md)                       | 05                    |
| 07  | [Blog](07-blog.md)                                             | 02, 03                |
| 08  | [Integração com a API do GitHub](08-github-api.md)             | 02                    |
| 09  | [Modo claro/escuro](09-modo-escuro.md)                         | 02 + issue no base-ds |
| 10  | [Animações](10-animacoes.md)                                   | 04–08                 |
| 11  | [Performance, acessibilidade e deploy](11-qualidade-deploy.md) | todas                 |

## Achados que afetam várias etapas

Levantados lendo o repositório `indianous/base-ds` (v0.4.7) em 2026-09-28:

1. **O base-ds não tem modo escuro.** `theme.css` e `theme-v4.css` só definem os tokens em `:root`;
   não há `.dark`, `prefers-color-scheme` nem tokens alternativos. O estudo de caso exige
   Dark/Light mode, então a etapa 09 depende da issue [#52](https://github.com/indianous/base-ds/issues/52) (aberta antes da etapa 01, para
   correr em paralelo).
2. **O base-ds inteiro é client-only e vem num bundle único.** O `tsup.config.ts` usa
   `splitting: false` e prefixa `'use client'` em `dist/index.js`, e o `package.json` não declara
   `sideEffects`. Importar só um `Heading` pode levar para o cliente o JS de gráficos, `dnd-kit` e
   `qrcode`. Isso ameaça a meta de 100/100 no Lighthouse. Medido na etapa 01: +949 KB (+252 KB gzip) de JS; issue [#53](https://github.com/indianous/base-ds/issues/53). Se não for resolvida até a etapa 11, é o principal risco para a meta.
3. **Não há backend.** A ordem "tipos → backend → BFF → componentes → páginas" do `CLAUDE.md` fica
   aqui como "tipos → carregadores de conteúdo / BFF (Route Handlers e Server Components) →
   componentes → páginas".
4. **Decisões já tomadas com o usuário:** o blog entra na primeira versão, e o filtro da vitrine
   mostra projetos que têm **qualquer uma** das tecnologias selecionadas. As rotas ficam em
   inglês (`/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`); os textos
   visíveis continuam em português.
5. **`CLAUDE.md` cita `frontend#24`.** No base-ds, o problema do alias `npm:` com o Dependabot é a
   issue [#44](https://github.com/indianous/base-ds/issues/44). Vale corrigir a referência.
