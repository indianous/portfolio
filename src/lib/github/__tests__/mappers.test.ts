// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { makeRawRepo } from '../../../../__tests__/stubs/github'
import { mapContributions, mapRepos } from '@/lib/github/mappers'

describe('mapRepos', () => {
  it('usa os fixados quando existem', () => {
    const result = mapRepos([makeRawRepo({ name: 'fixado' })], [makeRawRepo({ name: 'recente' })])
    expect(result.source).toBe('pinned')
    expect(result.repos).toEqual([
      {
        name: 'fixado',
        description: 'Descrição do repo.',
        url: 'https://github.com/eu/repo',
        stars: 3,
        language: 'TypeScript',
      },
    ])
  })

  it('sem fixados, usa os recentes', () => {
    const result = mapRepos([], [makeRawRepo({ name: 'recente', primaryLanguage: null })])
    expect(result.source).toBe('recent')
    expect(result.repos.map((repo) => [repo.name, repo.language])).toEqual([['recente', null]])
  })

  it('ignora privados e mostra no máximo 6', () => {
    const recent = Array.from({ length: 8 }, (_, i) => makeRawRepo({ name: `r${i}` }))
    recent[0] = makeRawRepo({ name: 'privado', isPrivate: true })
    const { repos } = mapRepos([makeRawRepo({ isPrivate: true })], recent)
    expect(repos.map((repo) => repo.name)).toEqual(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'])
  })
})

describe('mapContributions', () => {
  it('soma por mês e fica com os últimos 12 meses, do mais recente para o mais antigo', () => {
    const days = [
      { date: '2025-09-28', contributionCount: 5 },
      { date: '2025-10-01', contributionCount: 1 },
      { date: '2025-10-15', contributionCount: 2 },
      ...Array.from({ length: 11 }, (_, i) => ({
        date: `2026-${String(i + 1).padStart(2, '0')}-10`,
        contributionCount: i,
      })),
    ]
    const summary = mapContributions({
      totalContributions: 99,
      weeks: [{ contributionDays: days.slice(0, 2) }, { contributionDays: days.slice(2) }],
    })
    expect(summary.total).toBe(99)
    expect(summary.months).toHaveLength(12)
    expect(summary.months[0]).toEqual({ month: '2026-11', count: 10 })
    expect(summary.months.at(-1)).toEqual({ month: '2025-10', count: 3 })
  })
})
