'use client'

import { Button, Navbar } from '@indianous/base-ds'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <Navbar
      {...siteConfig.navLabels}
      sticky
      linkComponent={Link}
      logo={
        <Button asChild variant="ghost">
          <Link href="/">{siteConfig.name}</Link>
        </Button>
      }
      items={siteConfig.nav.map((item) => ({ ...item, active: isActive(pathname, item.href) }))}
    />
  )
}
