import type { Project } from '@/content/schemas'

/** Forma da tecnologia na URL: `Tailwind CSS` → `tailwind-css`. */
export function toTechSlug(technology: string): string {
  return technology.trim().toLowerCase().replace(/\s+/g, '-')
}

/** Lê `?tech=` e devolve as tecnologias conhecidas, com a grafia original e sem repetir. */
export function parseTechQuery(query: string | null, technologies: string[]): string[] {
  if (!query) return []
  const bySlug = new Map(technologies.map((technology) => [toTechSlug(technology), technology]))
  const selected = query
    .split(',')
    .map((slug) => bySlug.get(toTechSlug(slug)))
    .filter((technology): technology is string => technology !== undefined)
  return [...new Set(selected)]
}

/** Valor de `?tech=`; `null` quando não há seleção, para o parâmetro sair da URL. */
export function serializeTechQuery(selected: string[]): string | null {
  return selected.length > 0 ? selected.map(toTechSlug).join(',') : null
}

/** Projetos com qualquer uma das tecnologias selecionadas; sem seleção, todos. */
export function filterProjects(projects: Project[], selected: string[]): Project[] {
  if (selected.length === 0) return projects
  const wanted = new Set(selected.map(toTechSlug))
  return projects.filter((project) =>
    project.technologies.some((technology) => wanted.has(toTechSlug(technology))),
  )
}
