// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const css = readFileSync(join(__dirname, '..', 'globals.css'), 'utf8').replace(/\s+/g, ' ')

describe('globals.css', () => {
  it('mostra o conteúdo animado sem JavaScript e com movimento reduzido', () => {
    expect(css).toMatch(
      /@media \(scripting: none\), \(prefers-reduced-motion: reduce\) \{ \[data-reveal\] \{ opacity: 1 !important; transform: none !important; \} \}/,
    )
  })
})
