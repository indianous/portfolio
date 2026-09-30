import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { siteConfig } from '@/config/site'
import { SiteHeader } from '@/components/layout/SiteHeader'

const pathname = vi.hoisted(() => ({ current: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))

function link(name: string) {
  return screen.getByRole('link', { name })
}

describe('SiteHeader', () => {
  beforeEach(() => {
    pathname.current = '/'
  })

  it('tem o nome do desenvolvedor como link para a home', () => {
    render(<SiteHeader />)
    expect(link(siteConfig.name)).toHaveAttribute('href', '/')
  })

  it('mostra os itens do menu com os destinos corretos', () => {
    render(<SiteHeader />)
    expect(link('Projetos')).toHaveAttribute('href', '/projects')
    expect(link('Blog')).toHaveAttribute('href', '/blog')
    expect(link('Sobre')).toHaveAttribute('href', '/about')
  })

  it('marca o item da seção atual, inclusive em subpáginas', () => {
    pathname.current = '/projects/algum-projeto'
    render(<SiteHeader />)
    expect(link('Projetos')).toHaveAttribute('aria-current', 'page')
    expect(link('Blog')).not.toHaveAttribute('aria-current')
    expect(link('Sobre')).not.toHaveAttribute('aria-current')
  })

  it('não marca nenhum item na home', () => {
    render(<SiteHeader />)
    for (const name of ['Projetos', 'Blog', 'Sobre']) {
      expect(link(name)).not.toHaveAttribute('aria-current')
    }
  })
})
