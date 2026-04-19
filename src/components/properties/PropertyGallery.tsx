'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Grid3X3, Expand } from 'lucide-react'

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!lightboxOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxOpen, activeIndex])

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i + 1) % images.length)

  const main = images[0] ?? ''
  const thumbs = images.slice(1, 5)
  const remaining = images.length - 5

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[480px] md:h-[560px]">
        {/* Main image */}
        <div
          className="col-span-4 md:col-span-2 row-span-2 relative overflow-hidden group cursor-pointer"
          onClick={() => { setActiveIndex(0); setLightboxOpen(true) }}
        >
          <Image
            src={main}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-bg-base/0 group-hover:bg-bg-base/20 transition-colors duration-300" />
        </div>

        {/* Thumbnails */}
        {thumbs.map((img, i) => (
          <div
            key={i}
            className="hidden md:block relative overflow-hidden group cursor-pointer"
            onClick={() => { setActiveIndex(i + 1); setLightboxOpen(true) }}
          >
            <Image
              src={img}
              alt={`${title} — photo ${i + 2}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-bg-base/0 group-hover:bg-bg-base/30 transition-colors duration-300" />
            {/* Show remaining count on last visible thumb */}
            {i === 3 && remaining > 0 && (
              <div className="absolute inset-0 bg-bg-base/60 flex flex-col items-center justify-center gap-1">
                <Grid3X3 className="w-5 h-5 text-white" />
                <span className="text-white font-heading font-bold text-sm">+{remaining} more</span>
              </div>
            )}
          </div>
        ))}

        {/* View all button */}
        <button
          onClick={() => { setActiveIndex(0); setLightboxOpen(true) }}
          className="hidden md:flex absolute bottom-4 right-4 items-center gap-2 px-4 py-2 bg-bg-base/80 backdrop-blur-sm border border-bg-border text-white text-xs font-heading font-semibold uppercase tracking-widest hover:border-gold/60 hover:text-gold transition-all duration-200"
          style={{ position: 'absolute' }}
        >
          <Expand className="w-3.5 h-3.5" />
          View All {images.length} Photos
        </button>
      </div>

      {/* Mobile "view all" button */}
      <button
        onClick={() => { setActiveIndex(0); setLightboxOpen(true) }}
        className="flex md:hidden w-full mt-2 items-center justify-center gap-2 py-3 bg-bg-card border border-bg-border text-text-secondary text-xs font-heading font-semibold uppercase tracking-widest hover:border-gold/60 hover:text-gold transition-all duration-200"
      >
        <Grid3X3 className="w-3.5 h-3.5" />
        View All {images.length} Photos
      </button>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bg-base/95 backdrop-blur-md flex flex-col"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <span className="text-text-muted text-sm font-heading">
                {activeIndex + 1} / {images.length}
              </span>
              <button
                onClick={() => setLightboxOpen(false)}
                className="w-10 h-10 flex items-center justify-center border border-bg-border text-text-muted hover:text-white hover:border-gold/40 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative flex items-center justify-center px-16" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full max-h-[75vh]"
                >
                  <Image
                    src={images[activeIndex]}
                    alt={`${title} — photo ${activeIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-bg-card/80 border border-bg-border text-white hover:border-gold/40 hover:text-gold transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-bg-card/80 border border-bg-border text-white hover:border-gold/40 hover:text-gold transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Thumbnails strip */}
            <div className="flex items-center justify-center gap-2 p-4 overflow-x-auto flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`relative w-16 h-12 flex-shrink-0 border-2 overflow-hidden transition-all duration-200 ${
                    i === activeIndex ? 'border-gold' : 'border-bg-border opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
