'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { SectionTitle } from '@/components/shared/SectionTitle'
import { staggerContainer, scaleUp } from '@/lib/animations'

const CITIES = [
  {
    name: 'Manhattan',
    count: '800+',
    image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?w=600&q=80',
    href: '/properties?city=Manhattan',
  },
  {
    name: 'Brooklyn',
    count: '450+',
    image: 'https://images.unsplash.com/photo-1555109307-f7d9da25c244?w=600&q=80',
    href: '/properties?city=Brooklyn',
  },
  {
    name: 'Queens',
    count: '320+',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    href: '/properties?city=Queens',
  },
  {
    name: 'The Bronx',
    count: '190+',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80',
    href: '/properties?city=The+Bronx',
  },
  {
    name: 'Staten Island',
    count: '120+',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80',
    href: '/properties?city=Staten+Island',
  },
  {
    name: 'Hoboken',
    count: '90+',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    href: '/properties?city=Hoboken',
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
            titleGold="City"
            description="Discover luxury homes and commercial spaces across New York City's most sought-after neighborhoods."
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
