import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MotionProvider } from '@/components/motion/MotionProvider'
import { Reveal } from '@/components/motion/Reveal'

describe('Reveal', () => {
  it('renderiza os filhos no elemento pedido, marcado com data-reveal', () => {
    render(
      <MotionProvider>
        <ul>
          <Reveal as="li" className="classe" aria-label="item">
            conteúdo
          </Reveal>
        </ul>
      </MotionProvider>,
    )
    const item = screen.getByRole('listitem', { name: 'item' })
    expect(item).toHaveTextContent('conteúdo')
    expect(item).toHaveAttribute('data-reveal')
    expect(item).toHaveClass('classe')
  })

  it('começa oculto, para entrar ao rolar', () => {
    render(
      <MotionProvider>
        <Reveal>conteúdo</Reveal>
      </MotionProvider>,
    )
    expect(screen.getByText('conteúdo')).toHaveStyle({ opacity: '0' })
  })
})
