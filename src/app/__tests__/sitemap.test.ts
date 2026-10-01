// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { getCaseStudies, getPosts } from '@/content/loaders'

describe('sitemap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('lista as rotas estáticas, os estudos de caso e os posts, com URL absoluta', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://exemplo.dev')
    const caseStudies = await getCaseStudies()
    const posts = await getPosts()
    expect((await sitemap()).map((entry) => entry.url)).toEqual([
      'https://exemplo.dev/',
      'https://exemplo.dev/about',
      'https://exemplo.dev/projects',
      'https://exemplo.dev/blog',
      ...caseStudies.map((project) => `https://exemplo.dev/projects/${project.slug}`),
      ...posts.map((post) => `https://exemplo.dev/blog/${post.slug}`),
    ])
  })
})
