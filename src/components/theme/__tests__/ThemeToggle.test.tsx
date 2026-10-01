import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { THEME_STORAGE_KEY } from '@/lib/theme'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

// matchMedia simulado, com um disparador para a mudança de preferência do sistema.
function mockSystemTheme(prefersDark: boolean) {
  const listeners = new Set<(event: { matches: boolean }) => void>()
  const media = {
    matches: prefersDark,
    addEventListener: (_: string, listener: (event: { matches: boolean }) => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: (event: { matches: boolean }) => void) =>
      listeners.delete(listener),
  }
  vi.stubGlobal('matchMedia', () => media)
  return (matches: boolean) => {
    media.matches = matches
    listeners.forEach((listener) => listener({ matches }))
  }
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    mockSystemTheme(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.classList.remove('dark')
  })

  it('descreve o tema de destino', () => {
    const { unmount } = render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Ativar tema escuro' })).toBeInTheDocument()
    unmount()

    document.documentElement.classList.add('dark')
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()
  })

  it('alterna a classe do html e salva a escolha', async () => {
    render(<ThemeToggle />)
    await userEvent.click(screen.getByRole('button', { name: 'Ativar tema escuro' }))
    expect(document.documentElement).toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(await screen.findByRole('button', { name: 'Ativar tema claro' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Ativar tema claro' }))
    expect(document.documentElement).not.toHaveClass('dark')
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('sem escolha salva, acompanha a mudança do sistema', () => {
    const setSystemDark = mockSystemTheme(false)
    render(<ThemeToggle />)
    act(() => setSystemDark(true))
    expect(document.documentElement).toHaveClass('dark')
  })

  it('com escolha salva, ignora a mudança do sistema', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light')
    const setSystemDark = mockSystemTheme(false)
    render(<ThemeToggle />)
    act(() => setSystemDark(true))
    expect(document.documentElement).not.toHaveClass('dark')
  })
})
