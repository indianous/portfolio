import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'
import {
  experienceSchema,
  postSchema,
  projectSchema,
  type Experience,
  type Post,
  type Project,
} from '@/content/schemas'

const CONTENT_DIR = join(process.cwd(), 'content')

interface LoaderOptions {
  /** Pasta com `projects/`, `posts/` e `experience/`. Padrão: `content/` na raiz. */
  dir?: string
}

interface PostOptions extends LoaderOptions {
  /** Inclui posts com `draft: true`. Padrão: só fora de produção. */
  includeDrafts?: boolean
}

/** Lê e valida todos os `.md` de uma pasta. Frontmatter inválido falha com o caminho do arquivo. */
async function loadCollection<T extends object>(
  dir: string,
  folder: string,
  schema: z.ZodType<T>,
): Promise<(T & { slug: string; body: string })[]> {
  const folderPath = join(dir, folder)
  const files = (await readdir(folderPath)).filter((file) => file.endsWith('.md')).sort()

  return Promise.all(
    files.map(async (file) => {
      const path = join(folderPath, file)
      const { data, content } = matter(await readFile(path, 'utf8'))
      const parsed = schema.safeParse(data)
      if (!parsed.success) {
        throw new Error(`Frontmatter inválido em ${path}:\n${z.prettifyError(parsed.error)}`)
      }
      return { ...parsed.data, slug: file.slice(0, -'.md'.length), body: content }
    }),
  )
}

// Projetos com `order` primeiro (crescente); depois, e no empate, os mais recentes.
function compareProjects(a: Project, b: Project) {
  const orderA = a.order ?? Number.POSITIVE_INFINITY
  const orderB = b.order ?? Number.POSITIVE_INFINITY
  if (orderA !== orderB) return orderA - orderB
  return b.date.localeCompare(a.date)
}

export async function getProjects({ dir = CONTENT_DIR }: LoaderOptions = {}): Promise<Project[]> {
  const projects = await loadCollection(dir, 'projects', projectSchema)
  return projects
    .map((project) => ({ ...project, hasCaseStudy: project.body.trim() !== '' }))
    .sort(compareProjects)
}

export async function getProjectBySlug(
  slug: string,
  options?: LoaderOptions,
): Promise<Project | null> {
  return (await getProjects(options)).find((project) => project.slug === slug) ?? null
}

export async function getAllTechnologies(options?: LoaderOptions): Promise<string[]> {
  const technologies = new Set((await getProjects(options)).flatMap((p) => p.technologies))
  return [...technologies].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export async function getPosts({
  dir = CONTENT_DIR,
  includeDrafts = process.env.NODE_ENV !== 'production',
}: PostOptions = {}): Promise<Post[]> {
  const posts = await loadCollection(dir, 'posts', postSchema)
  return posts
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
}

export async function getPostBySlug(slug: string, options?: PostOptions): Promise<Post | null> {
  return (await getPosts(options)).find((post) => post.slug === slug) ?? null
}

export async function getExperience({ dir = CONTENT_DIR }: LoaderOptions = {}): Promise<
  Experience[]
> {
  const experience = await loadCollection(dir, 'experience', experienceSchema)
  return experience.sort((a, b) => b.start.localeCompare(a.start))
}
