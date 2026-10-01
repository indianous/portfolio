import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RepoList } from '@/components/github/RepoList'

const repos = [
  {
    name: 'base-ds',
    description: 'Design system.',
    url: 'https://github.com/eu/base-ds',
    stars: 12,
    language: 'TypeScript',
  },
  {
    name: 'sem-descricao',
    description: null,
    url: 'https://github.com/eu/x',
    stars: 1,
    language: null,
  },
]

describe('RepoList', () => {
  it('mostra um card por repositório, com link, descrição, linguagem e estrelas', () => {
    render(<RepoList repos={repos} source="pinned" />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    const first = within(items[0])
    expect(first.getByRole('link', { name: 'base-ds' })).toHaveAttribute(
      'href',
      'https://github.com/eu/base-ds',
    )
    expect(first.getByText('Design system.')).toBeInTheDocument()
    expect(first.getByText('TypeScript')).toBeInTheDocument()
    expect(first.getByText('12 estrelas')).toBeInTheDocument()
    expect(within(items[1]).getByText('1 estrela')).toBeInTheDocument()
  })

  it('diz se os repositórios são os fixados ou os recentes', () => {
    const { rerender } = render(<RepoList repos={repos} source="pinned" />)
    expect(screen.getByRole('heading', { name: 'Repositórios fixados' })).toBeInTheDocument()
    rerender(<RepoList repos={repos} source="recent" />)
    expect(screen.getByRole('heading', { name: 'Repositórios recentes' })).toBeInTheDocument()
  })
})
