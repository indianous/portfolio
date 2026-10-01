import { getSiteUrl, siteConfig } from '@/config/site'
import { getPosts } from '@/content/loaders'

// Gerado no build: desde o Next.js 15, um GET é dinâmico por padrão.
export const dynamic = 'force-static'

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET() {
  const siteUrl = getSiteUrl()
  const posts = await getPosts()
  const blogUrl = new URL('/blog', siteUrl).toString()

  const items = posts.map((post) => {
    const url = new URL(`/blog/${post.slug}`, siteUrl).toString()
    return [
      '<item>',
      `<title>${escapeXml(post.title)}</title>`,
      `<link>${url}</link>`,
      `<guid isPermaLink="true">${url}</guid>`,
      `<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
      `<description>${escapeXml(post.summary)}</description>`,
      '</item>',
    ].join('')
  })

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${escapeXml(`Blog · ${siteConfig.name}`)}</title>`,
    `<link>${blogUrl}</link>`,
    `<description>${escapeXml(`Artigos de ${siteConfig.name}`)}</description>`,
    '<language>pt-BR</language>',
    `<atom:link href="${new URL('/blog/rss.xml', siteUrl)}" rel="self" type="application/rss+xml"/>`,
    ...items,
    '</channel>',
    '</rss>',
  ].join('\n')

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
