import { Badge, Breadcrumb, Button, Heading, Image, Text } from '@indianous/base-ds'
import type { Project } from '@/content/schemas'

interface CaseStudyHeaderProps {
  project: Project
}

// A trilha usa href puro até o Breadcrumb aceitar linkComponent (indianous/base-ds#61).
export function CaseStudyHeader({ project }: CaseStudyHeaderProps) {
  const { title, summary, technologies, repoUrl, liveUrl, cover, coverAlt } = project

  return (
    <header className="flex flex-col gap-6">
      <Breadcrumb
        label="Trilha de navegação"
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
        {(repoUrl || liveUrl) && (
          <div className="flex flex-wrap gap-3">
            {repoUrl && (
              <Button as="a" href={repoUrl} variant="outline">
                Repositório
              </Button>
            )}
            {liveUrl && (
              <Button as="a" href={liveUrl} variant="ghost">
                Ver online
              </Button>
            )}
          </div>
        )}
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
