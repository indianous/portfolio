import type { MetadataRoute } from 'next'
import { getSiteUrl, staticRoutes } from '@/config/site'
import { getPosts, getProjects } from '@/content/loaders'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const projects = (await getProjects()).map(({ slug }) => `/projects/${slug}`)
  const posts = (await getPosts()).map(({ slug }) => `/blog/${slug}`)
  return [...staticRoutes, ...projects, ...posts].map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }))
}
