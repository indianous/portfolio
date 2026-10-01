import { Heading, Text } from '@indianous/base-ds'
import { PostList } from '@/components/blog/PostList'
import { getPosts } from '@/content/loaders'
import { buildMetadata } from '@/lib/seo'

const description =
  'Artigos sobre desenvolvimento web, design systems e o que aprendo nos projetos.'

export const metadata = buildMetadata({
  title: 'Blog',
  description,
  path: '/blog',
  feed: '/blog/rss.xml',
})

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="flex max-w-3xl flex-col gap-8 py-12">
      <div className="flex flex-col gap-3">
        <Heading as="h1" size="4xl">
          Blog
        </Heading>
        <Text size="lg" color="muted">
          {description}
        </Text>
      </div>
      {posts.length > 0 ? (
        <PostList posts={posts} headingLevel="h2" />
      ) : (
        <Text color="muted">Nenhum post publicado ainda. Volte em breve.</Text>
      )}
    </div>
  )
}
