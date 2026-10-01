import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { siteConfig } from '@/config/site'
import { Hero } from '@/components/home/Hero'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('Hero', () => {
  it('mostra nome e cargo num único h1 e a frase de apresentação', () => {
    render(<Hero headline="Construo aplicações web." contactHref="mailto:eu@exemplo.dev" />)
    const headings = screen.getAllByRole('heading', { level: 1 })
    expect(headings).toHaveLength(1)
    expect(headings[0]).toHaveTextContent(siteConfig.name)
    expect(headings[0]).toHaveTextContent(siteConfig.role)
    expect(screen.getByText('Construo aplicações web.')).toBeInTheDocument()
  })

  it('leva a /projects pelo Link do Next.js e ao contato recebido', () => {
    render(<Hero headline="Frase." contactHref="mailto:eu@exemplo.dev" />)
    const projects = screen.getByRole('link', { name: 'Ver projetos' })
    expect(projects).toHaveAttribute('href', '/projects')
    expect(projects).toHaveAttribute('data-next-link')
    expect(screen.getByRole('link', { name: 'Contato' })).toHaveAttribute(
      'href',
      'mailto:eu@exemplo.dev',
    )
  })

  it('não mostra o botão de contato sem destino', () => {
    render(<Hero headline="Frase." />)
    expect(screen.queryByRole('link', { name: 'Contato' })).not.toBeInTheDocument()
  })

  it('mostra a foto só quando existe, carregada com prioridade', () => {
    const { rerender } = render(<Hero headline="Frase." photo="/foto.jpg" />)
    const photo = screen.getByRole('img', { name: siteConfig.name })
    expect(photo).toHaveAttribute('src', '/foto.jpg')
    expect(photo).toHaveAttribute('loading', 'eager')

    rerender(<Hero headline="Frase." />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
