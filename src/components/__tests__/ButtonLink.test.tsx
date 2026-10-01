import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ButtonLink } from '@/components/ButtonLink'

vi.mock('next/link', () => import('../../../__tests__/stubs/next-link'))

describe('ButtonLink', () => {
  it('navega pelo Link do Next.js com a aparência do Button do base-ds', () => {
    render(
      <ButtonLink href="/projects" variant="outline" size="sm" aria-label="Ver todos os projetos">
        Ver todos
      </ButtonLink>,
    )
    const link = screen.getByRole('link', { name: 'Ver todos os projetos' })
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('data-next-link')
    expect(link).toHaveTextContent('Ver todos')
    expect(link.className).toMatch(/inline-flex/)
  })
})
