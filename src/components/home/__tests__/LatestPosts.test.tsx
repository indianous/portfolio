import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { makePost } from '../../../../__tests__/stubs/content'
import { LatestPosts } from '@/components/home/LatestPosts'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('LatestPosts', () => {
  it('mostra os 3 posts mais recentes, com link e data', () => {
    const posts = [
      makePost({ slug: 'antigo', title: 'Antigo', date: '2024-01-01' }),
      makePost({ slug: 'novo', title: 'Novo', date: '2026-03-01' }),
      makePost({ slug: 'meio', title: 'Meio', date: '2025-01-01' }),
      makePost({ slug: 'velho', title: 'Velho', date: '2023-01-01' }),
    ]
    render(<LatestPosts posts={posts} />)
    const items = screen.getAllByRole('listitem')
    expect(items.map((item) => within(item).getByRole('heading').textContent)).toEqual([
      'Novo',
      'Meio',
      'Antigo',
    ])
    expect(within(items[0]).getByRole('link', { name: 'Novo' })).toHaveAttribute(
      'href',
      '/blog/novo',
    )
    expect(within(items[0]).getByText('1 de março de 2026').tagName).toBe('TIME')
    expect(within(items[0]).getByText('1 de março de 2026')).toHaveAttribute(
      'dateTime',
      '2026-03-01',
    )
    expect(screen.getByRole('link', { name: 'Ver todos os posts' })).toHaveAttribute(
      'href',
      '/blog',
    )
  })

  it('não renderiza nada sem posts', () => {
    const { container } = render(<LatestPosts posts={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
