import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { makeExperience } from '../../../../__tests__/stubs/content'
import { Timeline } from '@/components/about/Timeline'

describe('Timeline', () => {
  const items = [
    {
      experience: makeExperience({
        company: 'Antiga',
        role: 'Júnior',
        start: '2018-01',
        end: '2019-12',
      }),
      description: 'Descrição antiga.',
    },
    {
      experience: makeExperience({
        company: 'Atual',
        role: 'Sênior',
        start: '2020-01',
        location: 'Remoto',
        technologies: ['React', 'Node.js'],
      }),
      description: 'Descrição atual.',
    },
  ]

  it('usa lista ordenada, da experiência mais recente para a mais antiga', () => {
    render(<Timeline items={items} />)
    const list = screen.getByRole('list', { name: 'Trajetória' })
    expect(list.tagName).toBe('OL')
    const entries = within(list)
      .getAllByRole('listitem')
      .filter((li) => li.parentElement === list)
    expect(entries.map((li) => within(li).getByRole('heading').textContent)).toEqual([
      'Sênior',
      'Júnior',
    ])
  })

  it('mostra período, empresa, local, tecnologias e descrição', () => {
    render(<Timeline items={items} />)
    expect(screen.getByText('jan. de 2020 – Atual')).toBeInTheDocument()
    expect(screen.getByText('jan. de 2018 – dez. de 2019')).toBeInTheDocument()
    expect(screen.getByText('Atual · Remoto')).toBeInTheDocument()
    expect(screen.getByRole('list', { name: 'Tecnologias em Atual' })).toHaveTextContent(
      'ReactNode.js',
    )
    expect(screen.getByText('Descrição atual.')).toBeInTheDocument()
  })

  it('mostra as soft skills só da experiência que tem', () => {
    render(
      <Timeline
        items={[
          {
            experience: makeExperience({
              slug: 'a',
              company: 'Com',
              softSkills: ['Liderança', 'Disciplina'],
            }),
            description: 'A.',
          },
          {
            experience: makeExperience({ slug: 'b', company: 'Sem', start: '2010-01' }),
            description: 'B.',
          },
        ]}
      />,
    )
    expect(screen.getByRole('list', { name: 'Soft-Skills em Com' })).toHaveTextContent(
      'LiderançaDisciplina',
    )
    expect(screen.queryByRole('list', { name: 'Soft-Skills em Sem' })).not.toBeInTheDocument()
  })
})
