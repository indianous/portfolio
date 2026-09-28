# Etapa 10 — Animações

**Objetivo:** animações fluidas com Framer Motion, sem prejudicar performance nem acessibilidade.

## 1. Problemas encontrados

- **Peso do Framer Motion.** O pacote completo passa de 30 kB. Usar `LazyMotion` com
  `domAnimation` e o componente `m` reduz bastante; medir o JS de primeira carga antes e depois.
- **LCP e CLS.** Nada que esteja acima da dobra pode começar invisível (`opacity: 0`) — isso atrasa
  o LCP. Animar só o que entra na tela ao rolar, e só `opacity`/`transform` (sem mexer em layout).
- **Movimento reduzido.** Respeitar `prefers-reduced-motion` (WCAG 2.3.3).
- **Animar componentes do base-ds.** Envolver em `m.div` em vez de alterar o componente. Se um
  componente precisar de animação própria (ex.: entrada de `Dialog`), isso é assunto do base-ds.

## 2. Testes a incluir

**`src/components/motion/__tests__/Reveal.test.tsx`**
- Com `prefers-reduced-motion: reduce` simulado, renderiza os filhos sem animação.
- Sem a preferência, aplica as props de animação de entrada.

**`src/components/motion/__tests__/MotionProvider.test.tsx`**
- Envolve a árvore em `LazyMotion` com `strict` (impede importar `motion` completo por engano).

## 3. O que entra no projeto

**Dependência**
- `framer-motion` (ou `motion`, o nome atual do pacote).

**Componentes**
- `MotionProvider` (client) no layout.
- `Reveal` (entrada ao rolar) e `Stagger` (lista em sequência), com variantes centralizadas em
  `src/components/motion/variants.ts`.

**Páginas**
- Aplicar em projetos em destaque, cards da vitrine (inclusive ao filtrar), linha do tempo e
  seções da home abaixo da dobra.
