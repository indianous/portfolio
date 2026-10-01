import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostHeader } from '@/components/blog/PostHeader'
import { TableOfContents } from '@/components/case-study/TableOfContents'
import { getSiteUrl, siteConfig } from '@/config/site'
import { extractHeadings } from '@/content/headings'
import { getPostBySlug, getPosts } from '@/content/loaders'
import { renderMarkdown } from '@/content/markdown'
import { buildMetadata } from '@/lib/seo'

// Só os posts carregados viram página (no build de produção, sem rascunhos); o resto é 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }))
}

async function findPost(slug: string) {
  const post = await getPostBySlug(slug)
  if (!post) notFound()
  return post
}

export async function generateMetadata({
  params,
}: Pick<PageProps<'/blog/[slug]'>, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const post = await findPost(slug)
  return buildMetadata({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.slug}`,
    publishedTime: post.date,
    feed: '/blog/rss.xml',
  })
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await findPost(slug)
  const content = await renderMarkdown(post.body)
  const headings = extractHeadings(post.body)
  const siteUrl = getSiteUrl()
  const url = new URL(`/blog/${post.slug}`, siteUrl).toString()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    keywords: post.tags.join(', '),
    inLanguage: 'pt-BR',
    author: { '@type': 'Person', name: siteConfig.name, url: siteUrl },
  }

  return (
    <article className="flex flex-col gap-10 py-12">
      <script
        type="application/ld+json"
        // `<` escapado, como recomenda o guia de JSON-LD do Next.js.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <PostHeader post={post} />
      <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-start">
        {headings.length > 0 && (
          <aside className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0">
            <TableOfContents headings={headings} />
          </aside>
        )}
        <div className="min-w-0 max-w-3xl flex-1">{content}</div>
      </div>
    </article>
  )
}
