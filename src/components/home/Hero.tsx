import { Button, Heading, Image, Text } from '@indianous/base-ds'
import { ButtonLink } from '@/components/ButtonLink'
import { siteConfig } from '@/config/site'

interface HeroProps {
  /** Frase de apresentação (`content/profile.md`). */
  headline: string
  /** Destino do botão "Contato"; sem ele, o botão não aparece. */
  contactHref?: string
  /** Foto, a partir de `public/`. */
  photo?: string
}

export function Hero({ headline, contactHref, photo }: HeroProps) {
  return (
    <section className="flex flex-col-reverse gap-8 py-12 md:flex-row md:items-center md:justify-between md:py-20">
      <div className="flex max-w-2xl flex-col gap-6">
        <Heading as="h1" size="4xl">
          {siteConfig.name}
          <Text as="span" size="lg" weight="medium" color="muted" className="mt-2 block">
            {siteConfig.role}
          </Text>
        </Heading>
        <Text size="lg">{headline}</Text>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/projects" size="lg">
            Ver projetos
          </ButtonLink>
          {contactHref && (
            <Button as="a" href={contactHref} variant="outline" size="lg">
              Contato
            </Button>
          )}
        </div>
      </div>
      {photo && (
        <Image
          src={photo}
          alt={siteConfig.name}
          aspectRatio="square"
          priority
          sizes="(min-width: 768px) 16rem, 10rem"
          className="w-40 shrink-0 rounded-full md:w-64"
        />
      )}
    </section>
  )
}
