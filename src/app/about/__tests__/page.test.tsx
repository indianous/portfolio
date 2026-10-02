import { render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { makeExperience } from '../../../../__tests__/stubs/content'
import type { Experience } from '@/content/schemas'
import AboutPage from '@/app/about/page'

const experience = vi.hoisted(() => ({ current: [] as Experience[] }))
vi.mock('@/content/loaders', () => ({
  getProfile: async () => ({ headline: 'Frase.', body: 'Resumo.' }),
  getExperience: async () => experience.current,
  getAllTechnologies: async () => ['React'],
}))
vi.mock('@/lib/github/client', () => ({ getGitHubProfile: async () => null }))
vi.mock('next/link', () => import('../../../../__tests__/stubs/next-link'))

describe('página Sobre', () => {
  beforeEach(() => {
    experience.current = []
  })

  it('junta as soft skills da trajetória, sem repetir e em ordem alfabética', async () => {
    experience.current = [
      makeExperience({ slug: 'a', softSkills: ['Liderança', 'Disciplina'] }),
      makeExperience({ slug: 'b', start: '2010-01', softSkills: ['Disciplina', 'Comunicação'] }),
    ]
    render(await AboutPage())
    const section = screen.getByRole('heading', { level: 2, name: 'Soft-Skills' })
    const list = screen.getByRole('list', { name: 'Soft-Skills' })
    expect(section).toBeInTheDocument()
    expect(
      within(list)
        .getAllByRole('listitem')
        .map((li) => li.textContent),
    ).toEqual(['Comunicação', 'Disciplina', 'Liderança'])
  })

  it('não mostra a seção quando nenhuma experiência tem soft skills', async () => {
    experience.current = [makeExperience()]
    render(await AboutPage())
    expect(screen.queryByRole('heading', { name: 'Soft-Skills' })).not.toBeInTheDocument()
  })
})
