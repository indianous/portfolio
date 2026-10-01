// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'
import { getCaseStudies } from '@/content/loaders'

describe('sitemap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('lista as rotas estáticas e os estudos de caso, com URL absoluta', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://exemplo.dev')
    const caseStudies = await getCaseStudies()
    expect((await sitemap()).map((entry) => entry.url)).toEqual([
      'https://exemplo.dev/',
      'https://exemplo.dev/about',
      'https://exemplo.dev/projects',
      ...caseStudies.map((project) => `https://exemplo.dev/projects/${project.slug}`),
    ])
  })
})
