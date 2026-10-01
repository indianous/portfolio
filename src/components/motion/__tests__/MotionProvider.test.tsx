import { render, screen } from '@testing-library/react'
import { motion } from 'motion/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MotionProvider } from '@/components/motion/MotionProvider'

describe('MotionProvider', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renderiza os filhos', () => {
    render(
      <MotionProvider>
        <p>conteúdo</p>
      </MotionProvider>,
    )
    expect(screen.getByText('conteúdo')).toBeInTheDocument()
  })

  it('acusa o motion completo importado por engano (LazyMotion strict)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <MotionProvider>
          <motion.div>pesado</motion.div>
        </MotionProvider>,
      ),
    ).toThrow()
  })
})
