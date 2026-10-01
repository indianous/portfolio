import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Reveal } from '@/components/motion/Reveal'

describe('Reveal', () => {
  it('renderiza os filhos no elemento pedido, marcado com data-reveal', () => {
    render(
      <ul>
        <Reveal as="li" className="classe" aria-label="item">
          conteúdo
        </Reveal>
      </ul>,
    )
    const item = screen.getByRole('listitem', { name: 'item' })
    expect(item).toHaveTextContent('conteúdo')
    expect(item).toHaveAttribute('data-reveal')
    expect(item).toHaveClass('classe')
  })

  it('começa oculto, para entrar ao rolar', () => {
    render(<Reveal>conteúdo</Reveal>)
    expect(screen.getByText('conteúdo')).toHaveStyle({ opacity: '0' })
  })

  it('com animateEntry false, começa visível', () => {
    render(<Reveal animateEntry={false}>conteúdo</Reveal>)
    expect(screen.getByText('conteúdo')).not.toHaveStyle({ opacity: '0' })
  })

  it('só o valor da montagem conta: mudar animateEntry depois não esconde o elemento', () => {
    const { rerender } = render(<Reveal animateEntry={false}>conteúdo</Reveal>)
    rerender(<Reveal animateEntry>conteúdo</Reveal>)
    expect(screen.getByText('conteúdo')).not.toHaveStyle({ opacity: '0' })
  })
})
