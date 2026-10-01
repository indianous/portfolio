import type { GitHubProfile, RawRepo } from '@/lib/github/types'

// Fábricas de dados do GitHub para os testes.

export function makeRawRepo(overrides: Partial<RawRepo> = {}): RawRepo {
  return {
    name: 'repo',
    description: 'Descrição do repo.',
    url: 'https://github.com/eu/repo',
    stargazerCount: 3,
    isPrivate: false,
    primaryLanguage: { name: 'TypeScript' },
    ...overrides,
  }
}

export function makeProfile(overrides: Partial<GitHubProfile> = {}): GitHubProfile {
  return {
    username: 'eu',
    repos: [
      {
        name: 'repo',
        description: 'Descrição do repo.',
        url: 'https://github.com/eu/repo',
        stars: 3,
        language: 'TypeScript',
      },
    ],
    reposSource: 'pinned',
    contributions: {
      total: 42,
      months: [
        { month: '2026-08', count: 10 },
        { month: '2026-09', count: 32 },
      ],
    },
    ...overrides,
  }
}
