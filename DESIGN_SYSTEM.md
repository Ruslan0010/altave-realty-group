# 🎨 Design System — Altave Realty Group

## Brand Identity

**Name:** Altave Realty Group
**Tagline:** "Elevate Your Space"
**Abbreviation:** ARG
**Domain:** altaverealty.com
**Concept:** Luxury Dark Real Estate — prestigious, modern, trustworthy
**Aesthetic:** High-end NYC real estate meets European luxury hotel brand

The site must feel like a Rolls-Royce website — every pixel signals prestige.
One word: **ELEVATION**.

---

## Colour Palette

```css
:root {
  /* ── GOLD ACCENTS ── */
  --gold:           #C9A84C;
  --gold-light:     #E8C97A;
  --gold-dark:      #A8882E;
  --gold-subtle:    rgba(201,168,76,0.12);
  --gold-border:    rgba(201,168,76,0.25);

  /* ── DARK BACKGROUNDS ── */
  --bg-base:        #0A0A0F;   /* main background */
  --bg-card:        #111118;   /* cards */
  --bg-elevated:    #1A1A24;   /* modals, dropdowns */
  --bg-border:      #2A2A38;   /* dividers */

  /* ── TEXT ── */
  --text-primary:   #FFFFFF;
  --text-secondary: #A0A0B8;
  --text-muted:     #606075;

  /* ── STATUS BADGES ── */
  --status-rent:    #4ADE80;
  --status-sale:    #60A5FA;
  --status-commercial: #F59E0B;
  --status-new:     #C9A84C;
  --status-hot:     #EF4444;
  --status-reduced: #A78BFA;

  /* ── SHADOWS ── */
  --shadow-sm:      0 2px 8px rgba(0,0,0,0.4);
  --shadow-md:      0 8px 32px rgba(0,0,0,0.6);
  --shadow-lg:      0 20px 60px rgba(0,0,0,0.8);
  --shadow-gold:    0 0 40px rgba(201,168,76,0.15);
  --shadow-gold-lg: 0 0 80px rgba(201,168,76,0.25);
}
```

---

## Typography

```tsx
// src/app/layout.tsx — font setup
import { Cormorant_Garamond, Montserrat, Inter } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heading',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})
```

### Type Scale

```css
--text-hero:    clamp(3rem, 8vw, 7rem);       /* H1 on Hero */
--text-display: clamp(2.5rem, 5vw, 4.5rem);   /* Section headings */
--text-title:   clamp(1.75rem, 3vw, 2.5rem);  /* Card / page titles */
--text-h3:      clamp(1.25rem, 2vw, 1.75rem);
--text-large:   1.125rem;
--text-base:    1rem;
--text-small:   0.875rem;
--text-xs:      0.75rem;
```

### Usage Examples

```tsx
// Hero heading — Cormorant Garamond light italic
<h1 className="font-display text-hero font-light tracking-tight text-white">
  Elevate Your <em className="italic text-gold">Space</em>
</h1>

// Section heading — Montserrat bold uppercase
<h2 className="font-heading text-display font-bold uppercase tracking-widest text-white">
  Featured Properties
</h2>

// Body text — Inter regular
<p className="font-body text-base text-text-secondary leading-relaxed">
  Altave Realty Group is committed to finding your perfect space.
</p>
```

---

## Component Patterns

### Primary Button
```tsx
<button className="
  px-8 py-4 bg-gold text-bg-base font-heading font-semibold
  uppercase tracking-widest text-sm rounded-none
  transition-all duration-300
  hover:bg-gold-light hover:shadow-gold hover:-translate-y-0.5
  active:translate-y-0 active:shadow-none
">
  Search Properties
</button>
```

### Outline Button
```tsx
<button className="
  px-8 py-4 border border-gold text-gold font-heading font-semibold
  uppercase tracking-widest text-sm rounded-none
  transition-all duration-300
  hover:bg-gold-subtle hover:shadow-gold
">
  Learn More
</button>
```

