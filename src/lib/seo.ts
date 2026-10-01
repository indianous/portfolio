import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from '@/config/site'

interface PageSeo {
  title?: string
  description?: string
  path: string
  /** Imagem do Open Graph (a capa de um projeto), a partir de `public/`. */
  image?: { url: string; alt: string }
}

export function buildMetadata(
  { title, description = siteConfig.description, path, image }: PageSeo,
  siteUrl = getSiteUrl(),
): Metadata {
  const fullTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.role}`
  const url = new URL(path, siteUrl).toString()

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: image ? 'article' : 'website',
      ...(image && { images: [{ url: new URL(image.url, siteUrl).toString(), alt: image.alt }] }),
    },
  }
}
