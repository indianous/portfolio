import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))
// O useSearchParams exigiria um <Suspense>, e a hidratação trocaria o HTML estático inteiro da
// vitrine (o LCP da página). O componente lê a URL direto: estes hooks não podem ser chamados.
vi.mock('next/navigation', () => ({
  useSearchParams: () => {
    throw new Error('useSearchParams não deve ser usado na vitrine')
  },
  usePathname: () => {
    throw new Error('usePathname não deve ser usado na vitrine')
  },
}))

const projects = [
  makeProject({ slug: 'a', title: 'Alfa', technologies: ['React'] }),
  makeProject({ slug: 'b', title: 'Beta', technologies: ['Node.js'] }),
]
const technologies = ['Node.js', 'React']

function titles() {
  return screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
}

function goTo(url: string) {
  window.history.replaceState(null, '', url)
}

describe('ProjectShowcase', () => {
  afterEach(() => {
    goTo('/')
    vi.restoreAllMocks()
  })

  it('aplica o filtro que está na URL', () => {
    goTo('/projects?tech=node.js')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    expect(titles()).toEqual(['Beta'])
    expect(screen.getByRole('button', { name: 'Node.js' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('grava o filtro na URL ao clicar numa tecnologia, e a lista acompanha', async () => {
    goTo('/projects')
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    await userEvent.click(screen.getByRole('button', { name: 'React' }))
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects?tech=react')
    expect(titles()).toEqual(['Alfa'])
  })

  it('tira o parâmetro da URL ao limpar o filtro', async () => {
    goTo('/projects?tech=react')
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects')
  })

  it('acompanha o "voltar" do navegador', () => {
    goTo('/projects?tech=react')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    expect(titles()).toEqual(['Alfa'])
    act(() => {
      goTo('/projects')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })
    expect(titles()).toEqual(['Alfa', 'Beta'])
  })
})
