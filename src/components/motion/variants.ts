// Valores das animações do site, num lugar só. Só opacity e transform: nada mexe no layout.

/** Estado inicial da entrada: 16px abaixo, invisível. */
export const revealFrom = { opacity: 0, transform: 'translateY(16px)' } as const

export const revealDuration = 0.4

export const revealEase = 'easeOut'

/** Margem do inView: anima quando o elemento passa 10% para dentro da tela. */
export const revealMargin = '0px 0px -10% 0px'

/** Atraso entre itens de uma lista em sequência, com teto para listas longas. */
export function staggerDelay(index: number): number {
  return Math.min(index, 5) * 0.06
}
