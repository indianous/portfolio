import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Text } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import { ProjectHeader } from '@/components/projects/ProjectHeader'
import { getSiteUrl, siteConfig } from '@/config/site'
import { getProjects } from '@/content/loaders'
import { renderMarkdown } from '@/content/markdown'
import { buildMetadata } from '@/lib/seo'

// Cada projeto de content/projects vira uma página; qualquer outro slug é 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }))
}

async function findProject(slug: string) {
  const projects = await getProjects()
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1) notFound()
  return { project: projects[index], next: projects[index + 1] }
}

export async function generateMetadata({
  params,
}: Pick<PageProps<'/projects/[slug]'>, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const { project } = await findProject(slug)
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    image: project.cover
      ? { url: project.cover, alt: project.coverAlt ?? project.title }
      : undefined,
  })
}

export default async function ProjectPage({ params }: PageProps<'/projects/[slug]'>) {
  const { slug } = await params
  const { project, next } = await findProject(slug)
  const content = await renderMarkdown(project.body)
  const siteUrl = getSiteUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: new URL(`/projects/${project.slug}`, siteUrl).toString(),
    sameAs: project.liveUrl,
    dateCreated: project.date,
    keywords: project.technologies.join(', '),
    author: { '@type': 'Person', name: siteConfig.name, url: siteUrl },
    ...(project.cover && { image: new URL(project.cover, siteUrl).toString() }),
  }

  return (
    <article className="flex flex-col gap-10 py-12">
      <script
        type="application/ld+json"
        // `<` escapado, como recomenda o guia de JSON-LD do Next.js.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <ProjectHeader project={project} />
      <div className="min-w-0 max-w-3xl">{content}</div>
      {next && (
        <nav
          aria-label="Próximo projeto"
          className="flex flex-col items-start gap-2 border-t border-border pt-8"
        >
          <Text as="span" size="sm" color="muted">
            Próximo projeto
          </Text>
          <ButtonLink href={`/projects/${next.slug}`} variant="outline">
            {next.title}
          </ButtonLink>
        </nav>
      )}
    </article>
  )
}
