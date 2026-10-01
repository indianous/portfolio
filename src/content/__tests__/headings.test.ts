import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { extractHeadings } from '@/content/headings'
import { renderMarkdown } from '@/content/markdown'

const markdown = [
  '## Problema',
  '',
  'Texto.',
  '',
  '### Subtítulo fora do índice',
  '',
  '## Arquitetura do `app` e decisões',
  '',
  '## Problema',
].join('\n')

describe('extractHeadings', () => {
  it('devolve os h2 com texto e id', () => {
    expect(extractHeadings(markdown)).toEqual([
      { id: 'problema', text: 'Problema' },
      { id: 'arquitetura-do-app-e-decisões', text: 'Arquitetura do app e decisões' },
      { id: 'problema-1', text: 'Problema' },
    ])
  })

  it('gera os mesmos ids que o renderMarkdown', async () => {
    const { container } = render(await renderMarkdown(markdown))
    const ids = [...container.querySelectorAll('h2')].map((h) => h.id)
    expect(extractHeadings(markdown).map((h) => h.id)).toEqual(ids)
  })
})
