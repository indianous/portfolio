import { Heading, Text } from '@indianous/base-ds'
import { AppLink } from '@/components/AppLink'
import { ButtonLink } from '@/components/ButtonLink'
import type { Post } from '@/content/schemas'
import { formatDate } from '@/lib/dates'

const MAX_POSTS = 3

interface LatestPostsProps {
  posts: Post[]
}

export function LatestPosts({ posts }: LatestPostsProps) {
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_POSTS)
  if (latest.length === 0) return null

  return (
    <section aria-labelledby="ultimos-posts" className="flex flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h2" size="2xl" id="ultimos-posts">
          Últimos posts
        </Heading>
        <ButtonLink href="/blog" variant="ghost" aria-label="Ver todos os posts">
          Ver todos
        </ButtonLink>
      </div>
      <ul className="flex flex-col gap-6">
        {latest.map((post) => (
          <li key={post.slug} className="flex flex-col gap-1">
            <Heading as="h3" size="xl">
              <AppLink
                href={`/blog/${post.slug}`}
                className="hover:text-primary hover:underline underline-offset-2"
              >
                {post.title}
              </AppLink>
            </Heading>
            <Text as="span" size="sm" color="muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </Text>
            <Text color="muted">{post.summary}</Text>
          </li>
        ))}
      </ul>
    </section>
  )
}
