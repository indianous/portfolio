import { Heading, Text } from '@indianous/base-ds'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { getAllTechnologies, getProjects } from '@/content/loaders'
import { buildMetadata } from '@/lib/seo'

const description = 'Aplicações web e projetos open-source, com filtro por tecnologia.'

export const metadata = buildMetadata({ title: 'Projetos', description, path: '/projects' })

export default async function ProjectsPage() {
  const [projects, technologies] = await Promise.all([getProjects(), getAllTechnologies()])

  return (
    <div className="flex flex-col gap-8 py-12">
      <div className="flex flex-col gap-3">
        <Heading as="h1" size="4xl">
          Projetos
        </Heading>
        <Text size="lg" color="muted">
          {description}
        </Text>
      </div>
      <ProjectShowcase projects={projects} technologies={technologies} />
    </div>
  )
}
