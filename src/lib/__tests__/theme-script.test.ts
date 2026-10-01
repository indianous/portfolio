import { afterEach, describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY, themeScript } from '@/lib/theme'

function run({ saved, prefersDark }: { saved: string | null; prefersDark: boolean }) {
  window.localStorage.clear()
  if (saved !== null) window.localStorage.setItem(THEME_STORAGE_KEY, saved)
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: prefersDark, media: query }))
  new Function(themeScript)()
  return document.documentElement.classList.contains('dark')
}

describe('script inline de tema', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    document.documentElement.classList.remove('dark')
  })

  it.each([
    { saved: null, prefersDark: true, dark: true },
    { saved: null, prefersDark: false, dark: false },
    { saved: 'light', prefersDark: true, dark: false },
    { saved: 'dark', prefersDark: false, dark: true },
    { saved: 'inválido', prefersDark: true, dark: true },
  ])(
    'escolha $saved e sistema escuro $prefersDark → escuro $dark',
    ({ saved, prefersDark, dark }) => {
      expect(run({ saved, prefersDark })).toBe(dark)
    },
  )

  it('não quebra sem localStorage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado')
    })
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    expect(() => new Function(themeScript)()).not.toThrow()
    expect(document.documentElement).toHaveClass('dark')
  })
})
