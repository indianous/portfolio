// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { experienceSchema, postSchema, profileSchema, projectSchema } from '@/content/schemas'

function without<T extends object>(value: T, key: keyof T) {
  const copy = { ...value }
  delete copy[key]
  return copy
}

const project = {
  title: 'Projeto',
  summary: 'Resumo do projeto.',
  technologies: ['React', 'Node.js'],
  date: '2026-09-01',
  repoUrl: 'https://github.com/indianous/projeto',
  liveUrl: 'https://projeto.dev',
  cover: '/images/projeto.png',
  coverAlt: 'Tela do projeto',
  featured: true,
  order: 1,
}

describe('projectSchema', () => {
  it('aceita um projeto completo', () => {
    expect(projectSchema.parse(project)).toEqual(project)
  })

  it.each(['title', 'summary'])('rejeita projeto sem %s', (field) => {
    const rest = without(project, field as keyof typeof project)
    expect(projectSchema.safeParse(rest).success).toBe(false)
  })

  it('rejeita projeto sem tecnologias', () => {
    expect(projectSchema.safeParse({ ...project, technologies: [] }).success).toBe(false)
  })

  it('não destaca o projeto por padrão', () => {
    expect(projectSchema.parse(without(project, 'featured')).featured).toBe(false)
  })

  it('exige coverAlt quando há cover', () => {
    expect(projectSchema.safeParse(without(project, 'coverAlt')).success).toBe(false)
    expect(projectSchema.safeParse(without(without(project, 'coverAlt'), 'cover')).success).toBe(
      true,
    )
  })

  it('aceita destaques com valor e rótulo', () => {
    const highlights = [{ value: '−95%', label: 'de JS' }]
    expect(projectSchema.parse({ ...project, highlights }).highlights).toEqual(highlights)
    expect(projectSchema.safeParse({ ...project, highlights: [{ value: '−95%' }] }).success).toBe(
      false,
    )
  })

  it('rejeita repoUrl que não é URL', () => {
    expect(projectSchema.safeParse({ ...project, repoUrl: 'github' }).success).toBe(false)
  })
})

describe('postSchema', () => {
  const post = { title: 'Post', summary: 'Resumo do post.', date: '2026-09-01' }

  it('aceita a data como texto ou como Date do YAML e devolve AAAA-MM-DD', () => {
    expect(postSchema.parse(post).date).toBe('2026-09-01')
    expect(postSchema.parse({ ...post, date: new Date('2026-09-01') }).date).toBe('2026-09-01')
  })

  it('rejeita data inválida', () => {
    expect(postSchema.safeParse({ ...post, date: '01/09/2026' }).success).toBe(false)
    expect(postSchema.safeParse({ ...post, date: '2026-13-01' }).success).toBe(false)
  })

  it('não é rascunho e não tem tags por padrão', () => {
    const parsed = postSchema.parse(post)
    expect(parsed.draft).toBe(false)
    expect(parsed.tags).toEqual([])
  })
})

describe('experienceSchema', () => {
  const experience = { role: 'Dev', company: 'Empresa', start: '2024-03' }

  it('aceita experiência atual, sem end', () => {
    expect(experienceSchema.parse(experience).end).toBeUndefined()
  })

  it('exige start em AAAA-MM', () => {
    expect(experienceSchema.safeParse(without(experience, 'start')).success).toBe(false)
    expect(experienceSchema.safeParse({ ...experience, start: '03/2024' }).success).toBe(false)
  })

  it('aceita end em AAAA-MM', () => {
    expect(experienceSchema.parse({ ...experience, end: '2025-01' }).end).toBe('2025-01')
  })
})

describe('profileSchema', () => {
  it('exige headline', () => {
    expect(profileSchema.safeParse({}).success).toBe(false)
  })

  it('aceita photo e resume opcionais', () => {
    expect(profileSchema.parse({ headline: 'Frase' })).toEqual({ headline: 'Frase' })
    expect(
      profileSchema.parse({ headline: 'Frase', photo: '/foto.jpg', resume: '/curriculo.pdf' }),
    ).toEqual({ headline: 'Frase', photo: '/foto.jpg', resume: '/curriculo.pdf' })
  })
})
