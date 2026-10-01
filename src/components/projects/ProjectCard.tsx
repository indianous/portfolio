import { Badge, Button, Card, Heading, Text } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import type { Project } from '@/content/schemas'

interface ProjectCardProps {
  project: Project
}

// O aria-label põe o nome do projeto nos links: em vários cards, "Repositório" sozinho teria o
// mesmo nome e destinos diferentes. Ele começa pelo texto visível, para o comando de voz achá-lo.
export function ProjectCard({ project }: ProjectCardProps) {
  const { slug, title, summary, technologies, repoUrl, liveUrl, hasCaseStudy } = project
  const hasLinks = hasCaseStudy || repoUrl || liveUrl

  return (
    <Card
      variant="outlined"
      className="flex h-full flex-col"
      footer={
        hasLinks ? (
          <div className="flex flex-wrap gap-2">
            {hasCaseStudy && (
              <ButtonLink
                href={`/projects/${slug}`}
                size="sm"
                aria-label={`Estudo de caso de ${title}`}
              >
                Estudo de caso
              </ButtonLink>
            )}
            {repoUrl && (
              <Button
                as="a"
                href={repoUrl}
                variant="outline"
                size="sm"
                aria-label={`Repositório de ${title}`}
              >
                Repositório
              </Button>
            )}
            {liveUrl && (
              <Button
                as="a"
                href={liveUrl}
                variant="ghost"
                size="sm"
                aria-label={`Ver ${title} online`}
              >
                Ver online
              </Button>
            )}
          </div>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-3">
        <Heading as="h3" size="xl">
          {title}
        </Heading>
        <Text color="muted">{summary}</Text>
        <ul aria-label="Tecnologias" className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li key={technology}>
              <Badge size="sm">{technology}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
