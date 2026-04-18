# ✨ Animations Guide — Altave Realty Group

## Philosophy

Animations must feel **luxurious and purposeful** — like a premium brand reveal.
Never animate for the sake of it. Every motion earns its place.

Rules:
- Slower than you think → easing curve is everything
- Scroll-triggered on EVERY section — no exceptions
- Mobile gets the same animations — just lighter (reduce y distance)
- Prefer `ease: [0.22, 1, 0.36, 1]` — custom cubic-bezier for premium feel

---

## Installation

```bash
npm install framer-motion
```

---

## Core Animation Variants

**File: `src/lib/animations.ts`** — create this first, import everywhere.

```typescript
import { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

export const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -80 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const fadeRight: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1, x: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
}

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }
  }
}

// For lists — stagger children
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

// For card grids — faster stagger
export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
}

// Hero text reveal — word by word
export const wordReveal: Variants = {
  hidden: { opacity: 0, y: 40, skewY: 3 },
  visible: {
    opacity: 1, y: 0, skewY: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
}
```

---

## ScrollReveal Component

**File: `src/components/shared/ScrollReveal.tsx`**

```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { Variants } from 'framer-motion'
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

  const v = delay
    ? {
        ...variants,
        visible: {
          ...(variants.visible as object),
          transition: {
            ...((variants.visible as any)?.transition ?? {}),
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
```

**Usage:**
```tsx
// Simple fade up
<ScrollReveal>
  <h2>Section Heading</h2>
</ScrollReveal>

// With delay
<ScrollReveal variants={fadeLeft} delay={0.2}>
  <p>Paragraph text</p>
</ScrollReveal>

// Stagger grid
<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: '-50px' }}
  className="grid grid-cols-3 gap-6"
>
  {items.map(item => (
    <motion.div key={item.id} variants={fadeUp}>
      <Card {...item} />
    </motion.div>
  ))}
</motion.div>
```

---

## Hero Section Animations

```tsx
'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export function HeroSection() {
  const { scrollY } = useScroll()
  const bgY       = useTransform(scrollY, [0, 600], [0, 180])   // parallax bg
  const opacity   = useTransform(scrollY, [0, 400], [1, 0])     // fade on scroll
  const scale     = useTransform(scrollY, [0, 400], [1, 0.95])  // slight shrink

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax video background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-20">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-base/50 via-transparent to-bg-base" />
      </motion.div>

      {/* Content fades + shrinks on scroll */}
      <motion.div style={{ opacity, scale }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">

        {/* Overline — delayed */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-gold uppercase tracking-[0.4em] text-sm font-heading mb-6"
        >
          New York's Premier Real Estate
        </motion.p>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-hero font-light text-white"
        >
          Elevate Your
          <motion.em
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="text-gold italic block"
          >
            Space
          </motion.em>
        </motion.h1>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-4xl mt-12"
        >
          <SearchBar />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-text-muted text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-gold/40 rounded-full flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
```

---

## Animated Statistics Counter

**File: `src/components/home/StatsSection.tsx`**

```tsx
'use client'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => Math.round(v).toLocaleString())
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) animate(count, value, { duration: 2.2, ease: 'easeOut' })
  }, [inView, count, value])

  return <span ref={ref}><motion.span>{rounded}</motion.span>{suffix}</span>
}

// Stats data
const stats = [
  { value: 2500, suffix: '+', label: 'Properties Managed' },
  { value: 30,   suffix: '+', label: 'Years of Excellence' },
  { value: 150,  suffix: '+', label: 'Expert Agents' },
  { value: 98,   suffix: '%', label: 'Client Satisfaction' },
]
```

---

## Card Hover Animations

```tsx
// Property card lift + gold glow
<motion.article
  whileHover={{ y: -8, transition: { duration: 0.3, ease: 'easeOut' } }}
  className="relative bg-bg-card border border-bg-border
    transition-shadow duration-300 hover:shadow-gold hover:border-gold/40"
>
  {/* Shimmer sweep on hover */}
  <motion.div
    initial={{ x: '-100%', opacity: 0 }}
    whileHover={{ x: '200%', opacity: 0.08 }}
    transition={{ duration: 0.7 }}
    className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent pointer-events-none"
  />
</motion.article>

// Agent card — reveal overlay on hover
<motion.div className="group relative overflow-hidden">
  <Image ... />
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileHover={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="absolute inset-0 bg-bg-base/80 backdrop-blur-sm
      flex flex-col items-center justify-center gap-3"
  >
    <Link href={...}>View Profile</Link>
    {/* social icons */}
  </motion.div>
</motion.div>
```

---

## Page Transition

**File: `src/components/shared/PageTransition.tsx`**

```tsx
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

---

## Infinite Marquee (Partners)

```tsx
<div className="overflow-hidden py-8 border-y border-bg-border">
  <motion.div
    animate={{ x: ['0%', '-50%'] }}
    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
    className="flex gap-16 w-max"
  >
    {[...logos, ...logos].map((logo, i) => (
      <img key={i} src={logo} alt=""
        className="h-8 opacity-30 hover:opacity-70 transition-opacity grayscale hover:grayscale-0" />
    ))}
  </motion.div>
</div>
```

---

## Magnetic Button (CTA buttons)

```tsx
'use client'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, ReactNode } from 'react'

export function MagneticButton({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 })

  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.25)
    y.set((e.clientY - r.top - r.height / 2) * 0.25)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x, y }}
      onMouseMove={move} onMouseLeave={reset} className={className}>
      {children}
    </motion.div>
  )
}
```

---

## Checklist — Every New Section

Before marking a component done, verify:

- [ ] Heading wrapped in `<ScrollReveal>`
- [ ] Body text wrapped in `<ScrollReveal delay={0.1}>`
- [ ] Card/item lists use `staggerContainer` + `fadeUp` per item
- [ ] Images use `scaleUp` on enter
- [ ] CTA buttons use `<MagneticButton>`
- [ ] All hover states have smooth transitions (`duration-300` minimum)
- [ ] Mobile tested at 375px — animations feel smooth not janky
