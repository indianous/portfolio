import { Footer } from '@indianous/base-ds'
import { siteConfig, type NavLink } from '@/config/site'

interface SiteFooterProps {
  year: number
  social: NavLink[]
}

export function SiteFooter({ year, social }: SiteFooterProps) {
  return (
    <Footer
      columns={[
        { title: 'Navegação', links: [...siteConfig.nav] },
        { title: 'Redes', links: social },
      ]}
      copyright={`© ${year} ${siteConfig.name}`}
    />
  )
}
