import { Badge, Button, Heading } from '@indianous/base-ds'
import { Timeline } from '@/components/about/Timeline'
import { siteConfig } from '@/config/site'
import { getAllTechnologies, getExperience, getProfile } from '@/content/loaders'
import { renderMarkdown } from '@/content/markdown'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'Sobre',
  description: `Trajetória profissional e tecnologias de ${siteConfig.name}, ${siteConfig.role.toLowerCase()}.`,
  path: '/about',
})

export default async function AboutPage() {
  const [profile, experience, projectTechnologies] = await Promise.all([
    getProfile(),
    getExperience(),
    getAllTechnologies(),
  ])
  const summary = await renderMarkdown(profile.body)
  const timeline = await Promise.all(
    experience.map(async (item) => ({
      experience: item,
      description: await renderMarkdown(item.body),
    })),
  )
  // Tecnologias dos projetos e da trajetória, sem repetir.
  const technologies = [
    ...new Set([...projectTechnologies, ...experience.flatMap((item) => item.technologies)]),
  ].sort((a, b) => a.localeCompare(b, 'pt-BR'))

  return (
    <div className="flex max-w-3xl flex-col gap-12 py-12">
      <section className="flex flex-col gap-6">
        <Heading as="h1" size="4xl">
          Sobre
        </Heading>
        {summary}
        {profile.resume && (
          <Button as="a" href={profile.resume} variant="outline" className="self-start">
            Baixar currículo (PDF)
          </Button>
        )}
      </section>

      <section aria-labelledby="trajetoria" className="flex flex-col gap-6">
        <Heading as="h2" size="2xl" id="trajetoria">
          Trajetória
        </Heading>
        <Timeline items={timeline} />
      </section>

      <section aria-labelledby="tecnologias" className="flex flex-col gap-6">
        <Heading as="h2" size="2xl" id="tecnologias">
          Tecnologias
        </Heading>
        <ul aria-labelledby="tecnologias" className="flex flex-wrap gap-2">
          {technologies.map((technology) => (
            <li key={technology}>
              <Badge>{technology}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
