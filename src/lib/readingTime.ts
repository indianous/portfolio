const WORDS_PER_MINUTE = 200

// Tira do Markdown o que não é lido: cercas de código, marcadores de título e de lista, URLs de
// links e imagens e os símbolos de ênfase.
function plainText(markdown: string): string {
  return markdown
    .replace(/^\s*(```|~~~).*$/gm, ' ')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|[-*+]|\d+\.|>)\s+/gm, '')
    .replace(/[`*_~|]/g, ' ')
}

/** Minutos de leitura, a 200 palavras por minuto, arredondados para cima e nunca 0. */
export function countReadingMinutes(markdown: string): number {
  const words = plainText(markdown).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min de leitura`
}
