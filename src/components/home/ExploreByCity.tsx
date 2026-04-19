'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { staggerContainer, scaleUp } from '@/lib/animations'

const CITIES = [
  {
    name: 'Downtown Halifax',
    count: '120+',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    href: '/properties?area=Downtown+Halifax',
  },
  {
    name: 'North End',
    count: '85+',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80',
    href: '/properties?area=North+End',
  },
  {
    name: 'South End',
    count: '60+',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    href: '/properties?area=South+End',
  },
  {
    name: 'Bedford',
    count: '95+',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    href: '/properties?area=Bedford',
  },
  {
    name: 'Clayton Park',
    count: '70+',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    href: '/properties?area=Clayton+Park',
  },
  {
    name: 'Dartmouth',
    count: '110+',
    image: 'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?w=600&q=80',
    href: '/properties?area=Dartmouth',
  },
]

export function ExploreByCity() {
  return (
    <section className="py-24 lg:py-32 bg-bg-elevated">
      <div className="container-custom">
        <div className="mb-12">
          <SectionTitle
            overline="Explore"
            title="Properties by"
            titleGold="Neighbourhood"
            description="Discover premium rentals and homes for sale across Halifax's most sought-after neighbourhoods."
          />
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {CITIES.map((city) => (
            <motion.div key={city.name} variants={scaleUp}>
              <Link href={city.href} className="group block relative overflow-hidden aspect-[4/3]">
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${city.image})` }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-bg-base/50 transition-opacity duration-300" />

                {/* Gold overlay on hover */}
                <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Gold border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/60 transition-all duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <MapPin className="w-5 h-5 text-gold mb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0" />
                  <h3 className="font-display text-xl lg:text-2xl font-light text-white transition-transform duration-300 group-hover:-translate-y-1">
                    {city.name}
                  </h3>
                  <span className="mt-2 px-3 py-1 bg-gold/20 border border-gold/40 text-gold text-xs font-heading font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    {city.count} Properties
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
