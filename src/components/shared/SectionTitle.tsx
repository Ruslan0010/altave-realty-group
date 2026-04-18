import { ScrollReveal } from './ScrollReveal'
import { fadeLeft } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  overline?: string
  title: string
  titleGold?: string
  description?: string
  center?: boolean
  className?: string
}

export function SectionTitle({
  overline,
  title,
  titleGold,
  description,
  center = false,
  className,
}: SectionTitleProps) {
  return (
    <div className={cn(center && 'text-center', className)}>
      {overline && (
        <ScrollReveal variants={fadeLeft}>
          <div className={cn('flex items-center gap-4 mb-4', center && 'justify-center')}>
            <div className="h-px bg-gold/40 w-12" />
            <span className="text-gold text-xs uppercase tracking-[0.3em] font-heading font-semibold">
              {overline}
            </span>
            <div className="h-px bg-gold/40 w-12" />
          </div>
        </ScrollReveal>
      )}
      <ScrollReveal delay={overline ? 0.1 : 0}>
        <h2 className="font-display text-display font-light text-white">
          {title}{' '}
          {titleGold && <em className="italic text-gold">{titleGold}</em>}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={0.2}>
          <p className="mt-4 text-text-secondary font-body leading-relaxed max-w-2xl">
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  )
}
