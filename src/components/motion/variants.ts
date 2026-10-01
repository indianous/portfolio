import type { Transition, Variants } from 'motion/react'

// Valores das animações do site, num lugar só. Só opacity e transform: nada mexe no layout.

/** Entrada: sobe 16px enquanto aparece. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export const revealTransition: Transition = { duration: 0.4, ease: 'easeOut' }

/** Atraso entre itens de uma lista em sequência, com teto para listas longas. */
export function staggerDelay(index: number): number {
  return Math.min(index, 5) * 0.06
}
