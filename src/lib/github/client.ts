import 'server-only'
import { siteConfig } from '@/config/site'
import { mapContributions, mapRepos } from '@/lib/github/mappers'
import type { GitHubProfile, RawContributionCalendar, RawRepo } from '@/lib/github/types'

const ENDPOINT = 'https://api.github.com/graphql'
// Revalidação dos dados (ISR): a página fica estática e se atualiza uma vez por dia.
const REVALIDATE_SECONDS = 60 * 60 * 24

const QUERY = `
  query Portfolio($login: String!) {
    user(login: $login) {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes { ... on Repository { ...Repo } }
      }
      repositories(
        first: 6
        privacy: PUBLIC
        isFork: false
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes { ...Repo }
      }
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
  fragment Repo on Repository {
    name
    description
    url
    stargazerCount
    isPrivate
    primaryLanguage { name }
  }
`

interface QueryData {
  user: {
    pinnedItems: { nodes: RawRepo[] }
    repositories: { nodes: RawRepo[] }
    contributionsCollection: { contributionCalendar: RawContributionCalendar }
  } | null
}

export class GitHubApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GitHubApiError'
  }
}

type GitHubEnv = Record<string, string | undefined>

function usernameFrom(env: GitHubEnv) {
  return env.GITHUB_USERNAME?.trim() || new URL(siteConfig.github).pathname.replaceAll('/', '')
}

/** Busca repositórios e contribuições. Sem `GITHUB_TOKEN`, devolve `null` sem ir à rede. */
export async function fetchGitHubProfile(
  env: GitHubEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubProfile | null> {
  const token = env.GITHUB_TOKEN?.trim()
  if (!token) return null
  const username = usernameFrom(env)

  const response = await fetchImpl(ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    // POST só entra no cache do Next.js quando pedido.
    cache: 'force-cache',
    next: { revalidate: REVALIDATE_SECONDS },
  })
  const json = (await response.json()) as { data?: QueryData; errors?: { message: string }[] }

  if (!response.ok) throw new GitHubApiError(`GitHub respondeu ${response.status}`)
  if (json.errors?.length) throw new GitHubApiError(json.errors.map((e) => e.message).join('; '))
  const user = json.data?.user
  if (!user) throw new GitHubApiError(`Usuário ${username} não encontrado`)

  const { repos, source } = mapRepos(user.pinnedItems.nodes, user.repositories.nodes)
  return {
    username,
    repos,
    reposSource: source,
    contributions: mapContributions(user.contributionsCollection.contributionCalendar),
  }
}

/** Como `fetchGitHubProfile`, mas nunca lança: com a API fora, a seção some e a página sai. */
export async function getGitHubProfile(
  env: GitHubEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<GitHubProfile | null> {
  try {
    return await fetchGitHubProfile(env, fetchImpl)
  } catch (error) {
    console.error('Falha ao buscar dados do GitHub:', error)
    return null
  }
}
