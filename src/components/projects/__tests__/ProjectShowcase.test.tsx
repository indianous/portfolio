import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'

const search = vi.hoisted(() => ({ current: '' }))
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(search.current),
  usePathname: () => '/projects',
}))
vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

const projects = [
  makeProject({ slug: 'a', title: 'Alfa', technologies: ['React'] }),
  makeProject({ slug: 'b', title: 'Beta', technologies: ['Node.js'] }),
]
const technologies = ['Node.js', 'React']

describe('ProjectShowcase', () => {
  afterEach(() => {
    search.current = ''
    vi.restoreAllMocks()
  })

  it('aplica o filtro que está na URL', () => {
    search.current = 'tech=node.js'
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Beta'])
    expect(screen.getByRole('button', { name: 'Node.js' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('grava o filtro na URL ao clicar numa tecnologia', async () => {
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    await userEvent.click(screen.getByRole('button', { name: 'React' }))
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects?tech=react')
  })

  it('tira o parâmetro da URL ao limpar o filtro', async () => {
    search.current = 'tech=react'
    const pushState = vi.spyOn(window.history, 'pushState')
    render(<ProjectShowcase projects={projects} technologies={technologies} />)
    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects')
  })
})
