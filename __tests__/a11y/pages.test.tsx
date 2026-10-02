import { render } from '@testing-library/react'
import axe from 'axe-core'
import { describe, expect, it, vi } from 'vitest'
import AboutPage from '@/app/about/page'
import PostPage from '@/app/blog/[slug]/page'
import BlogPage from '@/app/blog/page'
import Home from '@/app/page'
import ProjectPage from '@/app/projects/[slug]/page'
import ProjectsPage from '@/app/projects/page'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getPosts, getProjects } from '@/content/loaders'

vi.mock('next/link', () => import('../stubs/next-link'))
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  notFound: () => {
    throw new Error('notFound')
  },
}))

// Fragmentos de página fora do layout: sem landmarks em volta (region) e sem CSS (o contraste fica
// com o Lighthouse e com o teste de contraste do base-ds).
async function violations(ui: React.ReactElement) {
  const { container } = render(ui)
  const result = await axe.run(container, {
    rules: { 'color-contrast': { enabled: false }, region: { enabled: false } },
  })
  return result.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.html).join(' | ')}`)
}

const params = <T extends object>(value: T) => ({ params: Promise.resolve(value) }) as never

describe('acessibilidade das páginas (axe)', () => {
  it('home', async () => {
    expect(await violations(await Home())).toEqual([])
  })

  it('/projects', async () => {
    expect(await violations(await ProjectsPage())).toEqual([])
  })

  it('projeto', async () => {
    const [project] = await getProjects()
    expect(await violations(await ProjectPage(params({ slug: project.slug })))).toEqual([])
  })

  it('/blog', async () => {
    expect(await violations(await BlogPage())).toEqual([])
  })

  it('post', async () => {
    const [post] = await getPosts({ includeDrafts: true })
    expect(await violations(await PostPage(params({ slug: post.slug })))).toEqual([])
  })

  it('/about', async () => {
    expect(await violations(await AboutPage())).toEqual([])
  })

  it('cabeçalho e rodapé', async () => {
    expect(
      await violations(
        <>
          <SiteHeader />
          <SiteFooter year={2026} social={[{ label: 'GitHub', href: 'https://github.com/eu' }]} />
        </>,
      ),
    ).toEqual([])
  })
})
