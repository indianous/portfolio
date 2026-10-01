'use client'

import type { ReactNode } from 'react'
import { LazyMotion, MotionConfig } from 'motion/react'

const loadFeatures = () => import('@/components/motion/features').then((mod) => mod.default)

// LazyMotion: as páginas usam o componente `m`, leve, e os recursos de animação chegam depois.
// `strict` acusa um `motion.*` importado por engano (traria o pacote inteiro).
// reducedMotion="user": com movimento reduzido no sistema, o Motion não anima transformações.
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
