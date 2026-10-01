import type { ReactNode } from 'react'
import { Badge, Heading, Text } from '@indianous/base-ds'
import { Reveal } from '@/components/motion/Reveal'
import type { Experience } from '@/content/schemas'
import { formatYearMonth } from '@/lib/dates'

interface TimelineItem {
  experience: Experience
  /** Descrição já renderizada (o corpo do arquivo, em Markdown). */
  description: ReactNode
}

interface TimelineProps {
  items: TimelineItem[]
}

function period({ start, end }: Experience) {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Atual'}`
}

// O base-ds não tem linha do tempo: lista ordenada nativa, com a borda marcando o percurso.
export function Timeline({ items }: TimelineProps) {
  const sorted = [...items].sort((a, b) => b.experience.start.localeCompare(a.experience.start))

  return (
    <ol aria-label="Trajetória" className="flex flex-col gap-8 border-l-2 border-border pl-6">
      {sorted.map(({ experience, description }) => (
        <Reveal as="li" key={experience.slug} className="flex flex-col gap-2">
          <Text as="span" size="sm" color="muted">
            {period(experience)}
          </Text>
          <Heading as="h3" size="xl">
            {experience.role}
          </Heading>
          <Text weight="medium">
            {[experience.company, experience.location].filter(Boolean).join(' · ')}
          </Text>
          <div>{description}</div>
          {experience.technologies.length > 0 && (
            <ul
              aria-label={`Tecnologias em ${experience.company}`}
              className="flex flex-wrap gap-2"
            >
              {experience.technologies.map((technology) => (
                <li key={technology}>
                  <Badge size="sm">{technology}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      ))}
    </ol>
  )
}
