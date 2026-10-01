import { describe, expect, it } from 'vitest'
import { siteConfig } from '@/config/site'
import { buildMetadata } from '@/lib/seo'

const siteUrl = 'https://exemplo.dev'

describe('buildMetadata', () => {
  it('monta título "Título · Nome", canonical absoluto e Open Graph', () => {
    const metadata = buildMetadata(
      { title: 'Projetos', description: 'Todos os projetos', path: '/projects' },
      siteUrl,
    )

    expect(metadata.title).toEqual({ absolute: `Projetos · ${siteConfig.name}` })
    expect(metadata.description).toBe('Todos os projetos')
    expect(metadata.alternates?.canonical).toBe('https://exemplo.dev/projects')
    expect(metadata.openGraph).toMatchObject({
      title: `Projetos · ${siteConfig.name}`,
      description: 'Todos os projetos',
      url: 'https://exemplo.dev/projects',
      siteName: siteConfig.name,
      locale: 'pt_BR',
      type: 'website',
    })
  })

  it('sem título, usa "Nome — Cargo" (home)', () => {
    const metadata = buildMetadata({ path: '/' }, siteUrl)

    expect(metadata.title).toEqual({ absolute: `${siteConfig.name} — ${siteConfig.role}` })
    expect(metadata.alternates?.canonical).toBe('https://exemplo.dev/')
  })

  it('sem descrição, usa a descrição do site', () => {
    expect(buildMetadata({ path: '/' }, siteUrl).description).toBe(siteConfig.description)
  })

  it('com imagem, põe a capa no Open Graph e usa o tipo article', () => {
    const metadata = buildMetadata(
      { title: 'Alfa', path: '/projects/alfa', image: { url: '/images/alfa.png', alt: 'Tela' } },
      siteUrl,
    )
    expect(metadata.openGraph).toMatchObject({
      type: 'article',
      images: [{ url: 'https://exemplo.dev/images/alfa.png', alt: 'Tela' }],
    })
  })

  it('com data de publicação, gera Open Graph de artigo com publishedTime', () => {
    const metadata = buildMetadata(
      { title: 'Post', path: '/blog/post', publishedTime: '2026-09-01' },
      siteUrl,
    )
    expect(metadata.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-09-01' })
  })

  it('com feed, anuncia o RSS no head', () => {
    const metadata = buildMetadata({ path: '/blog', feed: '/blog/rss.xml' }, siteUrl)
    expect(metadata.alternates?.types).toEqual({
      'application/rss+xml': 'https://exemplo.dev/blog/rss.xml',
    })
  })
})
