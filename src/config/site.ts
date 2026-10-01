export interface NavLink {
  label: string
  href: string
}

export const siteConfig = {
  name: 'João Victor do Nascimento',
  role: 'Desenvolvedor Full-Stack',
  description:
    'Portfólio de João Victor do Nascimento, desenvolvedor full-stack: aplicações web, projetos open-source e estudos de caso.',
  locale: 'pt_BR',
  github: 'https://github.com/indianous',
  nav: [
    { label: 'Projetos', href: '/projects' },
    { label: 'Blog', href: '/blog' },
    { label: 'Sobre', href: '/about' },
  ] satisfies NavLink[],
  /** Textos de acessibilidade do menu (o Navbar do base-ds usa inglês por padrão). */
  navLabels: {
    label: 'Navegação principal',
    menuButtonLabel: 'Abrir menu de navegação',
    actionsButtonLabel: 'Mais ações',
    menuTitle: 'Menu',
    actionsTitle: 'Ações',
    drawerCloseLabel: 'Fechar',
    drawerDismissLabel: 'Fechar painel',
  },
} as const

/** Rotas estáticas publicadas no sitemap. Cada etapa acrescenta a sua quando a página existir. */
export const staticRoutes = ['/']

type SiteEnv = Record<string, string | undefined>

/** URL absoluta do site, sem barra final. Uso no servidor (metadata, sitemap, robots). */
export function getSiteUrl(env: SiteEnv = process.env): string {
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, '')
  if (env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

/** Redes do rodapé. LinkedIn e e-mail vêm do ambiente e só aparecem quando definidos. */
export function getSocialLinks(env: SiteEnv = process.env): NavLink[] {
  const linkedin = env.LINKEDIN_URL?.trim()
  const email = env.CONTACT_EMAIL?.trim()

  return [
    { label: 'GitHub', href: siteConfig.github },
    ...(linkedin ? [{ label: 'LinkedIn', href: linkedin }] : []),
    ...(email ? [{ label: 'E-mail', href: `mailto:${email}` }] : []),
  ]
}
