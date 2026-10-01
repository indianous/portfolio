import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Highlights } from '@/components/case-study/Highlights'

describe('Highlights', () => {
  it('mostra cada destaque com valor e rótulo, em lista', () => {
    render(
      <Highlights
        highlights={[
          { value: '−95%', label: 'de JS' },
          { value: '100', label: 'no Lighthouse' },
        ]}
      />,
    )
    const items = within(screen.getByRole('list', { name: 'Resultados em destaque' })).getAllByRole(
      'listitem',
    )
    expect(items.map((item) => item.textContent)).toEqual(['−95%de JS', '100no Lighthouse'])
  })

  it('não renderiza nada sem destaques', () => {
    const { container } = render(<Highlights highlights={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
