'use client'

import { motion } from 'framer-motion'
import {
  Building2,
  BarChart3,
  Wrench,
  TrendingUp,
  Landmark,
  ShieldCheck,
} from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { staggerContainer, fadeUp } from '@/lib/animations'

const SERVICES = [
  {
    icon: Building2,
    title: 'Property Management',
    description:
      'Full-service management for residential and commercial properties. We handle everything from tenant screening to maintenance coordination.',
  },
  {
    icon: BarChart3,
    title: 'Financial Reporting',
    description:
      'Transparent, detailed financial reporting delivered monthly. Know exactly how your investment is performing at all times.',
  },
  {
    icon: Wrench,
    title: 'Capital Improvements',
    description:
      "Strategic renovation and capital improvement planning to maximize your property's value and rental income potential.",
  },
  {
    icon: TrendingUp,
    title: 'Business Development',
    description:
      'Proactive marketing and tenant acquisition strategies designed to minimize vacancy and maximize occupancy rates.',
  },
  {
    icon: Landmark,
    title: 'Finance Real Estate',
    description:
      'Expert guidance on financing options, mortgage advisory, and investment structuring for residential and commercial assets.',
  },
  {
    icon: ShieldCheck,
    title: 'Asset Recovery',
    description:
      'Comprehensive legal support and asset recovery services to protect your investment and resolve tenant disputes efficiently.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-bg-base">
      <div className="container-custom">
        <div className="mb-12 lg:mb-16">
          <SectionTitle
            overline="Why Altave"
            title="Services That"
            titleGold="Elevate"
            description="We go beyond transactions. Our comprehensive suite of services ensures your real estate experience is seamless, rewarding, and truly premium."
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
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                className="group relative p-8 bg-bg-card border border-bg-border transition-all duration-500 hover:border-gold/40 hover:shadow-gold cursor-default"
              >
                {/* Gold corner accent on hover */}
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />
                <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold transition-all duration-500 group-hover:w-full" />

                <div className="w-12 h-12 border border-gold/30 flex items-center justify-center mb-6 transition-all duration-300 group-hover:border-gold group-hover:bg-gold/10">
                  <Icon className="w-5 h-5 text-gold" />
                </div>

                <h3 className="font-heading text-base font-semibold uppercase tracking-widest text-white mb-3 transition-colors duration-300 group-hover:text-gold">
                  {service.title}
                </h3>

                <p className="text-text-muted text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
