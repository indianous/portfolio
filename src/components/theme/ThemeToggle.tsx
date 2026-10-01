'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Button } from '@indianous/base-ds'
import { MoonIcon, SunIcon } from 'lucide-react'
import {
  applyTheme,
  DARK_QUERY,
  readSavedTheme,
  resolveTheme,
  saveTheme,
  type Theme,
} from '@/lib/theme'

// O tema vive na classe do <html> (aplicada pelo script do <head>). O botão a observa, em vez de
// guardar estado próprio, para não divergir dela nem dar erro de hidratação.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// No servidor (e na hidratação), claro; logo depois, o tema real.
function getServerTheme(): Theme {
  return 'light'
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme)
  const next: Theme = theme === 'dark' ? 'light' : 'dark'

  // Sem escolha salva, acompanha o sistema se ele mudar com a página aberta.
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    function onSystemChange(event: { matches: boolean }) {
      if (readSavedTheme() === null) applyTheme(resolveTheme(null, event.matches))
    }
    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  function toggle() {
    applyTheme(next)
    saveTheme(next)
  }

  return (
    <Button
      variant="ghost"
      iconOnly
      onClick={toggle}
      aria-label={next === 'dark' ? 'Ativar tema escuro' : 'Ativar tema claro'}
    >
      {theme === 'dark' ? (
        <SunIcon className="size-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="size-5" aria-hidden="true" />
      )}
    </Button>
  )
}
