# Etapa 10 — Animações

**Objetivo:** animações fluidas com Framer Motion, sem prejudicar performance nem acessibilidade.

> **Revisto na etapa 11:** o Lighthouse mostrou que o núcleo do `LazyMotion`/`m` custava ~0,2 s de
> LCP simulado. O `Reveal` passou a usar só o `inView` e o `animate` do `motion/mini` (+3,4 KB gzip
> em vez de +19,5 KB), com o mesmo comportamento; `MotionProvider` e `features.ts` saíram. Ver
> `plans/11-qualidade-deploy.md`.

## 1. Problemas encontrados

Levantados em 2026-10-01, com `motion` 13.5.0, React 19.2.8 e Next.js 16.3.6.

- **Nome do pacote.** O Framer Motion hoje se chama `motion` (imports de `motion/react` e
  `motion/react-m`). O `AnimateView` novo exige React 19.3 e fica de fora.
- **Peso.** O `motion` completo passa de 30 kB. Com `LazyMotion` + o componente `m`, a página leva
  só o núcleo; os recursos de animação (`domAnimation`) são carregados à parte, por `import()`
  dinâmico, depois da primeira pintura. `strict` faz o `LazyMotion` acusar um `motion.div`
  importado por engano. Medido em 2026-10-01: `/` foi de 634.586 bytes (195.623 gzip) para
  690.057 (215.158 gzip), **+19,5 KB gzip** de núcleo do `m`/`LazyMotion`/`MotionConfig`; o
  `domAnimation` (15 KB gzip) ficou num arquivo à parte, fora da primeira carga. Se o Lighthouse
  da etapa 11 apontar o JS, a alternativa é o `motion/react-mini` (animação via WAAPI, sem o
  componente `m`).
- **Conteúdo invisível no HTML.** O Motion grava o estado inicial (`opacity: 0`) como estilo
  inline já no servidor. Sem JavaScript, o conteúdo nunca apareceria. Uma regra global em
  `globals.css` força o estado final em `[data-reveal]` com `@media (scripting: none)`.
- **Movimento reduzido** (WCAG 2.3.3). A mesma regra vale para `prefers-reduced-motion: reduce`:
  os elementos aparecem já no lugar, sem deslocamento nem fade. Fazer isso por CSS evita erro de
  hidratação (o servidor não sabe da preferência). O `MotionConfig reducedMotion="user"` cobre o
  resto.
- **LCP e CLS.** Nada acima da dobra começa invisível: o Hero (LCP da home) e os cabeçalhos das
  páginas não animam. Só `opacity`/`transform` (sem mexer em layout). A vitrine (`/projects`)
  começa visível, porque os primeiros cards estão acima da dobra: só os cards que entram **ao
  filtrar** animam.
- **Animar componentes do base-ds.** Envolver em `m.*` em vez de alterar o componente. Nada do
  base-ds precisou mudar.
- **Valores das animações** (deslocamento de 16 px, duração, atraso entre itens) não são tokens de
  estilo; ficam centralizados em `src/components/motion/variants.ts`.

## 2. Testes a incluir

**`src/components/motion/__tests__/MotionProvider.test.tsx`**

- Envolve a árvore em `LazyMotion` com `strict`: um `motion.div` dentro dele lança erro.

**`src/components/motion/__tests__/Reveal.test.tsx`**

- Renderiza os filhos no elemento pedido (`div`, `li`), com `data-reveal` e as props repassadas.
- Começa no estado oculto (`opacity: 0`) para entrar ao rolar.

**`src/app/__tests__/globals-css.test.ts`**

- `globals.css` força o estado final de `[data-reveal]` sem JavaScript e com movimento reduzido.

**`src/components/projects/__tests__/ProjectGallery.test.tsx`**

- Os cards da primeira renderização não começam ocultos; os que entram ao filtrar, sim.

## 3. O que entra no projeto

**Dependência**

- `motion`.

**Componentes**

- `src/components/motion/`: `MotionProvider` (client, `LazyMotion` + `MotionConfig`) no layout,
  `features.ts` (carregado sob demanda), `variants.ts` e `Reveal` (entrada ao rolar, com atraso
  opcional para listas em sequência).

**Páginas**

- Projetos em destaque e seções da home abaixo da dobra (GitHub, últimos posts), linha do tempo do
  `/about`, destaques dos estudos de caso e cards que entram ao filtrar a vitrine.
