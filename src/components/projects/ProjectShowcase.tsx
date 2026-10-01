'use client'

import { useSyncExternalStore } from 'react'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import type { Project } from '@/content/schemas'
import { parseTechQuery, serializeTechQuery } from '@/lib/technologies'

interface ProjectShowcaseProps {
  projects: Project[]
  technologies: string[]
}

// A URL (`?tech=`) é lida direto de window.location, e não pelo useSearchParams: este exigiria um
// <Suspense>, e a hidratação trocaria o HTML estático inteiro da vitrine (onde está o LCP). No
// servidor e na hidratação, a vitrine sai sem filtro; logo depois, o React só atualiza o que mudou.
const URL_CHANGE = 'projects:url-change'

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(URL_CHANGE, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(URL_CHANGE, onChange)
  }
}

function getSearch() {
  return window.location.search
}

function getServerSearch() {
  return ''
}

export function ProjectShowcase({ projects, technologies }: ProjectShowcaseProps) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)
  const selected = parseTechQuery(new URLSearchParams(search).get('tech'), technologies)

  function updateUrl(next: string[]) {
    const params = new URLSearchParams(window.location.search)
    const tech = serializeTechQuery(next)
    if (tech) params.set('tech', tech)
    else params.delete('tech')
    const query = params.toString()
    const { pathname } = window.location
    // A vírgula fica legível na URL (`react,node.js`), sem virar %2C. O "voltar" desfaz o filtro.
    window.history.pushState(
      null,
      '',
      query ? `${pathname}?${query.replaceAll('%2C', ',')}` : pathname,
    )
    window.dispatchEvent(new Event(URL_CHANGE))
  }

  return (
    <ProjectGallery
      projects={projects}
      technologies={technologies}
      selected={selected}
      onSelectedChange={updateUrl}
    />
  )
}
