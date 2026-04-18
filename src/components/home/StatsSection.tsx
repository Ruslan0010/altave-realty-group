'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'

const STATS = [
  { value: 2500, suffix: '+', label: 'Properties Managed' },
  { value: 30,   suffix: '+', label: 'Years of Excellence' },
  { value: 150,  suffix: '+', label: 'Expert Agents' },
  { value: 98,   suffix: '%', label: 'Client Satisfaction' },
]

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString())
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) animate(count, value, { duration: 2.2, ease: 'easeOut' })
  }, [inView, count, value])

  return (
    <span ref={ref} className="font-display text-5xl lg:text-6xl font-light text-white">
      <motion.span>{rounded}</motion.span>
      <span className="text-gold">{suffix}</span>
    </span>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-bg-card border-y border-bg-border">
      <div className="container-custom">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="flex flex-col items-center text-center"
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              <div className="mt-3 h-px w-12 bg-gold/40" />
              <p className="mt-3 text-text-muted text-sm font-heading uppercase tracking-widest">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
