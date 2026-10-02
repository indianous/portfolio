// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { siteConfig } from '@/config/site'
import { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { getProjects } from '@/content/loaders'

describe('página do projeto', () => {
  it('gera o slug de todos os projetos', async () => {
    const slugs = (await getProjects()).map((p) => p.slug)
    expect(await generateStaticParams()).toEqual(slugs.map((slug) => ({ slug })))
    expect(slugs).not.toHaveLength(0)
  })

  it('usa título e resumo do projeto nos metadados', async () => {
    const [project] = await getProjects()
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: project.slug }) })
    expect(metadata.title).toEqual({ absolute: `${project.title} · ${siteConfig.name}` })
    expect(metadata.description).toBe(project.summary)
    expect(metadata.alternates?.canonical).toMatch(new RegExp(`/projects/${project.slug}$`))
  })
})
