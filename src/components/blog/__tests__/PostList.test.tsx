import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makePost } from '../../../../__tests__/stubs/content'
import { PostList } from '@/components/blog/PostList'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('PostList', () => {
  const posts = [
    makePost({ slug: 'antigo', title: 'Antigo', date: '2025-01-01' }),
    makePost({
      slug: 'novo',
      title: 'Novo',
      date: '2026-03-01',
      summary: 'Resumo do novo.',
      readingMinutes: 4,
    }),
  ]

  it('lista do mais recente para o mais antigo, com link, data, leitura e resumo', () => {
    render(<PostList posts={posts} headingLevel="h2" />)
    const items = screen.getAllByRole('listitem')
    expect(
      items.map((item) => within(item).getByRole('heading', { level: 2 }).textContent),
    ).toEqual(['Novo', 'Antigo'])
    const first = within(items[0])
    expect(first.getByRole('link', { name: 'Novo' })).toHaveAttribute('href', '/blog/novo')
    expect(first.getByRole('link', { name: 'Novo' })).toHaveAttribute('data-next-link')
    expect(first.getByText('1 de março de 2026')).toHaveAttribute('dateTime', '2026-03-01')
    expect(first.getByText('4 min de leitura')).toBeInTheDocument()
    expect(first.getByText('Resumo do novo.')).toBeInTheDocument()
  })

  it('marca os rascunhos', () => {
    render(
      <PostList
        posts={[makePost({ slug: 'r', title: 'Rascunho de post', draft: true })]}
        headingLevel="h3"
      />,
    )
    expect(screen.getByRole('heading', { level: 3, name: /Rascunho de post/ })).toBeInTheDocument()
    expect(screen.getByText('Rascunho')).toBeInTheDocument()
  })
})
