import type { Experience, Post, Project } from '@/content/schemas'

// Fábricas de conteúdo para os testes de componentes.

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    slug: 'projeto',
    title: 'Projeto',
    summary: 'Resumo do projeto.',
    technologies: ['React'],
    date: '2026-01-01',
    featured: false,
    hasCaseStudy: false,
    body: '',
    ...overrides,
  }
}

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    slug: 'post',
    title: 'Post',
    summary: 'Resumo do post.',
    date: '2026-01-01',
    tags: [],
    draft: false,
    body: '',
    ...overrides,
  }
}

export function makeExperience(overrides: Partial<Experience> = {}): Experience {
  return {
    slug: 'experiencia',
    role: 'Desenvolvedor',
    company: 'Empresa',
    start: '2020-01',
    technologies: [],
    body: '',
    ...overrides,
  }
}
