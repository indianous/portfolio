// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { countReadingMinutes, formatReadingTime } from '@/lib/readingTime'

const words = (n: number) => Array.from({ length: n }, () => 'palavra').join(' ')

describe('countReadingMinutes', () => {
  it('conta 200 palavras por minuto, arredondando para cima', () => {
    expect(countReadingMinutes(words(200))).toBe(1)
    expect(countReadingMinutes(words(401))).toBe(3)
  })

  it('nunca devolve 0', () => {
    expect(countReadingMinutes('')).toBe(1)
  })

  it('ignora a sintaxe do Markdown que não é texto', () => {
    const markdown = [
      '## Título',
      '',
      '[link](https://exemplo.dev/um/caminho/bem/longo)',
      '',
      '```ts',
      'const código = 1',
      '```',
    ].join('\n')
    // "Título", "link", "const", "código", "=", "1"
    expect(countReadingMinutes(markdown)).toBe(1)
    expect(countReadingMinutes(`${markdown}\n\n${words(195)}`)).toBe(2)
  })
})

describe('formatReadingTime', () => {
  it('escreve os minutos de leitura', () => {
    expect(formatReadingTime(3)).toBe('3 min de leitura')
  })
})
