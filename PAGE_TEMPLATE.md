# 📄 Page Template — Altave Realty Group

## Every new page follows this structure exactly.

---

## Server Component Template

```tsx
// src/app/(main)/[page-name]/page.tsx
import { Metadata } from 'next'
import { PageHero } from '@/components/shared/PageHero'

export const metadata: Metadata = {
  title: 'Page Title | Altave Realty Group',
  description: 'SEO description 150-160 characters — describe the page clearly.',
  openGraph: {
    title: 'Page Title | Altave Realty Group',
    description: 'Same as above',
    url: 'https://altaverealty.com/page-slug',
    siteName: 'Altave Realty Group',
    type: 'website',
  },
}

export default async function PageName() {
  return (
    <main>
      <PageHero
        title="Page Title"
        subtitle="Optional subtitle sentence."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Page Name', href: '/page-slug' },
        ]}
      />

      <section className="py-24 lg:py-32">
        <div className="container-custom">
          {/* content */}
        </div>
      </section>
    </main>
  )
}

// Always add loading.tsx in the same folder:
// export default function Loading() {
//   return <div className="min-h-screen bg-bg-base animate-pulse" />
// }
```

---

## PageHero Component

**`src/components/shared/PageHero.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface PageHeroProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href: string }[]
  backgroundImage?: string
}

export function PageHero({ title, subtitle, breadcrumbs, backgroundImage }: PageHeroProps) {
  return (
    <section
      className="relative py-32 lg:py-40 overflow-hidden bg-bg-card"
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
    >
      {backgroundImage && <div className="absolute inset-0 bg-bg-base/70" />}

      {/* Gold left border accent */}
      <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-gold/50 to-transparent" />

      <div className="container-custom relative z-10">
        {breadcrumbs && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-text-muted mb-6"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i < breadcrumbs.length - 1
                  ? <Link href={crumb.href} className="hover:text-gold transition-colors">{crumb.label}</Link>
                  : <span className="text-gold">{crumb.label}</span>}
                {i < breadcrumbs.length - 1 && <ChevronRight className="w-3 h-3" />}
              </span>
            ))}
          </motion.nav>
        )}

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-px bg-gold mb-6"
        />

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-display font-light text-white"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-4 text-lg text-text-secondary max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
```

---

## SectionTitle Component

**`src/components/shared/SectionTitle.tsx`**

```tsx
import { ScrollReveal } from './ScrollReveal'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  overline?: string
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionTitle({ overline, title, subtitle, centered = true, className }: SectionTitleProps) {
  return (
    <ScrollReveal className={cn('mb-16', centered && 'text-center', className)}>
      {overline && (
        <div className={cn('flex items-center gap-4 mb-5', centered && 'justify-center')}>
          <div className="h-px bg-gold/40 w-10" />
          <span className="text-gold text-xs uppercase tracking-[0.35em] font-heading font-semibold">
            {overline}
          </span>
          <div className="h-px bg-gold/40 w-10" />
        </div>
      )}
      <h2 className="font-display text-display font-light text-white">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-text-secondary text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  )
}
```

---

## Standard Section Pattern

```tsx
import { motion } from 'framer-motion'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { staggerContainer, fadeUp } from '@/lib/animations'

<section className="py-24 lg:py-32">
  <div className="container-custom">

    <SectionTitle
      overline="Why Choose Us"
      title="Excellence in Every Detail"
      subtitle="With over 30 years in New York real estate, we bring expertise you can trust."
    />

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={fadeUp}>
          <ServiceCard {...item} />
        </motion.div>
      ))}
    </motion.div>

  </div>
</section>
```

---

## Page Checklist

Before marking any page done, confirm:

- [ ] `export const metadata` with full title + description + openGraph
- [ ] `<PageHero>` with breadcrumbs at the top
- [ ] Every section has `py-24 lg:py-32`
- [ ] Every section has `container-custom` wrapper
- [ ] All headings use `<SectionTitle>` with overline
- [ ] All content has scroll animations (ScrollReveal / motion)
- [ ] Mobile-first, tested at 375px
- [ ] `loading.tsx` in the route folder
- [ ] No Lorem ipsum — all English real content
- [ ] data-testid attributes on key elements for E2E tests
