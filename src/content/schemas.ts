import { z } from 'zod'

// O YAML converte `date: 2026-09-01` (sem aspas) em Date; normaliza para AAAA-MM-DD.
const isoDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.iso.date(),
)

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use o formato AAAA-MM')

export const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  date: isoDate,
  repoUrl: z.url().optional(),
  liveUrl: z.url().optional(),
  cover: z.string().min(1).optional(),
  featured: z.boolean().default(false),
  order: z.number().int().optional(),
})

export const postSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: isoDate,
  tags: z.array(z.string().min(1)).default([]),
  draft: z.boolean().default(false),
})

export const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  start: yearMonth,
  end: yearMonth.optional(),
  location: z.string().min(1).optional(),
  technologies: z.array(z.string().min(1)).default([]),
})

interface Entry {
  /** Nome do arquivo, sem `.md`. */
  slug: string
  /** Corpo em Markdown, depois do frontmatter. */
  body: string
}

export type Project = z.infer<typeof projectSchema> & Entry & { hasCaseStudy: boolean }
export type Post = z.infer<typeof postSchema> & Entry
export type Experience = z.infer<typeof experienceSchema> & Entry
