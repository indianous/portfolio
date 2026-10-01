# Portfólio

Portfólio de João Victor do Nascimento, desenvolvedor full-stack: projetos com estudos de caso,
blog, trajetória e atividade no GitHub. Next.js com renderização estática, componentes do
[base-ds](https://github.com/indianous/base-ds) e conteúdo em Markdown.

## Rodando localmente

Requisitos: Node.js 22 e um token clássico do GitHub com `read:packages`, para instalar o
`@indianous/base-ds` do GitHub Packages (ver `.npmrc`).

```sh
export GITHUB_PACKAGES_TOKEN=$(gh auth token)   # ou um token clássico com read:packages
npm install
npm run dev
```

Para ver a seção "No GitHub", exporte também `GITHUB_TOKEN` antes do `npm run dev`
(localmente, `export GITHUB_TOKEN=$(gh auth token)` serve).

| Comando                | O que faz                                           |
| ---------------------- | --------------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento                         |
| `npm test`             | Testes (Vitest); `npm run test:watch` em observação |
| `npm run lint`         | ESLint                                              |
| `npm run typecheck`    | Tipos (gera os tipos de rota do Next.js antes)      |
| `npm run format:check` | Prettier                                            |
| `npm run build`        | Build de produção                                   |

## Variáveis de ambiente

Todas opcionais; os valores e comentários estão em `.env.example`.

| Variável                | Para quê                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | URL pública (canonical, Open Graph, sitemap). Na Vercel, sem ela, usa o domínio de produção. |
| `LINKEDIN_URL`          | Link do LinkedIn no rodapé e destino do botão "Contato" sem e-mail.                          |
| `CONTACT_EMAIL`         | E-mail do rodapé e do botão "Contato".                                                       |
| `GITHUB_TOKEN`          | Token fine-grained, só leitura de dados públicos. Sem ele, a seção do GitHub não aparece.    |
| `GITHUB_USERNAME`       | Usuário do GitHub; sem valor, usa o do link em `src/config/site.ts`.                         |
| `GITHUB_PACKAGES_TOKEN` | Só na instalação (`npm install`/`npm ci`), não no `.env`.                                    |

## Conteúdo

Projetos, estudos de caso, posts, trajetória e o texto de apresentação ficam em `content/`, em
Markdown. Adicionar ou editar conteúdo não exige mexer em componentes. Os campos de cada tipo estão
em [`content/README.md`](content/README.md); um frontmatter inválido falha os testes e o build,
dizendo o arquivo e o campo.

## Qualidade

- **CI** (`.github/workflows/ci.yml`): formatação, lint, tipos, testes e build em cada push e PR.
- **Lighthouse** (`.github/workflows/lighthouse.yml` + `lighthouserc.json`): perfil móvel, melhor de 3 rodadas nas páginas principais. Falha abaixo de 100 em acessibilidade, boas práticas e SEO,
  e abaixo de 98 em performance (a simulação do Lighthouse oscila 98–100 nos runners do GitHub). Os relatórios ficam como artefato da execução.
- **Acessibilidade**: `axe` nas páginas renderizadas (`__tests__/a11y/pages.test.tsx`).
- **Cabeçalhos de segurança** (CSP e outros) em `next.config.ts`.

Os dois workflows precisam do segredo de Actions `GH_PACKAGES_TOKEN` (token clássico com
`read:packages`).

## Deploy na Vercel

1. Importe o repositório na Vercel (o framework Next.js é detectado sozinho). Cada PR ganha um
   preview, e a `main` vai para produção.
2. Em _Settings → Environment Variables_, defina:
   - `GITHUB_PACKAGES_TOKEN`: token clássico com `read:packages` (necessário para o `npm install`
     do build);
   - `GITHUB_TOKEN`: token fine-grained, só leitura de dados públicos (seção do GitHub, atualizada
     a cada hora);
   - opcionais: `NEXT_PUBLIC_SITE_URL` (com domínio próprio), `LINKEDIN_URL`, `CONTACT_EMAIL`.
3. Com domínio próprio, configure-o em _Settings → Domains_ e defina `NEXT_PUBLIC_SITE_URL`.

## Planos

O passo a passo da implementação, etapa por etapa, está em [`plans/`](plans/README.md).
