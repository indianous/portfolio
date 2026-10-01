// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { makePost } from '../../../../../__tests__/stubs/content'

const posts = vi.hoisted(() => ({ current: [] as unknown[] }))
vi.mock('@/content/loaders', () => ({ getPosts: async () => posts.current }))

const { GET, dynamic } = await import('@/app/blog/rss.xml/route')

describe('feed RSS do blog', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('é gerado no build', () => {
    expect(dynamic).toBe('force-static')
  })

  it('tem um item por post, com link absoluto e texto escapado', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://exemplo.dev')
    posts.current = [
      makePost({ slug: 'um', title: 'React & <Next>', summary: 'Resumo 1.', date: '2026-09-01' }),
      makePost({ slug: 'dois', title: 'Dois', summary: 'Resumo 2.', date: '2026-08-01' }),
    ]
    const response = await GET()
    expect(response.headers.get('Content-Type')).toContain('application/rss+xml')
    const xml = await response.text()
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml.match(/<item>/g)).toHaveLength(2)
    expect(xml).toContain('<title>React &amp; &lt;Next&gt;</title>')
    expect(xml).toContain('<link>https://exemplo.dev/blog/um</link>')
    expect(xml).toContain('<pubDate>Tue, 01 Sep 2026 00:00:00 GMT</pubDate>')
    expect(xml).toContain('<description>Resumo 1.</description>')
  })
})
