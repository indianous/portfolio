import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { CaseStudyHeader } from '@/components/case-study/CaseStudyHeader'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('CaseStudyHeader', () => {
  const project = makeProject({
    title: 'Alfa',
    summary: 'Resumo alfa.',
    technologies: ['React', 'Node.js'],
    repoUrl: 'https://github.com/eu/alfa',
    liveUrl: 'https://alfa.dev',
  })

  it('mostra a trilha até Projetos', () => {
    render(<CaseStudyHeader project={project} />)
    const trail = screen.getByRole('navigation', { name: 'Trilha de navegação' })
    expect(within(trail).getByRole('link', { name: 'Projetos' })).toHaveAttribute(
      'href',
      '/projects',
    )
    expect(within(trail).getByText('Alfa')).toHaveAttribute('aria-current', 'page')
  })

  it('mostra título em h1, resumo e tecnologias em lista', () => {
    render(<CaseStudyHeader project={project} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Alfa' })).toBeInTheDocument()
    expect(screen.getByText('Resumo alfa.')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Tecnologias' })).toHaveTextContent('ReactNode.js')
  })

  it('mostra os links de repositório e versão online quando existem', () => {
    const { rerender } = render(<CaseStudyHeader project={project} />)
    expect(screen.getByRole('link', { name: 'Repositório' })).toHaveAttribute(
      'href',
      'https://github.com/eu/alfa',
    )
    expect(screen.getByRole('link', { name: 'Ver online' })).toHaveAttribute(
      'href',
      'https://alfa.dev',
    )

    rerender(<CaseStudyHeader project={makeProject({ title: 'Alfa' })} />)
    expect(screen.queryByRole('link', { name: 'Repositório' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ver online' })).not.toBeInTheDocument()
  })

  it('mostra a capa, com prioridade, só quando existe', () => {
    const { rerender } = render(
      <CaseStudyHeader
        project={makeProject({
          title: 'Alfa',
          cover: '/images/alfa.png',
          coverAlt: 'Tela do Alfa',
        })}
      />,
    )
    expect(screen.getByRole('img', { name: 'Tela do Alfa' })).toHaveAttribute('loading', 'eager')

    rerender(<CaseStudyHeader project={makeProject({ title: 'Alfa' })} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
