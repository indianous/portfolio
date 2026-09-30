import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SkipLink } from '@/components/layout/SkipLink'

describe('SkipLink', () => {
  it('leva ao conteúdo principal', () => {
    render(<SkipLink />)
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo' })).toHaveAttribute(
      'href',
      '#conteudo',
    )
  })
})
