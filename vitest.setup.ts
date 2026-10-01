import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Sem `globals: true`, o Testing Library não registra a limpeza do DOM sozinho.
afterEach(() => {
  cleanup()
})

// O jsdom não tem matchMedia. Padrão: sistema em tema claro, sem mudanças. Os testes que precisam
// de outro valor o substituem com vi.stubGlobal.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
