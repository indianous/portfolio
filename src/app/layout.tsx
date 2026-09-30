import type { Metadata } from 'next'
import { Container } from '@indianous/base-ds'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SkipLink } from '@/components/layout/SkipLink'
import { getSiteUrl, getSocialLinks } from '@/config/site'
import { buildMetadata } from '@/lib/seo'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...buildMetadata({ path: '/' }),
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <SiteHeader />
        <Container as="main" id="conteudo" tabIndex={-1} className="flex-1 focus:outline-none">
          {children}
        </Container>
        <SiteFooter year={new Date().getFullYear()} social={getSocialLinks()} />
      </body>
    </html>
  )
}
