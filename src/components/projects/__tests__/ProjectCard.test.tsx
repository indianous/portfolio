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

  it('liga ao estudo de caso só quando ele existe', () => {
    const { rerender } = render(
      <ProjectCard project={makeProject({ slug: 'alfa', title: 'Alfa', hasCaseStudy: true })} />,
    )
    const link = screen.getByRole('link', { name: 'Estudo de caso de Alfa' })
    expect(link).toHaveAttribute('href', '/projects/alfa')
    expect(link).toHaveAttribute('data-next-link')

    rerender(<ProjectCard project={makeProject({ title: 'Alfa', hasCaseStudy: false })} />)
    expect(screen.queryByRole('link', { name: /Estudo de caso/ })).not.toBeInTheDocument()
  })

  it('mostra repositório e versão online só quando existem, com o nome do projeto', () => {
    const { rerender } = render(
      <ProjectCard
        project={makeProject({
          title: 'Alfa',
          repoUrl: 'https://github.com/eu/alfa',
          liveUrl: 'https://alfa.dev',
        })}
      />,
    )
    expect(screen.getByRole('link', { name: 'Repositório de Alfa' })).toHaveAttribute(
      'href',
      'https://github.com/eu/alfa',
    )
    expect(screen.getByRole('link', { name: 'Ver Alfa online' })).toHaveAttribute(
      'href',
      'https://alfa.dev',
    )

    rerender(<ProjectCard project={makeProject({ title: 'Alfa' })} />)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('usa o nível de título pedido', () => {
    render(<ProjectCard project={makeProject({ title: 'Alfa' })} headingLevel="h2" />)
    expect(screen.getByRole('heading', { level: 2, name: 'Alfa' })).toBeInTheDocument()
  })
})
