import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { siteConfig } from '@/config/site'
import { SiteHeader } from '@/components/layout/SiteHeader'

const pathname = vi.hoisted(() => ({ current: '/' }))
vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<'a'>) => (
    <a href={href} data-next-link="" {...rest}>
      {children}
    </a>
  ),
}))

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

  it('navega pelo Link do Next.js, sem recarregar a página', () => {
    render(<SiteHeader />)
    for (const name of [siteConfig.name, 'Projetos', 'Blog', 'Sobre']) {
      expect(link(name)).toHaveAttribute('data-next-link')
    }
  })

  it('usa rótulos de acessibilidade em português', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Abrir menu de navegação' })).toBeInTheDocument()
  })

  it('abre o menu do celular com título e botão de fechar em português', async () => {
    render(<SiteHeader />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir menu de navegação' }))
    const drawer = screen.getByRole('dialog', { name: 'Menu' })
    expect(drawer).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument()
  })

  it('tem o botão de tema', () => {
    render(<SiteHeader />)
    expect(screen.getAllByRole('button', { name: /Ativar tema/ }).length).toBeGreaterThan(0)
  })
})
