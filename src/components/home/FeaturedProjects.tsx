import { Heading } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import { ProjectCard } from '@/components/projects/ProjectCard'
import type { Project } from '@/content/schemas'

const MAX_FEATURED = 3

interface FeaturedProjectsProps {
  projects: Project[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const featured = projects.filter((project) => project.featured).slice(0, MAX_FEATURED)
  if (featured.length === 0) return null

  return (
    <section aria-labelledby="projetos-em-destaque" className="flex flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h2" size="2xl" id="projetos-em-destaque">
          Projetos em destaque
        </Heading>
        <ButtonLink href="/projects" variant="ghost" aria-label="Ver todos os projetos">
          Ver todos
        </ButtonLink>
      </div>
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((project) => (
          <li key={project.slug}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
    </section>
  )
}
