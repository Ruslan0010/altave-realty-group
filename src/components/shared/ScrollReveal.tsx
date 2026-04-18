'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { fadeUp } from '@/lib/animations'

interface ScrollRevealProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-80px 0px' })

  const v: Variants = delay
    ? {
        ...variants,
        visible: {
          ...(variants.visible as object),
          transition: {
            ...((variants.visible as Record<string, unknown>)?.transition ?? {}),
            delay,
          },
        },
      }
    : variants

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={v}
      className={className}
    >
      {children}
    </motion.div>
  )
}
