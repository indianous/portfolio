// @vitest-environment node
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getAllTechnologies,
  getCaseStudies,
  getExperience,
  getPostBySlug,
  getPosts,
  getProfile,
  getProjectBySlug,
  getProjects,
} from '@/content/loaders'

const dir = join(__dirname, 'fixtures', 'valid')
const invalidDir = join(__dirname, 'fixtures', 'invalid')
const invalidCaseStudyDir = join(__dirname, 'fixtures', 'invalid-case-study')

describe('getProjects', () => {
  it('usa o nome do arquivo como slug e ordena por order e depois pela data mais recente', async () => {
    const projects = await getProjects({ dir })
    expect(projects.map((p) => p.slug)).toEqual(['beta', 'alfa', 'gama', 'delta'])
  })

  it('marca o estudo de caso só quando o corpo não está vazio', async () => {
    const projects = await getProjects({ dir })
    const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))
    expect(bySlug.beta.hasCaseStudy).toBe(true)
    expect(bySlug.beta.body).toContain('## Problema')
    expect(bySlug.alfa.hasCaseStudy).toBe(false)
  })

  it('falha com o caminho do arquivo quando o frontmatter é inválido', async () => {
    await expect(getProjects({ dir: invalidDir })).rejects.toThrow(/projects[/\\]sem-titulo\.md/)
  })
})

describe('estudos de caso', () => {
  it('falha quando faltam as seções obrigatórias, com o arquivo e as seções', async () => {
    await expect(getProjects({ dir: invalidCaseStudyDir })).rejects.toThrow(
      /projects[/\\]incompleto\.md[\s\S]*## Arquitetura, ## Resultados/,
    )
  })

  it('getCaseStudies devolve só os projetos com estudo de caso', async () => {
    expect((await getCaseStudies({ dir })).map((p) => p.slug)).toEqual(['beta'])
  })
})

describe('getProjectBySlug', () => {
  it('devolve o projeto do slug', async () => {
    expect((await getProjectBySlug('gama', { dir }))?.title).toBe('Gama')
  })

  it('devolve null para slug inexistente', async () => {
    expect(await getProjectBySlug('inexistente', { dir })).toBeNull()
  })
})

describe('getAllTechnologies', () => {
  it('devolve as tecnologias únicas e em ordem alfabética', async () => {
    expect(await getAllTechnologies({ dir })).toEqual([
      'Docker',
      'Node.js',
      'Python',
      'React',
      'TypeScript',
    ])
  })
})

describe('getPosts', () => {
  it('ordena da data mais recente para a mais antiga, com rascunhos quando pedido', async () => {
    const posts = await getPosts({ dir, includeDrafts: true })
    expect(posts.map((p) => p.slug)).toEqual(['rascunho', 'recente', 'antigo'])
  })

  it('calcula o tempo de leitura de cada post', async () => {
    const posts = await getPosts({ dir, includeDrafts: true })
    expect(posts.every((post) => post.readingMinutes === 1)).toBe(true)
  })

  it('ignora rascunhos sem includeDrafts', async () => {
    const posts = await getPosts({ dir, includeDrafts: false })
    expect(posts.map((p) => p.slug)).toEqual(['recente', 'antigo'])
  })
})

describe('getPostBySlug', () => {
  it('devolve o post do slug', async () => {
    expect((await getPostBySlug('recente', { dir }))?.tags).toEqual(['react'])
  })

  it('devolve null para rascunho sem includeDrafts', async () => {
    expect(await getPostBySlug('rascunho', { dir, includeDrafts: false })).toBeNull()
  })
})

describe('getExperience', () => {
  it('ordena do início mais recente para o mais antigo, com a descrição no corpo', async () => {
    const experience = await getExperience({ dir })
    expect(experience.map((e) => e.company)).toEqual(['Empresa B', 'Empresa A'])
    expect(experience[0].end).toBeUndefined()
    expect(experience[0].body.trim()).toBe('Descrição da experiência B.')
  })
})

describe('getProfile', () => {
  it('lê profile.md com o corpo', async () => {
    const profile = await getProfile({ dir })
    expect(profile.headline).toBe('Frase de apresentação.')
    expect(profile.body.trim()).toBe('Resumo do perfil.')
  })
})

describe('conteúdo do site (content/)', () => {
  it('tem frontmatter válido em todos os arquivos', async () => {
    await expect(getProjects()).resolves.not.toHaveLength(0)
    await expect(getPosts({ includeDrafts: true })).resolves.not.toHaveLength(0)
    await expect(getExperience()).resolves.not.toHaveLength(0)
    await expect(getProfile()).resolves.toHaveProperty('headline')
  })
})
