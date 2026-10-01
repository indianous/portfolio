import type { MetadataRoute } from 'next'
import { getSiteUrl, staticRoutes } from '@/config/site'
import { getCaseStudies, getPosts } from '@/content/loaders'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const caseStudies = (await getCaseStudies()).map(({ slug }) => `/projects/${slug}`)
  const posts = (await getPosts()).map(({ slug }) => `/blog/${slug}`)
  return [...staticRoutes, ...caseStudies, ...posts].map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }))
}
