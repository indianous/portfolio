import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { ProjectHeader } from '@/components/projects/ProjectHeader'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('ProjectHeader', () => {
  const project = makeProject({
    title: 'Alfa',
    summary: 'Resumo alfa.',
    technologies: ['React', 'Node.js'],
    liveUrl: 'https://alfa.dev',
  })

  it('mostra a trilha até Projetos', () => {
    render(<ProjectHeader project={project} />)
    const trail = screen.getByRole('navigation', { name: 'Trilha de navegação' })
    const link = within(trail).getByRole('link', { name: 'Projetos' })
    expect(link).toHaveAttribute('href', '/projects')
    expect(link).toHaveAttribute('data-next-link')
    expect(within(trail).getByText('Alfa')).toHaveAttribute('aria-current', 'page')
  })

  it('mostra título em h1, resumo e tecnologias em lista', () => {
    render(<ProjectHeader project={project} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Alfa' })).toBeInTheDocument()
    expect(screen.getByText('Resumo alfa.')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Tecnologias' })).toHaveTextContent('ReactNode.js')
  })

  it('liga ao site de demonstração', () => {
    render(<ProjectHeader project={project} />)
    expect(screen.getByRole('link', { name: 'Ver demonstração' })).toHaveAttribute(
      'href',
      'https://alfa.dev',
    )
  })

  it('mostra a capa, com prioridade, só quando existe', () => {
    const { rerender } = render(
      <ProjectHeader
        project={makeProject({
          title: 'Alfa',
          cover: '/images/alfa.png',
          coverAlt: 'Tela do Alfa',
        })}
      />,
    )
    expect(screen.getByRole('img', { name: 'Tela do Alfa' })).toHaveAttribute('loading', 'eager')

    rerender(<ProjectHeader project={makeProject({ title: 'Alfa' })} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
