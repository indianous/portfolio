import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('FeaturedProjects', () => {
  it('mostra só os projetos em destaque, no máximo 3, e o link para todos', () => {
    const projects = [
      makeProject({ slug: 'a', title: 'A', featured: true }),
      makeProject({ slug: 'b', title: 'B' }),
      makeProject({ slug: 'c', title: 'C', featured: true }),
      makeProject({ slug: 'd', title: 'D', featured: true }),
      makeProject({ slug: 'e', title: 'E', featured: true }),
    ]
    render(<FeaturedProjects projects={projects} />)
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'A',
      'C',
      'D',
    ])
    expect(screen.getByRole('link', { name: 'Ver todos os projetos' })).toHaveAttribute(
      'href',
      '/projects',
    )
  })

  it('não renderiza nada sem projetos em destaque', () => {
    const { container } = render(<FeaturedProjects projects={[makeProject()]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
