// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const config = JSON.parse(readFileSync(join(__dirname, '..', 'lighthouserc.json'), 'utf8')).ci

describe('Lighthouse CI', () => {
  it('mede as páginas principais em 3 rodadas, no build de produção', () => {
    expect(config.collect.numberOfRuns).toBe(3)
    expect(config.collect.startServerCommand).toBe('npm run start')
    const paths = config.collect.url.map((url: string) => new URL(url).pathname)
    expect(paths).toEqual(['/', '/projects', '/projects/base-ds', '/blog', '/about'])
  })

  it('exige 100 em acessibilidade, boas práticas e SEO, e 99 em performance', () => {
    const assertions = config.assert.assertions
    for (const category of ['accessibility', 'best-practices', 'seo']) {
      expect(assertions[`categories:${category}`]).toEqual(['error', { minScore: 1 }])
    }
    expect(assertions['categories:performance']).toEqual(['error', { minScore: 0.99 }])
  })

  it('guarda os relatórios localmente, sem publicar em servidor externo', () => {
    expect(config.upload.target).toBe('filesystem')
  })
})
