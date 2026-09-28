// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Garante que o base-ds é instalado do GitHub Packages pelo nome com escopo.
// Alias `npm:` → o Dependabot não resolve (indianous/base-ds#44).
// `file:`/`link:` → symlink, duas instâncias de React (indianous/base-ds#38).

const root = join(__dirname, '..')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

const allDependencies: Record<string, string> = {
  ...pkg.dependencies,
  ...pkg.devDependencies,
  ...pkg.peerDependencies,
  ...pkg.optionalDependencies,
}

describe('dependência do base-ds', () => {
  it('declara @indianous/base-ds em dependencies com faixa semver', () => {
    expect(pkg.dependencies?.['@indianous/base-ds']).toMatch(/^\^\d+\.\d+\.\d+$/)
  })

  it('não usa alias npm: para o base-ds', () => {
    const aliases = Object.entries(allDependencies).filter(([, spec]) =>
      spec.startsWith('npm:@indianous/base-ds'),
    )
    expect(aliases).toEqual([])
  })

  it('não instala o base-ds por file: ou link:', () => {
    const local = Object.entries(allDependencies).filter(
      ([name, spec]) =>
        (name.includes('base-ds') || spec.includes('base-ds')) && /^(file|link):/.test(spec),
    )
    expect(local).toEqual([])
  })
})

describe('.npmrc', () => {
  const npmrcPath = join(root, '.npmrc')
  const npmrc = existsSync(npmrcPath) ? readFileSync(npmrcPath, 'utf8') : ''

  it('aponta o escopo @indianous para o GitHub Packages', () => {
    expect(npmrc).toMatch(/^@indianous:registry=https:\/\/npm\.pkg\.github\.com\/?$/m)
  })

  it('lê o token de GITHUB_PACKAGES_TOKEN, sem token literal', () => {
    expect(npmrc).toMatch(/^\/\/npm\.pkg\.github\.com\/:_authToken=\$\{GITHUB_PACKAGES_TOKEN\}$/m)
    expect(npmrc).not.toMatch(/gh[pousr]_[A-Za-z0-9]+/)
  })
})
