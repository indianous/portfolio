'use client'

import { Button, Navbar } from '@indianous/base-ds'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

// Links com href puro até o base-ds aceitar next/link (indianous/base-ds#54).
export function SiteHeader() {
  const pathname = usePathname()

  return (
    <Navbar
      sticky
      logo={
        <Button as="a" href="/" variant="ghost">
          {siteConfig.name}
        </Button>
      }
      items={siteConfig.nav.map((item) => ({ ...item, active: isActive(pathname, item.href) }))}
    />
  )
}