### Property Card Structure
```tsx
<article className="
  group relative bg-bg-card border border-bg-border
  overflow-hidden transition-all duration-500
  hover:border-gold/40 hover:shadow-gold hover:-translate-y-2
">
  {/* Image */}
  <div className="relative aspect-[4/3] overflow-hidden">
    <Image className="transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-bg-base/80 to-transparent" />
    {/* Status badge */}
    <span className="absolute top-4 left-4 px-3 py-1 bg-status-rent
      text-bg-base text-xs font-bold uppercase tracking-wider">
      For Rent
    </span>
    {/* Favourite */}
    <button className="absolute top-4 right-4 w-9 h-9
      bg-bg-base/60 backdrop-blur-sm flex items-center justify-center
      transition-all hover:bg-gold hover:text-bg-base">
      <HeartIcon className="w-4 h-4" />
    </button>
  </div>
  {/* Content */}
  <div className="p-5">
    <div className="flex items-start justify-between mb-2">
      <h3 className="font-display text-lg font-medium text-white line-clamp-1">
        {title}
      </h3>
      <span className="font-heading font-bold text-gold text-lg ml-2 whitespace-nowrap">
        ${price.toLocaleString()}/mo
      </span>
    </div>
    <p className="text-text-muted text-sm flex items-center gap-1 mb-4">
      <MapPin className="w-3.5 h-3.5" /> {address}
    </p>
    <div className="flex items-center gap-4 text-sm text-text-secondary
      border-t border-bg-border pt-4">
      <span className="flex items-center gap-1.5">
        <Bed className="w-4 h-4 text-gold" /> {beds} bed
      </span>
      <span className="flex items-center gap-1.5">
        <Bath className="w-4 h-4 text-gold" /> {baths} bath
      </span>
      <span className="flex items-center gap-1.5">
        <Square className="w-4 h-4 text-gold" /> {sqft} sqft
      </span>
    </div>
  </div>
</article>
```

### Gold Section Separator
```tsx
<div className="flex items-center gap-4 mb-6">
  <div className="h-px bg-gold/40 flex-1" />
  <span className="text-gold text-xs uppercase tracking-[0.3em] font-heading font-semibold">
    {label}
  </span>
  <div className="h-px bg-gold/40 flex-1" />
</div>
```

### Form Input
```tsx
<div className="relative">
  <label className="block text-text-muted text-xs uppercase tracking-widest mb-2">
    {label}
  </label>
  <input className="
    w-full bg-bg-elevated border border-bg-border px-4 py-3.5
    text-white placeholder:text-text-muted font-body
    focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30
    transition-all duration-200
  " />
</div>
```

---

## Special Effects

### Glassmorphism (Hero search bar)
```css
.glass {
  background: rgba(10, 10, 15, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(201, 168, 76, 0.2);
}
```

### Gold Text Gradient
```css
.gold-text {
  background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A8882E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Gold Shimmer Animation
```css
.gold-shimmer {
  background: linear-gradient(
    90deg, #C9A84C 0%, #E8C97A 30%, #C9A84C 60%, #A8882E 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
@keyframes shimmer {
  to { background-position: 200% center; }
}
```

### Noise Grain Overlay (Hero)
```css
/* Add to Hero wrapper */
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E");
  opacity: 0.035;
  pointer-events: none;
  animation: grain 8s steps(10) infinite;
}
```

---

## Spacing & Layout

```
Container:      max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Section padding: py-24 lg:py-32
Card padding:    p-5 lg:p-6
Gap small:       gap-4
Gap medium:      gap-6 lg:gap-8
Gap large:       gap-12 lg:gap-16
```

## Breakpoints (mobile-first)

```
Default: 375px  — mobile (primary target)
sm:      640px  — large mobile
md:      768px  — tablet
lg:      1024px — small desktop
xl:      1280px — desktop (primary target)
2xl:     1536px — wide screens
```

## Icons

Use **Lucide React** exclusively:
```tsx
import { MapPin, Bed, Bath, Square, Heart, Search,
         ChevronRight, Phone, Mail, Building2 } from 'lucide-react'
```
Sizes: `w-4 h-4` inline · `w-5 h-5` buttons · `w-6 h-6` featured
