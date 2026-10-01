/** Repositório como vem da API GraphQL do GitHub. */
export interface RawRepo {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  isPrivate: boolean
  primaryLanguage: { name: string } | null
}

export interface RawContributionCalendar {
  totalContributions: number
  weeks: { contributionDays: { date: string; contributionCount: number }[] }[]
}

export interface GitHubRepo {
  name: string
  description: string | null
  url: string
  stars: number
  language: string | null
}

export interface ContributionSummary {
  /** Contribuições no último ano. */
  total: number
  /** Soma por mês (`AAAA-MM`), dos últimos 12 meses, do mais recente ao mais antigo. */
  months: { month: string; count: number }[]
}

export interface GitHubProfile {
  username: string
  repos: GitHubRepo[]
  /** `pinned`: fixados no perfil; `recent`: sem fixados, os atualizados mais recentemente. */
  reposSource: 'pinned' | 'recent'
  contributions: ContributionSummary
}
