// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import sitemap from '@/app/sitemap'

describe('sitemap', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('lista as rotas estáticas com URL absoluta', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://exemplo.dev')
    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://exemplo.dev/',
      'https://exemplo.dev/about',
      'https://exemplo.dev/projects',
    ])
  })
})
