import type { MetadataRoute } from 'next'
import { getSiteUrl, staticRoutes } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  return staticRoutes.map((route) => ({ url: new URL(route, siteUrl).toString() }))
}
