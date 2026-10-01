import { Button, Heading } from '@indianous/base-ds'
import { ContributionStats } from '@/components/github/ContributionStats'
import { RepoList } from '@/components/github/RepoList'
import type { GitHubProfile } from '@/lib/github/types'

interface GitHubSectionProps {
  /** `null` quando não há token ou a API falhou: a seção não aparece. */
  profile: GitHubProfile | null
}

export function GitHubSection({ profile }: GitHubSectionProps) {
  if (!profile) return null

  return (
    <section aria-labelledby="no-github" className="flex flex-col gap-8 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h2" size="2xl" id="no-github">
          No GitHub
        </Heading>
        <Button as="a" href={`https://github.com/${profile.username}`} variant="ghost">
          Ver perfil no GitHub
        </Button>
      </div>
      <ContributionStats contributions={profile.contributions} />
      {profile.repos.length > 0 && <RepoList repos={profile.repos} source={profile.reposSource} />}
    </section>
  )
}
