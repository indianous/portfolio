import { Badge, Breadcrumb, Heading, Text } from '@indianous/base-ds'
import type { Post } from '@/content/schemas'
import { formatDate } from '@/lib/dates'
import { formatReadingTime } from '@/lib/readingTime'

interface PostHeaderProps {
  post: Post
}

// A trilha usa href puro até o Breadcrumb aceitar linkComponent (indianous/base-ds#61).
export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="flex flex-col gap-6">
      <Breadcrumb
        label="Trilha de navegação"
        items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
      />
      <div className="flex flex-col gap-4">
        <Heading as="h1" size="4xl">
          {post.title}
          {post.draft && (
            <Badge variant="warning" className="ml-3 align-middle">
              Rascunho
            </Badge>
          )}
        </Heading>
        <Text size="lg" color="muted">
          {post.summary}
        </Text>
        <Text as="span" size="sm" color="muted">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true"> · </span>
          <span>{formatReadingTime(post.readingMinutes)}</span>
        </Text>
        {post.tags.length > 0 && (
          <ul aria-label="Tags" className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Badge size="sm">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  )
}
