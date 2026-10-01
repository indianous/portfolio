'use client'

import { type ComponentProps, type ReactNode, useEffect, useRef, useState } from 'react'
import { inView } from 'motion'
import { animate } from 'motion/mini'
import { revealDuration, revealEase, revealFrom, revealMargin } from '@/components/motion/variants'

type RevealElement = 'div' | 'li' | 'section'

type RevealProps = Omit<ComponentProps<'div'>, 'children' | 'ref'> & {
  children: ReactNode
  as?: RevealElement
  /** Atraso em segundos (listas em sequência: `staggerDelay(index)`). */
  delay?: number
  /** `false` começa já visível, sem animar a entrada (ex.: conteúdo acima da dobra). */
  animateEntry?: boolean
}

/**
 * Entra ao rolar até o elemento. Usa só o `inView` e o `animate` do `motion/mini` (animação pela
 * Web Animations API), sem o componente `m`, para pesar pouco na primeira carga.
 *
 * O estado inicial (oculto) vai como estilo inline já no HTML; o `data-reveal` liga a regra de
 * `globals.css` que mostra o conteúdo sem JavaScript e com movimento reduzido.
 */
export function Reveal({
  as = 'div',
  delay = 0,
  animateEntry = true,
  children,
  style,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Só o valor da montagem conta: um card que já está na tela não volta a se esconder.
  const [animatesOnMount] = useState(animateEntry)

  useEffect(() => {
    const element = ref.current
    if (!element || !animatesOnMount) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    return inView(
      element,
      () => {
        animate(
          element,
          { opacity: [revealFrom.opacity, 1], transform: [revealFrom.transform, 'none'] },
          { duration: revealDuration, delay, ease: revealEase },
        ).then(() => {
          // Fixa o estado final no estilo inline, que ainda tinha o inicial do HTML.
          element.style.opacity = '1'
          element.style.transform = 'none'
        })
      },
      { margin: revealMargin },
    )
  }, [animatesOnMount, delay])

  // div, li e section aceitam as mesmas props usadas aqui.
  const Tag = as as 'div'

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={animatesOnMount ? { ...revealFrom, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  )
}
