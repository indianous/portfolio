import { Card, Text } from '@indianous/base-ds'
import type { Project } from '@/content/schemas'

interface HighlightsProps {
  highlights: NonNullable<Project['highlights']>
}

export function Highlights({ highlights }: HighlightsProps) {
  if (highlights.length === 0) return null

  return (
    <ul aria-label="Resultados em destaque" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {highlights.map(({ value, label }) => (
        <li key={`${value}-${label}`}>
          <Card variant="outlined" className="h-full">
            <Text as="span" size="lg" weight="bold" className="block text-primary">
              {value}
            </Text>
            <Text as="span" size="sm" color="muted" className="block">
              {label}
            </Text>
          </Card>
        </li>
      ))}
    </ul>
  )
}
