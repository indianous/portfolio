import { describe, expect, it } from 'vitest'
import { getContactHref, getSiteUrl, getSocialLinks, siteConfig, staticRoutes } from '@/config/site'

describe('getSiteUrl', () => {
  it('usa NEXT_PUBLIC_SITE_URL sem barra final', () => {
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: 'https://exemplo.dev/' })).toBe('https://exemplo.dev')
  })

  it('usa o domínio de produção da Vercel quando não há NEXT_PUBLIC_SITE_URL', () => {
    expect(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app' })).toBe(
      'https://portfolio.vercel.app',
    )
  })

  it('prefere NEXT_PUBLIC_SITE_URL ao domínio da Vercel', () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: 'https://exemplo.dev',
        VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app',
      }),
    ).toBe('https://exemplo.dev')
  })

  it('cai para localhost sem nenhuma variável', () => {
    expect(getSiteUrl({})).toBe('http://localhost:3000')
  })
})

describe('getSocialLinks', () => {
  it('sem variáveis, tem só o GitHub', () => {
    expect(getSocialLinks({})).toEqual([{ label: 'GitHub', href: siteConfig.github }])
  })

  it('inclui LinkedIn e e-mail quando definidos, nessa ordem', () => {
    expect(
      getSocialLinks({
        LINKEDIN_URL: 'https://www.linkedin.com/in/exemplo',
        CONTACT_EMAIL: 'contato@exemplo.dev',
      }),
    ).toEqual([
      { label: 'GitHub', href: siteConfig.github },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/exemplo' },
      { label: 'E-mail', href: 'mailto:contato@exemplo.dev' },
    ])
  })

  it('ignora valores vazios ou só com espaços', () => {
    expect(getSocialLinks({ LINKEDIN_URL: '  ', CONTACT_EMAIL: '' })).toEqual([
      { label: 'GitHub', href: siteConfig.github },
    ])
  })

  it('remove espaços em volta dos valores', () => {
    expect(getSocialLinks({ CONTACT_EMAIL: ' contato@exemplo.dev ' })).toContainEqual({
      label: 'E-mail',
      href: 'mailto:contato@exemplo.dev',
    })
  })
})

describe('getContactHref', () => {
  it('prefere o e-mail', () => {
    expect(
      getContactHref({
        CONTACT_EMAIL: ' eu@exemplo.dev ',
        LINKEDIN_URL: 'https://linkedin.com/in/eu',
      }),
    ).toBe('mailto:eu@exemplo.dev')
  })

  it('usa o LinkedIn quando não há e-mail', () => {
    expect(getContactHref({ LINKEDIN_URL: 'https://linkedin.com/in/eu' })).toBe(
      'https://linkedin.com/in/eu',
    )
  })

  it('devolve undefined sem e-mail nem LinkedIn', () => {
    expect(getContactHref({ CONTACT_EMAIL: '  ' })).toBeUndefined()
  })
})

describe('staticRoutes', () => {
  it('inclui a home e o /about', () => {
    expect(staticRoutes).toEqual(['/', '/about'])
  })
})
