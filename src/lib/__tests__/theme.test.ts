import { afterEach, describe, expect, it } from 'vitest'
import { applyTheme, readSavedTheme, resolveTheme, saveTheme, THEME_STORAGE_KEY } from '@/lib/theme'

function storage(values: Record<string, string> = {}): Storage {
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value
    },
  } as Storage
}

const brokenStorage = {
  getItem: () => {
    throw new Error('bloqueado')
  },
  setItem: () => {
    throw new Error('bloqueado')
  },
} as unknown as Storage

describe('resolveTheme', () => {
  it('sem escolha salva, segue o sistema', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('a escolha salva vale mais que o sistema', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})

describe('readSavedTheme', () => {
  it('lê a escolha salva', () => {
    expect(readSavedTheme(storage({ [THEME_STORAGE_KEY]: 'dark' }))).toBe('dark')
  })

  it('devolve null para valor inválido ou ausente', () => {
    expect(readSavedTheme(storage({ [THEME_STORAGE_KEY]: 'roxo' }))).toBeNull()
    expect(readSavedTheme(storage())).toBeNull()
  })

  it('devolve null quando o localStorage lança erro', () => {
    expect(readSavedTheme(brokenStorage)).toBeNull()
  })
})

describe('saveTheme', () => {
  it('salva a escolha', () => {
    const values: Record<string, string> = {}
    saveTheme('light', storage(values))
    expect(values[THEME_STORAGE_KEY]).toBe('light')
  })

  it('não quebra quando o localStorage lança erro', () => {
    expect(() => saveTheme('dark', brokenStorage)).not.toThrow()
  })
})

describe('applyTheme', () => {
  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('liga e desliga a classe dark no html', () => {
    applyTheme('dark')
    expect(document.documentElement).toHaveClass('dark')
    applyTheme('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
