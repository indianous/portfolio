# Etapa 04 — Página inicial e trajetória

**Objetivo:** home que apresenta o desenvolvedor, destaca projetos e leva o visitante a entrar em
contato. Página `/about` com a trajetória profissional.

## 1. Problemas encontrados

- **Conversão.** O estudo de caso mira recrutadores e clientes; a home precisa de chamadas claras
  (ver projetos, baixar currículo, contato) acima da dobra no celular.
- **LCP.** A imagem/título principal define o LCP; usar `next/image` com `priority` e evitar
  animação que atrase a primeira pintura (animações só na etapa 10).
- **Componente de linha do tempo.** O base-ds não exporta Timeline. Montar com `Card`, `Heading`,
  `Text` e `Badge`; se ficar complexo ou repetitivo, abrir issue pedindo o componente.

## 2. Testes a incluir

**`src/components/home/__tests__/Hero.test.tsx`**
- Mostra nome e cargo vindos de `site.ts` em um único `h1`.
- Botões "Ver projetos" (`/projects`) e "Contato" com os destinos corretos.

**`src/components/home/__tests__/FeaturedProjects.test.tsx`**
- Renderiza só projetos com `featured: true`, no máximo 3.
- Cada card tem link para o estudo de caso quando `hasCaseStudy` é verdadeiro.

**`src/components/home/__tests__/LatestPosts.test.tsx`**
- Mostra no máximo 3 posts, do mais recente para o mais antigo, cada um com link para
  `/blog/[slug]`.
- Sem posts publicados, a seção não é renderizada.

**`src/components/about/__tests__/Timeline.test.tsx`**
- Lista experiências da mais recente para a mais antiga, "Atual" quando não há `end`.
- Usa lista semântica (`<ol>`).

## 3. O que entra no projeto

**Componentes**
- `Hero` (`Heading`, `Text`, `Button`, `Avatar`/`Image`).
- `ProjectCard` (`Card`, `Badge`, `Button`), reaproveitado na etapa 05.
- `FeaturedProjects`, `LatestPosts`, `Timeline`.

**Páginas**
- `src/app/page.tsx`: Hero, projetos em destaque e os 3 últimos posts (`getPosts`, da etapa 03),
  com link "Ver todos" para `/blog`.
- `src/app/about/page.tsx`: resumo, trajetória (`getExperience`), tecnologias, link para currículo
  em PDF em `public/`.
