// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

async function headersFor(env: 'production' | 'development') {
  vi.stubEnv('NODE_ENV', env)
  vi.resetModules()
  const { default: config } = await import('../next.config')
  const rules = (await config.headers?.()) ?? []
  const all = rules.find((rule) => rule.source === '/(.*)')
  return Object.fromEntries((all?.headers ?? []).map(({ key, value }) => [key, value]))
}

describe('cabeçalhos de segurança', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('envia os cabeçalhos em todas as rotas', async () => {
    const headers = await headersFor('production')
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(headers['X-Frame-Options']).toBe('DENY')
    expect(headers['Permissions-Policy']).toContain('camera=()')
  })

  it('restringe o CSP sem quebrar o site estático', async () => {
    const csp = (await headersFor('production'))['Content-Security-Policy']
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("object-src 'none'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("base-uri 'self'")
    expect(csp).not.toContain("'unsafe-eval'")
    expect(csp).not.toContain('\n')
  })

  it('libera unsafe-eval só em desenvolvimento (exigido pelo next dev)', async () => {
    expect((await headersFor('development'))['Content-Security-Policy']).toContain("'unsafe-eval'")
  })
})
