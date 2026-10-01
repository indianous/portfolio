// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { siteConfig } from '@/config/site'
import { generateMetadata, generateStaticParams } from '@/app/blog/[slug]/page'
import { getPosts } from '@/content/loaders'

describe('página do post', () => {
  it('gera os slugs dos posts', async () => {
    const posts = await getPosts()
    expect(await generateStaticParams()).toEqual(posts.map(({ slug }) => ({ slug })))
  })

  it('usa título, resumo e data de publicação nos metadados', async () => {
    const [post] = await getPosts({ includeDrafts: true })
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) })
    expect(metadata.title).toEqual({ absolute: `${post.title} · ${siteConfig.name}` })
    expect(metadata.description).toBe(post.summary)
    expect(metadata.openGraph).toMatchObject({ type: 'article', publishedTime: post.date })
  })
})
