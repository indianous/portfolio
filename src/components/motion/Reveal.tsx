'use client'

import type { ComponentProps, ReactNode } from 'react'
import * as m from 'motion/react-m'
import { revealTransition, revealVariants } from '@/components/motion/variants'

type RevealElement = 'div' | 'li' | 'section'

type RevealProps = Omit<ComponentProps<'div'>, 'children'> & {
  children: ReactNode
  as?: RevealElement
  /** Atraso em segundos (listas em sequência: `staggerDelay(index)`). */
  delay?: number
  /** `false` começa já visível, sem animar a entrada (ex.: conteúdo acima da dobra). */
  animateEntry?: boolean
}

/**
 * Entra ao rolar até o elemento. O `data-reveal` liga a regra de `globals.css` que mostra o
 * conteúdo sem JavaScript e com movimento reduzido.
 */
export function Reveal({
  as = 'div',
  delay = 0,
  animateEntry = true,
  children,
  ...rest
}: RevealProps) {
  const Component = m[as] as typeof m.div
  return (
    <Component
      data-reveal=""
      variants={revealVariants}
      initial={animateEntry ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ ...revealTransition, delay }}
      {...(rest as ComponentProps<typeof m.div>)}
    >
      {children}
    </Component>
  )
}
