// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import robots from '@/app/robots'

describe('robots', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('libera todos os robôs e aponta para o sitemap absoluto', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://exemplo.dev')
    const result = robots()
    expect(result.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(result.sitemap).toBe('https://exemplo.dev/sitemap.xml')
  })
})
