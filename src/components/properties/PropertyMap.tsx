'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import type { PropertyCardData } from './PropertyCard'

interface PropertyMapProps {
  properties: PropertyCardData[]
}

interface MarkerWithPopup {
  marker: mapboxgl.Marker
  popup: mapboxgl.Popup
}

declare global {
  interface Window {
    mapboxgl: typeof import('mapbox-gl')
  }
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('mapbox-gl').Map | null>(null)
  const markersRef = useRef<MarkerWithPopup[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const buildPopupHTML = useCallback((p: PropertyCardData) => {
    const img = p.images[0] ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'
    const price =
      p.status === 'RENT'
        ? `$${p.price.toLocaleString()}/mo`
        : `$${p.price.toLocaleString()}`
    return `
      <div style="width:240px;background:#111118;border:1px solid #2A2A38;overflow:hidden;font-family:var(--font-inter,sans-serif)">
        <div style="position:relative;height:140px;overflow:hidden">
          <img src="${img}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,15,0.7) 0%,transparent 60%)"></div>
        </div>
        <div style="padding:12px">
          <p style="color:#C9A84C;font-size:13px;font-weight:700;margin:0 0 4px">${price}</p>
          <p style="color:#fff;font-size:13px;margin:0 0 4px;font-weight:500;line-height:1.3">${p.title}</p>
          <p style="color:#606075;font-size:11px;margin:0 0 10px">${p.address}</p>
          <a href="/properties/${p.slug}" style="display:block;text-align:center;padding:8px;background:#C9A84C;color:#0A0A0F;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none">
            View Property
          </a>
        </div>
      </div>
    `
  }, [])

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      setError(true)
      return
    }

    let cancelled = false

    import('mapbox-gl').then((mapboxgl) => {
      if (cancelled || !containerRef.current) return
      if (mapRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapboxgl as any).default.accessToken = token

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = new (mapboxgl as any).default.Map({
        container: containerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-63.5752, 44.6488],
        zoom: 11,
      })

      mapRef.current = map as unknown as import('mapbox-gl').Map

      map.on('load', () => {
        if (!cancelled) setLoaded(true)
      })

      map.addControl(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (mapboxgl as any).default.NavigationControl({ showCompass: false }),
        'top-right'
      )
    }).catch(() => {
      if (!cancelled) setError(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  // Update markers whenever properties change
  useEffect(() => {
    if (!mapRef.current || !loaded) return

    import('mapbox-gl').then((mapboxgl) => {
      // Remove old markers
      markersRef.current.forEach(({ marker }) => marker.remove())
      markersRef.current = []

      properties.forEach((p) => {
        if (!p.id) return
        // We need lat/lng — use a rough bounding for Halifax if not available
        // The seed data stores lat/lng, we pass them through
        const lat = (p as PropertyCardData & { lat?: number }).lat ?? 44.6488
        const lng = (p as PropertyCardData & { lng?: number }).lng ?? -63.5752

        const price =
          p.status === 'RENT'
            ? `$${(p.price / 1000).toFixed(1)}k`
            : `$${(p.price / 1000).toFixed(0)}k`

        const el = document.createElement('div')
        el.innerHTML = `
          <div style="
            background:#C9A84C;
            color:#0A0A0F;
            padding:4px 8px;
            font-size:11px;
            font-weight:700;
            font-family:sans-serif;
            white-space:nowrap;
            border-radius:2px;
            cursor:pointer;
            box-shadow:0 2px 8px rgba(0,0,0,0.4);
            transition:transform 0.2s;
          ">${price}</div>
        `
        el.style.cursor = 'pointer'
        el.addEventListener('mouseover', () => {
          const d = el.querySelector('div') as HTMLElement
          if (d) d.style.transform = 'scale(1.1)'
        })
        el.addEventListener('mouseout', () => {
          const d = el.querySelector('div') as HTMLElement
          if (d) d.style.transform = 'scale(1)'
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const popup = new (mapboxgl as any).default.Popup({
          offset: 25,
          closeButton: false,
          maxWidth: 'none',
        }).setHTML(buildPopupHTML(p))

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const marker = new (mapboxgl as any).default.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapRef.current!)

        markersRef.current.push({ marker, popup })
      })
    })
  }, [properties, loaded, buildPopupHTML])

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-3 bg-bg-card border border-bg-border text-text-muted">
        <MapPin className="w-8 h-8" />
        <p className="text-sm">Map unavailable — Mapbox token not configured</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-card z-10">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
