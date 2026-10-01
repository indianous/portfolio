import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makePost } from '../../../../__tests__/stubs/content'
import { PostHeader } from '@/components/blog/PostHeader'

describe('PostHeader', () => {
  const post = makePost({
    title: 'Meu post',
    summary: 'Resumo.',
    date: '2026-09-01',
    readingMinutes: 5,
    tags: ['react', 'nextjs'],
  })

  it('mostra a trilha até o Blog', () => {
    render(<PostHeader post={post} />)
    const trail = screen.getByRole('navigation', { name: 'Trilha de navegação' })
    expect(within(trail).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
    expect(within(trail).getByText('Meu post')).toHaveAttribute('aria-current', 'page')
  })

  it('mostra título em h1, data, tempo de leitura e tags', () => {
    render(<PostHeader post={post} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Meu post' })).toBeInTheDocument()
    expect(screen.getByText('1 de setembro de 2026')).toHaveAttribute('dateTime', '2026-09-01')
    expect(screen.getByText('5 min de leitura')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Tags' })).toHaveTextContent('reactnextjs')
  })
})
