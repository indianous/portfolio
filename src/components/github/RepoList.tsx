import { Badge, Card, Heading, Text } from '@indianous/base-ds'
import type { GitHubProfile, GitHubRepo } from '@/lib/github/types'

interface RepoListProps {
  repos: GitHubRepo[]
  source: GitHubProfile['reposSource']
}

const titles: Record<GitHubProfile['reposSource'], string> = {
  pinned: 'Repositórios fixados',
  recent: 'Repositórios recentes',
}

// O base-ds não tem link de texto: o nome do repositório é um <a> nativo, com tokens.
export function RepoList({ repos, source }: RepoListProps) {
  return (
    <div className="flex flex-col gap-4">
      <Heading as="h3" size="xl">
        {titles[source]}
      </Heading>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {repos.map((repo) => (
          <li key={repo.url}>
            <Card variant="outlined" className="h-full">
              <div className="flex flex-col gap-2">
                <Text as="span" weight="semibold">
                  <a
                    href={repo.url}
                    className="text-primary underline-offset-2 hover:text-primary-hover hover:underline"
                  >
                    {repo.name}
                  </a>
                </Text>
                {repo.description && (
                  <Text size="sm" color="muted">
                    {repo.description}
                  </Text>
                )}
                <div className="flex flex-wrap items-center gap-3">
                  {repo.language && <Badge size="sm">{repo.language}</Badge>}
                  <Text as="span" size="sm" color="muted">
                    {repo.stars} {repo.stars === 1 ? 'estrela' : 'estrelas'}
                  </Text>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
