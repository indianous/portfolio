import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { siteConfig, type NavLink } from '@/config/site'
import { SiteFooter } from '@/components/layout/SiteFooter'

const social: NavLink[] = [
  { label: 'GitHub', href: siteConfig.github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/exemplo' },
  { label: 'E-mail', href: 'mailto:contato@exemplo.dev' },
]

describe('SiteFooter', () => {
  it('repete os itens do menu numa coluna de navegação', () => {
    render(<SiteFooter year={2026} social={social} />)
    const nav = screen.getByRole('navigation', { name: 'Navegação' })
    expect(within(nav).getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projects')
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('href', '/blog')
    expect(within(nav).getByRole('link', { name: 'Sobre' })).toHaveAttribute('href', '/about')
  })

  it('mostra as redes recebidas numa coluna própria', () => {
    render(<SiteFooter year={2026} social={social} />)
    const nav = screen.getByRole('navigation', { name: 'Redes' })
    expect(within(nav).getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      siteConfig.github,
    )
    expect(within(nav).getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/exemplo',
    )
    expect(within(nav).getByRole('link', { name: 'E-mail' })).toHaveAttribute(
      'href',
      'mailto:contato@exemplo.dev',
    )
  })

  it('mostra o copyright com o ano e o nome do desenvolvedor', () => {
    render(<SiteFooter year={2026} social={social} />)
    expect(screen.getByText(`© 2026 ${siteConfig.name}`)).toBeInTheDocument()
    expect(screen.queryByText(/base-ds/)).not.toBeInTheDocument()
  })
})
