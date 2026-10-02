import { Text } from '@indianous/base-ds'
import type { TocHeading } from '@/content/headings'

interface TableOfContentsProps {
  headings: TocHeading[]
}

// Âncoras na mesma página: <a> nativo (o base-ds não tem link de texto, e não há navegação).
export function TableOfContents({ headings }: TableOfContentsProps) {
  if (headings.length === 0) return null

  return (
    <nav aria-labelledby="nesta-pagina" className="flex flex-col gap-2">
      <Text as="span" id="nesta-pagina" size="sm" weight="semibold">
        Nesta página
      </Text>
      <ul className="flex flex-col gap-1">
        {headings.map(({ id, text }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="text-sm text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
