'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
import { SectionTitle } from '@/components/shared/SectionTitle'
import { MagneticButton } from '@/components/shared/MagneticButton'
import { staggerContainer, fadeUp } from '@/lib/animations'

export interface AgentCardData {
  id: string
  slug: string
  name: string
  title: string
  photo: string
  specialties: string[]
  rating: number
  propertiesSold: number
  yearsExperience: number
  linkedin?: string | null
  instagram?: string | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= Math.round(rating) ? 'text-gold fill-gold' : 'text-text-muted'
          }`}
        />
      ))}
    </div>
  )
}

function AgentCard({ agent }: { agent: AgentCardData }) {
  return (
    <motion.div variants={fadeUp} className="group relative overflow-hidden bg-bg-card border border-bg-border">
      {/* Photo */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={agent.photo}
          alt={agent.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent" />

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-bg-base/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6"
        >
          <Link
            href={`/team/${agent.slug}`}
            className="px-6 py-2.5 border border-gold text-gold text-xs font-heading font-semibold uppercase tracking-widest hover:bg-gold hover:text-bg-base transition-all duration-200"
          >
            View Profile
          </Link>

          <div className="flex items-center gap-3">
            {agent.linkedin && (
              <a
                href={agent.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-bg-border flex items-center justify-center text-text-muted hover:text-gold hover:border-gold transition-all"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {agent.instagram && (
              <a
                href={agent.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-bg-border flex items-center justify-center text-text-muted hover:text-gold hover:border-gold transition-all"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <div className="text-center">
            <p className="text-xs text-text-muted font-heading uppercase tracking-widest">
              {agent.propertiesSold} sold · {agent.yearsExperience} yrs exp
            </p>
          </div>
        </motion.div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-xl font-medium text-white">{agent.name}</h3>
        <p className="text-text-muted text-xs font-heading uppercase tracking-widest mt-1 mb-3">
          {agent.title}
        </p>

        <StarRating rating={agent.rating} />

        <div className="flex flex-wrap gap-1.5 mt-3">
          {agent.specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2 py-0.5 border border-gold/30 text-gold text-[10px] font-heading uppercase tracking-wider"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

interface AgentsSectionProps {
  agents: AgentCardData[]
}

export function AgentsSection({ agents }: AgentsSectionProps) {
  return (
    <section className="py-24 lg:py-32 bg-bg-elevated">
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <SectionTitle
            overline="Expert Team"
            title="Meet Our"
            titleGold="Agents"
            description="Our award-winning agents combine local expertise with a passion for finding your perfect space."
          />
          <MagneticButton>
            <Link
              href="/team"
              className="flex items-center gap-2 px-8 py-3.5 border border-gold text-gold font-heading font-semibold text-xs uppercase tracking-widest hover:bg-gold hover:text-bg-base transition-all duration-300 flex-shrink-0"
            >
              All Agents
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {agents.slice(0, 4).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
