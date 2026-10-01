'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import type { Project } from '@/content/schemas'
import { parseTechQuery, serializeTechQuery } from '@/lib/technologies'

interface ProjectShowcaseProps {
  projects: Project[]
  technologies: string[]
}

// Liga a vitrine à URL (`?tech=`). O pushState do navegador é sincronizado pelo Next.js com o
// useSearchParams, e o "voltar" desfaz o filtro.
export function ProjectShowcase({ projects, technologies }: ProjectShowcaseProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selected = parseTechQuery(searchParams.get('tech'), technologies)

  function updateUrl(next: string[]) {
    const params = new URLSearchParams(searchParams.toString())
    const tech = serializeTechQuery(next)
    if (tech) params.set('tech', tech)
    else params.delete('tech')
    const query = params.toString()
    // A vírgula fica legível na URL (`react,node.js`), sem virar %2C.
    window.history.pushState(
      null,
      '',
      query ? `${pathname}?${query.replaceAll('%2C', ',')}` : pathname,
    )
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
