// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { siteConfig } from '@/config/site'
import { generateMetadata, generateStaticParams } from '@/app/projects/[slug]/page'
import { getProjects } from '@/content/loaders'

describe('página de estudo de caso', () => {
  it('gera só os slugs dos projetos com estudo de caso', async () => {
    const withCaseStudy = (await getProjects()).filter((p) => p.hasCaseStudy).map((p) => p.slug)
    expect(await generateStaticParams()).toEqual(withCaseStudy.map((slug) => ({ slug })))
    expect(withCaseStudy).not.toHaveLength(0)
  })

  it('usa título e resumo do projeto nos metadados', async () => {
    const [project] = (await getProjects()).filter((p) => p.hasCaseStudy)
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: project.slug }) })
    expect(metadata.title).toEqual({ absolute: `${project.title} · ${siteConfig.name}` })
    expect(metadata.description).toBe(project.summary)
    expect(metadata.alternates?.canonical).toMatch(new RegExp(`/projects/${project.slug}$`))
  })
})
