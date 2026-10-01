import { Heading } from '@indianous/base-ds'
import { PostList } from '@/components/blog/PostList'
import { ButtonLink } from '@/components/ButtonLink'
import type { Post } from '@/content/schemas'
import { Reveal } from '@/components/motion/Reveal'

const MAX_POSTS = 3

interface LatestPostsProps {
  posts: Post[]
}

export function LatestPosts({ posts }: LatestPostsProps) {
  const latest = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_POSTS)
  if (latest.length === 0) return null

  return (
    <Reveal as="section" aria-labelledby="ultimos-posts" className="flex flex-col gap-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Heading as="h2" size="2xl" id="ultimos-posts">
          Últimos posts
        </Heading>
        <ButtonLink href="/blog" variant="ghost" aria-label="Ver todos os posts">
          Ver todos
        </ButtonLink>
      </div>
      <PostList posts={latest} headingLevel="h3" />
    </Reveal>
  )
}
