'use client'

import { Button, Text } from '@indianous/base-ds'
import { ProjectCard } from '@/components/projects/ProjectCard'
import type { Project } from '@/content/schemas'
import { filterProjects } from '@/lib/technologies'

interface ProjectGalleryProps {
  projects: Project[]
  technologies: string[]
  selected: string[]
  /** Sem ele (o fallback estático), os botões só aparecem, até a hidratação. */
  onSelectedChange?: (selected: string[]) => void
}

const orList = new Intl.ListFormat('pt-BR', { type: 'disjunction' })

function resultMessage(count: number, selected: string[]) {
  const projects = `${count} ${count === 1 ? 'projeto' : 'projetos'}`
  return selected.length > 0 ? `${projects} com ${orList.format(selected)}` : projects
}

// O base-ds não tem grupo de botões de alternar: grupo nativo com Buttons e aria-pressed.
export function ProjectGallery({
  projects,
  technologies,
  selected,
  onSelectedChange,
}: ProjectGalleryProps) {
  const visible = filterProjects(projects, selected)

  function toggle(technology: string) {
    onSelectedChange?.(
      selected.includes(technology)
        ? selected.filter((item) => item !== technology)
        : [...selected, technology],
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Text as="span" id="filtro-tecnologia" weight="medium">
          Filtrar por tecnologia
        </Text>
        <div role="group" aria-labelledby="filtro-tecnologia" className="flex flex-wrap gap-2">
          {technologies.map((technology) => {
            const pressed = selected.includes(technology)
            return (
              <Button
                key={technology}
                size="sm"
                variant={pressed ? 'primary' : 'outline'}
                aria-pressed={pressed}
                onClick={() => toggle(technology)}
              >
                {technology}
              </Button>
            )
          })}
          {selected.length > 0 && (
            <Button size="sm" variant="ghost" onClick={() => onSelectedChange?.([])}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      <Text role="status" color="muted">
        {resultMessage(visible.length, selected)}
      </Text>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </div>
  )
}
