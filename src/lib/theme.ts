export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'theme'
export const DARK_QUERY = '(prefers-color-scheme: dark)'

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

/** A escolha salva vale mais que a preferência do sistema. */
export function resolveTheme(saved: Theme | null, prefersDark: boolean): Theme {
  return saved ?? (prefersDark ? 'dark' : 'light')
}

/** Escolha salva do visitante; `null` sem escolha, com valor inválido ou sem `localStorage`. */
export function readSavedTheme(storage: Storage = window.localStorage): Theme | null {
  try {
    const value = storage.getItem(THEME_STORAGE_KEY)
    return isTheme(value) ? value : null
  } catch {
    return null
  }
}

export function saveTheme(theme: Theme, storage: Storage = window.localStorage): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Sem localStorage (modo privado, bloqueio): o tema vale só nesta visita.
  }
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle('dark', theme === 'dark')
}

/**
 * Script inline do `<head>`: aplica o tema antes da primeira pintura, para a página estática não
 * aparecer clara e depois escurecer. Repete `readSavedTheme` + `resolveTheme` sem imports, porque
 * roda antes do JS do app.
 */
export const themeScript = `(function(){var d=false;try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});d=t==="dark"||(t!=="light"&&matchMedia(${JSON.stringify(DARK_QUERY)}).matches)}catch(e){try{d=matchMedia(${JSON.stringify(
  DARK_QUERY,
)}).matches}catch(e){}}document.documentElement.classList.toggle("dark",d)})()`
