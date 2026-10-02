import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { ProjectCard } from '@/components/projects/ProjectCard'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('ProjectCard', () => {
  it('mostra título em h3, resumo e tecnologias em lista', () => {
    render(
      <ProjectCard
        project={makeProject({
          title: 'Alfa',
          summary: 'Resumo alfa.',
          technologies: ['React', 'Node.js'],
        })}
      />,
    )
    expect(screen.getByRole('heading', { level: 3, name: 'Alfa' })).toBeInTheDocument()
    expect(screen.getByText('Resumo alfa.')).toBeInTheDocument()
    const technologies = screen.getByRole('list', { name: 'Tecnologias' })
    expect(
      within(technologies)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['React', 'Node.js'])
  })

  it('liga à página do projeto e à demonstração, com o nome do projeto', () => {
    render(
      <ProjectCard
        project={makeProject({ slug: 'alfa', title: 'Alfa', liveUrl: 'https://alfa.dev' })}
      />,
    )
    const details = screen.getByRole('link', { name: 'Detalhes de Alfa' })
    expect(details).toHaveAttribute('href', '/projects/alfa')
    expect(details).toHaveAttribute('data-next-link')
    expect(screen.getByRole('link', { name: 'Ver demonstração de Alfa' })).toHaveAttribute(
      'href',
      'https://alfa.dev',
    )
    expect(screen.getAllByRole('link')).toHaveLength(2)
  })

  it('usa o nível de título pedido', () => {
    render(<ProjectCard project={makeProject({ title: 'Alfa' })} headingLevel="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Alfa' })).toBeInTheDocument()
  })
})
