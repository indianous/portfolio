# Etapas de implementação

Implementação do portfólio descrito em `estudo_de_caso_portf_lio_de_desenvolvedor_full_stack.md`,
dividida em etapas que podem ser entregues (e commitadas) uma de cada vez. Cada etapa tem um plano
no formato exigido pelo `CLAUDE.md`: problemas encontrados, testes e o que entra no projeto.

| #   | Etapa                                                          | Depende de |
| --- | -------------------------------------------------------------- | ---------- |
| 01  | [Fundação do projeto](01-fundacao.md)                          | —          |
| 02  | [Layout, navegação e SEO base](02-layout-seo.md)               | 01         |
| 03  | [Camada de conteúdo em Markdown](03-conteudo-markdown.md)      | 01         |
| 04  | [Página inicial e trajetória](04-home-trajetoria.md)           | 02, 03     |
| 05  | [Vitrine de projetos com filtro](05-vitrine-projetos.md)       | 02, 03     |
| 06  | [Estudos de caso](06-estudos-de-caso.md)                       | 05         |
| 07  | [Blog](07-blog.md)                                             | 02, 03     |
| 08  | [Integração com a API do GitHub](08-github-api.md)             | 02         |
| 09  | [Modo claro/escuro](09-modo-escuro.md)                         | 02         |
| 10  | [Animações](10-animacoes.md)                                   | 04–08      |
| 11  | [Performance, acessibilidade e deploy](11-qualidade-deploy.md) | todas      |

## Achados que afetam várias etapas

Levantados lendo o repositório `indianous/base-ds` (v0.4.7) em 2026-09-28:

1. ~~**O base-ds não tem modo escuro.**~~ Resolvido na v0.4.10
   ([#52](https://github.com/indianous/base-ds/issues/52)): com a classe `dark` no `<html>`, os
   tokens semânticos trocam para a paleta escura, e o `theme-v4.css` liga o `dark:` do Tailwind a
   essa classe. A etapa 09 não está mais bloqueada.
2. ~~**O base-ds inteiro é client-only e vem num bundle único.**~~ Resolvido na v0.4.11
   ([#53](https://github.com/indianous/base-ds/issues/53)): o build ESM é dividido por componente,
   cada um com seu `'use client'`, e o `package.json` declara `sideEffects`. Medido na etapa 01
   (v0.4.7): +949 KB (+252 KB gzip) de JS. Medido de novo em 2026-10-01 (v0.4.14, Next.js 16.3.6),
   na página `/` com o layout da etapa 02 (`Navbar`, `Footer`, `Container`, `Heading`, `Text`,
   `Button`): 623.690 bytes (191.561 gzip), contra 575.183 (176.150 gzip) da mesma página em HTML
   nativo com `next/link`. O base-ds acrescenta **+48 KB (+15 KB gzip)**. Deixou de ser o principal
   risco para o Lighthouse. Continua valendo: não usar o `Icon` do base-ds, que ainda traz todos os
   ícones do `lucide-react` (~650 KB); importar o ícone do `lucide-react` direto.
3. **Não há backend.** A ordem "tipos → backend → BFF → componentes → páginas" do `CLAUDE.md` fica
   aqui como "tipos → carregadores de conteúdo / BFF (Route Handlers e Server Components) →
   componentes → páginas".
4. **Decisões já tomadas com o usuário:** o blog entra na primeira versão, e o filtro da vitrine
   mostra projetos que têm **qualquer uma** das tecnologias selecionadas. As rotas ficam em
   inglês (`/projects`, `/projects/[slug]`, `/blog`, `/blog/[slug]`, `/about`); os textos
   visíveis continuam em português.
5. **`CLAUDE.md` cita `frontend#24`.** No base-ds, o problema do alias `npm:` com o Dependabot é a
   issue [#44](https://github.com/indianous/base-ds/issues/44). Vale corrigir a referência.
