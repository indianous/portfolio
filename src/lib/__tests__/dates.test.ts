// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatDate, formatYearMonth } from '@/lib/dates'

describe('formatDate', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('formata AAAA-MM-DD por extenso em pt-BR', () => {
    expect(formatDate('2026-09-01')).toBe('1 de setembro de 2026')
  })

  it('não volta um dia em fusos a oeste de UTC', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo')
    expect(formatDate('2026-09-01')).toBe('1 de setembro de 2026')
  })
})

describe('formatYearMonth', () => {
  it('formata AAAA-MM com o mês abreviado', () => {
    expect(formatYearMonth('2016-01')).toBe('jan. de 2016')
  })
})
