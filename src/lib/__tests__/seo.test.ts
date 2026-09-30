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
})
