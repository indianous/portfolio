import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TableOfContents } from '@/components/blog/TableOfContents'

describe('TableOfContents', () => {
  it('lista um link por título, apontando para a âncora', () => {
    render(
      <TableOfContents
        headings={[
          { id: 'problema', text: 'Problema' },
          { id: 'arquitetura', text: 'Arquitetura' },
        ]}
      />,
    )
    const nav = screen.getByRole('navigation', { name: 'Nesta página' })
    expect(within(nav).getByRole('link', { name: 'Problema' })).toHaveAttribute('href', '#problema')
    expect(within(nav).getByRole('link', { name: 'Arquitetura' })).toHaveAttribute(
      'href',
      '#arquitetura',
    )
  })

  it('não renderiza nada sem títulos', () => {
    const { container } = render(<TableOfContents headings={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
