'use client'

import type { ComponentProps, ReactNode } from 'react'
import { Button } from '@indianous/base-ds'
import Link from 'next/link'

type ButtonStyle = Pick<ComponentProps<typeof Button>, 'variant' | 'size' | 'className'>

interface ButtonLinkProps extends ButtonStyle {
  href: string
  children: ReactNode
  'aria-label'?: string
}

// Button do base-ds com o Link do Next.js, para links internos com cara de botão.
// Temporário: num Server Component, o `Button asChild` recebe o Link como elemento lazy e quebra
// (indianous/base-ds#60). Aqui o Link nasce dentro de um client component. Quando a issue sair,
// voltar a usar `<Button asChild><AppLink /></Button>` e apagar este arquivo.
export function ButtonLink({ href, children, 'aria-label': ariaLabel, ...style }: ButtonLinkProps) {
  return (
    <Button asChild {...style}>
      <Link href={href} aria-label={ariaLabel}>
        {children}
      </Link>
    </Button>
  )
}
