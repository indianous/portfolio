import { Badge, Heading, Text } from '@indianous/base-ds'
import { AppLink } from '@/components/AppLink'
import type { Post } from '@/content/schemas'
import { formatDate } from '@/lib/dates'
import { formatReadingTime } from '@/lib/readingTime'

interface PostListProps {
  posts: Post[]
  /** Nível do título de cada post: `h2` na página do blog, `h3` numa seção da home. */
  headingLevel: 'h2' | 'h3'
}

export function PostList({ posts, headingLevel }: PostListProps) {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <ul className="flex flex-col gap-8">
      {sorted.map((post) => (
        <li key={post.slug} className="flex flex-col gap-2">
          <Heading as={headingLevel} size="xl">
            <AppLink
              href={`/blog/${post.slug}`}
              className="underline-offset-2 hover:text-primary hover:underline"
            >
              {post.title}
            </AppLink>
            {post.draft && (
              <Badge variant="warning" size="sm" className="ml-2 align-middle">
                Rascunho
              </Badge>
            )}
          </Heading>
          <Text as="span" size="sm" color="muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{formatReadingTime(post.readingMinutes)}</span>
          </Text>
          <Text color="muted">{post.summary}</Text>
        </li>
      ))}
    </ul>
  )
}
