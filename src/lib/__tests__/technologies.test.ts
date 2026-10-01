// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { makeProject } from '../../../__tests__/stubs/content'
import { filterProjects, parseTechQuery, serializeTechQuery, toTechSlug } from '@/lib/technologies'

const technologies = ['Node.js', 'React', 'Tailwind CSS']

describe('toTechSlug', () => {
  it('usa minúsculas e troca espaços por hífen', () => {
    expect(toTechSlug('Tailwind CSS')).toBe('tailwind-css')
    expect(toTechSlug('Node.js')).toBe('node.js')
  })
})

describe('parseTechQuery', () => {
  it('devolve as tecnologias com a grafia original', () => {
    expect(parseTechQuery('react,tailwind-css', technologies)).toEqual(['React', 'Tailwind CSS'])
  })

  it('ignora vazios, repetidos e desconhecidos', () => {
    expect(parseTechQuery(',react,,REACT,cobol', technologies)).toEqual(['React'])
  })

  it('devolve lista vazia sem parâmetro', () => {
    expect(parseTechQuery(null, technologies)).toEqual([])
  })
})

describe('serializeTechQuery', () => {
  it('devolve null sem seleção, para o parâmetro sair da URL', () => {
    expect(serializeTechQuery([])).toBeNull()
  })

  it('junta os slugs com vírgula', () => {
    expect(serializeTechQuery(['React', 'Node.js'])).toBe('react,node.js')
  })
})

describe('filterProjects', () => {
  const projects = [
    makeProject({ slug: 'a', technologies: ['React', 'Node.js'] }),
    makeProject({ slug: 'b', technologies: ['Python'] }),
    makeProject({ slug: 'c', technologies: ['Node.js'] }),
  ]

  it('devolve todos sem seleção', () => {
    expect(filterProjects(projects, [])).toEqual(projects)
  })

  it('devolve quem tem qualquer uma das tecnologias, uma vez só e na ordem original', () => {
    expect(filterProjects(projects, ['Node.js', 'React']).map((p) => p.slug)).toEqual(['a', 'c'])
  })

  it('compara sem diferenciar maiúsculas', () => {
    expect(filterProjects(projects, ['python']).map((p) => p.slug)).toEqual(['b'])
  })
})
