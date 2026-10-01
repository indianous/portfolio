import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Text } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import { CaseStudyHeader } from '@/components/case-study/CaseStudyHeader'
import { Highlights } from '@/components/case-study/Highlights'
import { TableOfContents } from '@/components/case-study/TableOfContents'
import { getSiteUrl, siteConfig } from '@/config/site'
import { extractHeadings } from '@/content/headings'
import { getCaseStudies } from '@/content/loaders'
import { renderMarkdown } from '@/content/markdown'
import { buildMetadata } from '@/lib/seo'

// Só os projetos com estudo de caso viram página; qualquer outro slug é 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getCaseStudies()).map(({ slug }) => ({ slug }))
}

async function findCaseStudy(slug: string) {
  const caseStudies = await getCaseStudies()
  const index = caseStudies.findIndex((project) => project.slug === slug)
  if (index === -1) notFound()
  return { project: caseStudies[index], next: caseStudies[index + 1] }
}

export async function generateMetadata({
  params,
}: Pick<PageProps<'/projects/[slug]'>, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const { project } = await findCaseStudy(slug)
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover
      ? { url: project.cover, alt: project.coverAlt ?? project.title }
      : undefined,
  })
}

export default async function CaseStudyPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const { project, next } = await findCaseStudy(slug)
  const content = await renderMarkdown(project.body)
  const siteUrl = getSiteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: new URL(`/projects/${project.slug}`, siteUrl).toString(),
    dateCreated: project.date,
    keywords: project.technologies.join(', '),
    author: { '@type': 'Person', name: siteConfig.name, url: siteUrl },
    ...(project.cover && { image: new URL(project.cover, siteUrl).toString() }),
    ...(project.repoUrl && { codeRepository: project.repoUrl }),
  }

  return (
    <article className="flex flex-col gap-10 py-12">
      <script
        type="application/ld+json"
        // `<` escapado, como recomenda o guia de JSON-LD do Next.js.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <CaseStudyHeader project={project} />
      <Highlights highlights={project.highlights ?? []} />
      <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-start">
        <aside className="lg:sticky lg:top-24 lg:w-56 lg:shrink-0">
          <TableOfContents headings={extractHeadings(project.body)} />
        </aside>
        <div className="min-w-0 max-w-3xl flex-1">{content}</div>
      </div>
      {next && (
        <nav
          aria-label="Próximo estudo de caso"
          className="flex flex-col items-start gap-2 border-t border-border pt-8"
        >
          <Text as="span" size="sm" color="muted">
            Próximo estudo de caso
          </Text>
          <ButtonLink href={`/projects/${next.slug}`} variant="outline">
            {next.title}
          </ButtonLink>
        </nav>
      )}
    </article>
  )
}
