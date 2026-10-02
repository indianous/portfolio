import { Badge, Button, Card, Heading, Text } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import type { Project } from '@/content/schemas'

interface ProjectCardProps {
  project: Project
  /** Nível do título: `h3` dentro de uma seção (home), `h2` direto sob o `h1` (vitrine). */
  headingLevel?: 'h2' | 'h3'
}

// O aria-label põe o nome do projeto nos links: em vários cards, "Detalhes" sozinho teria o
// mesmo nome e destinos diferentes. Ele começa pelo texto visível, para o comando de voz achá-lo.
export function ProjectCard({ project, headingLevel = 'h3' }: ProjectCardProps) {
  const { slug, title, summary, technologies, liveUrl } = project

  return (
    <Card
      variant="outlined"
      className="flex h-full flex-col"
      footer={
        <div className="flex flex-wrap gap-2">
          <ButtonLink href={`/projects/${slug}`} size="sm" aria-label={`Detalhes de ${title}`}>
            Detalhes
          </ButtonLink>
          <Button
            as="a"
            href={liveUrl}
            variant="outline"
            size="sm"
            aria-label={`Ver demonstração de ${title}`}
          >
            Ver demonstração
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-3">
        <Heading as={headingLevel} size="xl">
          {title}
        </Heading>
        {/* Resumo em 2 linhas, com reticências, e sempre com a altura delas, para os cards terem o
            mesmo tamanho. O min-h-[2lh] é temporário: sai quando o Text ganhar a prop de linhas
            (indianous/base-ds#62). */}
        <Text color="muted" className="line-clamp-2 min-h-[2lh]">
          {summary}
        </Text>
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
