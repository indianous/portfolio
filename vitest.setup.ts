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

// O jsdom não tem IntersectionObserver (usado pelo whileInView do Motion). Este nunca dispara: os
// elementos se comportam como se ainda estivessem fora da tela.
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  window.IntersectionObserver = class {
    readonly root = null
    readonly rootMargin = ''
    readonly thresholds = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  } as unknown as typeof IntersectionObserver
}
