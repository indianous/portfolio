import type { MetadataRoute } from 'next'
import { getSiteUrl, staticRoutes } from '@/config/site'
import { getCaseStudies } from '@/content/loaders'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const caseStudies = (await getCaseStudies()).map(({ slug }) => `/projects/${slug}`)
  return [...staticRoutes, ...caseStudies].map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }))
}
