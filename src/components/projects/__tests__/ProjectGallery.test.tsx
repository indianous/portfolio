import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { makeProject } from '../../../../__tests__/stubs/content'
import { ProjectGallery } from '@/components/projects/ProjectGallery'

vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

const projects = [
  makeProject({ slug: 'a', title: 'Alfa', technologies: ['React'] }),
  makeProject({ slug: 'b', title: 'Beta', technologies: ['Python'] }),
  makeProject({ slug: 'c', title: 'Gama', technologies: ['React', 'Python'] }),
]
const technologies = ['Python', 'React']

function titles() {
  return screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
}

describe('ProjectGallery', () => {
  it('mostra um botão por tecnologia, num grupo com rótulo, com o estado da seleção', () => {
    render(<ProjectGallery projects={projects} technologies={technologies} selected={['React']} />)
    const group = screen.getByRole('group', { name: 'Filtrar por tecnologia' })
    expect(within(group).getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(within(group).getByRole('button', { name: 'Python' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('lista só os projetos filtrados e anuncia a contagem', () => {
    const { rerender } = render(
      <ProjectGallery projects={projects} technologies={technologies} selected={[]} />,
    )
    expect(titles()).toEqual(['Alfa', 'Beta', 'Gama'])
    expect(screen.getByRole('status')).toHaveTextContent('3 projetos')

    rerender(
      <ProjectGallery projects={projects} technologies={technologies} selected={['Python']} />,
    )
    expect(titles()).toEqual(['Beta', 'Gama'])
    expect(screen.getByRole('status')).toHaveTextContent('2 projetos com Python')
  })

  it('usa o singular para um projeto', () => {
    render(
      <ProjectGallery projects={projects.slice(0, 1)} technologies={['React']} selected={[]} />,
    )
    expect(screen.getByRole('status')).toHaveTextContent('1 projeto')
  })

  it('acrescenta ou retira a tecnologia clicada', async () => {
    const onSelectedChange = vi.fn()
    render(
      <ProjectGallery
        projects={projects}
        technologies={technologies}
        selected={['React']}
        onSelectedChange={onSelectedChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Python' }))
    expect(onSelectedChange).toHaveBeenLastCalledWith(['React', 'Python'])
    await userEvent.click(screen.getByRole('button', { name: 'React' }))
    expect(onSelectedChange).toHaveBeenLastCalledWith([])
  })

  it('mostra "Limpar filtros" só com seleção', async () => {
    const onSelectedChange = vi.fn()
    const { rerender } = render(
      <ProjectGallery
        projects={projects}
        technologies={technologies}
        selected={[]}
        onSelectedChange={onSelectedChange}
      />,
    )
    expect(screen.queryByRole('button', { name: 'Limpar filtros' })).not.toBeInTheDocument()

    rerender(
      <ProjectGallery
        projects={projects}
        technologies={technologies}
        selected={['React', 'Python']}
        onSelectedChange={onSelectedChange}
      />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }))
    expect(onSelectedChange).toHaveBeenLastCalledWith([])
  })
})
