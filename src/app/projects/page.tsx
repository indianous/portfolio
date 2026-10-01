import { Suspense } from 'react'
import { Heading, Text } from '@indianous/base-ds'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
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
      {/* O fallback (vitrine sem filtro) é o que vai no HTML estático; o filtro da URL entra na
          hidratação, porque o useSearchParams não existe no build. */}
      <Suspense
        fallback={<ProjectGallery projects={projects} technologies={technologies} selected={[]} />}
      >
        <ProjectShowcase projects={projects} technologies={technologies} />
      </Suspense>
    </div>
  )
}
