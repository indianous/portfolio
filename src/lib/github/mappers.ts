import type {
  ContributionSummary,
  GitHubProfile,
  GitHubRepo,
  RawContributionCalendar,
  RawRepo,
} from '@/lib/github/types'

const MAX_REPOS = 6
const MONTHS = 12

function toRepo(raw: RawRepo): GitHubRepo {
  return {
    name: raw.name,
    description: raw.description,
    url: raw.url,
    stars: raw.stargazerCount,
    language: raw.primaryLanguage?.name ?? null,
  }
}

/** Os fixados no perfil; sem nenhum, os recentes. Privados nunca entram. */
export function mapRepos(
  pinned: RawRepo[],
  recent: RawRepo[],
): { repos: GitHubRepo[]; source: GitHubProfile['reposSource'] } {
  const publicPinned = pinned.filter((repo) => !repo.isPrivate)
  const source = publicPinned.length > 0 ? 'pinned' : 'recent'
  const chosen = source === 'pinned' ? publicPinned : recent.filter((repo) => !repo.isPrivate)
  return { repos: chosen.slice(0, MAX_REPOS).map(toRepo), source }
}

/** Total do ano e soma por mês. O calendário cobre ~53 semanas: o primeiro mês sai incompleto. */
export function mapContributions(calendar: RawContributionCalendar): ContributionSummary {
  const byMonth = new Map<string, number>()
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      const month = day.date.slice(0, 7)
      byMonth.set(month, (byMonth.get(month) ?? 0) + day.contributionCount)
    }
  }
  const months = [...byMonth.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, MONTHS)
    .map(([month, count]) => ({ month, count }))
  return { total: calendar.totalContributions, months }
}
