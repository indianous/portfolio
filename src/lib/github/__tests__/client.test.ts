// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makeRawRepo } from '../../../../__tests__/stubs/github'
import { fetchGitHubProfile, getGitHubProfile, GitHubApiError } from '@/lib/github/client'

const graphqlData = {
  data: {
    user: {
      pinnedItems: { nodes: [makeRawRepo({ name: 'fixado' })] },
      repositories: { nodes: [] },
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 7,
          weeks: [{ contributionDays: [{ date: '2026-09-01', contributionCount: 7 }] }],
        },
      },
    },
  },
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status })
}

describe('fetchGitHubProfile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sem token, devolve null sem chamar a rede', async () => {
    const fetchMock = vi.fn()
    expect(await fetchGitHubProfile({ GITHUB_TOKEN: ' ' }, fetchMock)).toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('envia a query com o token, o usuário e o cache de 1 dia', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(graphqlData))
    const profile = await fetchGitHubProfile({ GITHUB_TOKEN: 'tok' }, fetchMock)

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.github.com/graphql')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer tok')
    expect(init.cache).toBe('force-cache')
    expect(init.next).toEqual({ revalidate: 86400 })
    expect(JSON.parse(init.body).variables).toEqual({ login: 'indianous' })

    expect(profile?.username).toBe('indianous')
    expect(profile?.repos.map((repo) => repo.name)).toEqual(['fixado'])
    expect(profile?.contributions.total).toBe(7)
  })

  it('usa GITHUB_USERNAME quando definido', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(graphqlData))
    await fetchGitHubProfile({ GITHUB_TOKEN: 'tok', GITHUB_USERNAME: 'outro' }, fetchMock)
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).variables).toEqual({ login: 'outro' })
  })

  it('transforma errors e status de erro em GitHubApiError', async () => {
    const withErrors = vi
      .fn()
      .mockResolvedValue(jsonResponse({ errors: [{ message: 'Could not resolve user' }] }))
    await expect(fetchGitHubProfile({ GITHUB_TOKEN: 'tok' }, withErrors)).rejects.toThrow(
      new GitHubApiError('Could not resolve user'),
    )

    const unauthorized = vi
      .fn()
      .mockResolvedValue(jsonResponse({ message: 'Bad credentials' }, 401))
    await expect(fetchGitHubProfile({ GITHUB_TOKEN: 'tok' }, unauthorized)).rejects.toBeInstanceOf(
      GitHubApiError,
    )
  })
})

describe('getGitHubProfile', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('devolve null e registra o erro quando a API falha', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failing = vi.fn().mockRejectedValue(new Error('rede fora'))
    expect(await getGitHubProfile({ GITHUB_TOKEN: 'tok' }, failing)).toBeNull()
    expect(error).toHaveBeenCalled()
  })
})
