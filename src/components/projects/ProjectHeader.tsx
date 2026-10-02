import { Badge, Breadcrumb, Button, Heading, Image, Text } from '@indianous/base-ds'
import { AppLink } from '@/components/AppLink'
import type { Project } from '@/content/schemas'

interface ProjectHeaderProps {
  project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const { title, summary, technologies, liveUrl, cover, coverAlt } = project

  return (
    <header className="flex flex-col gap-6">
      <Breadcrumb
        label="Trilha de navegação"
        linkComponent={AppLink}
        items={[{ label: 'Projetos', href: '/projects' }, { label: title }]}
      />
      <div className="flex flex-col gap-4">
        <Heading as="h1" size="4xl">
          {title}
        </Heading>
        <Text size="lg" color="muted">
          {summary}
        </Text>
        <ul aria-label="Tecnologias" className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>
        <div>
          <Button as="a" href={liveUrl}>
            Ver demonstração
          </Button>
        </div>
      </div>
      {cover && (
        <Image
          src={cover}
          alt={coverAlt ?? ''}
          aspectRatio="video"
          priority
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="rounded-lg"
        />
      )}
    </header>
  )
}
