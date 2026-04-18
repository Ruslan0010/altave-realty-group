'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { staggerContainer, fadeUp } from '@/lib/animations'

export interface TestimonialData {
  id: string
  name: string
  role: string
  avatar?: string | null
  rating: number
  content: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-gold fill-gold' : 'text-text-muted'}`}
        />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative p-8 bg-bg-card border border-bg-border flex flex-col gap-6 hover:border-gold/30 transition-colors duration-300"
    >
      {/* Large quote mark */}
      <Quote className="w-10 h-10 text-gold/20 absolute top-6 right-6" />

      <StarRating rating={testimonial.rating} />

      <blockquote className="text-text-secondary font-body leading-relaxed text-sm flex-1">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>

      <div className="flex items-center gap-4 border-t border-bg-border pt-5">
        {testimonial.avatar ? (
          <div
            className="w-11 h-11 rounded-full bg-cover bg-center flex-shrink-0 border border-gold/30"
            style={{ backgroundImage: `url(${testimonial.avatar})` }}
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <span className="text-gold font-heading font-bold text-sm">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="text-white font-heading font-semibold text-sm">{testimonial.name}</p>
          <p className="text-text-muted text-xs font-heading uppercase tracking-widest mt-0.5">
            {testimonial.role}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface TestimonialsSectionProps {
  testimonials: TestimonialData[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-bg-base">
      <div className="container-custom">
        <div className="mb-12 lg:mb-16">
          <SectionTitle
            overline="Client Stories"
            title="What Our Clients"
            titleGold="Say"
            description="Don't take our word for it. Hear from the people who've experienced the Altave difference."
            center
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
