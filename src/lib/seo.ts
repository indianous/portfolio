import type { Metadata } from 'next'
import { getSiteUrl, siteConfig } from '@/config/site'

interface PageSeo {
  title?: string
  description?: string
  path: string
  /** Imagem do Open Graph (a capa de um projeto), a partir de `public/`. */
  image?: { url: string; alt: string }
  /** Data de publicação (`AAAA-MM-DD`) de um post: o Open Graph vira `article`. */
  publishedTime?: string
  /** Caminho do feed RSS, anunciado no `<head>`. */
  feed?: string
}

export function buildMetadata(
  { title, description = siteConfig.description, path, image, publishedTime, feed }: PageSeo,
  siteUrl = getSiteUrl(),
): Metadata {
  const fullTitle = title
    ? `${title} · ${siteConfig.name}`
    : `${siteConfig.name} — ${siteConfig.role}`
  const url = new URL(path, siteUrl).toString()

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      ...(feed && { types: { 'application/rss+xml': new URL(feed, siteUrl).toString() } }),
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: image || publishedTime ? 'article' : 'website',
      ...(publishedTime && { publishedTime }),
      ...(image && { images: [{ url: new URL(image.url, siteUrl).toString(), alt: image.alt }] }),
    },
  }
}
