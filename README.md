# Altave Realty Group

**Premium full-service real estate website — luxury dark theme, NYC market.**

🌐 **Live site:** [altave-realty-group.vercel.app](https://altave-realty-group.vercel.app)

---

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS + custom design system
- **Animations:** Framer Motion — scroll-triggered, parallax, magnetic buttons
- **Database:** PostgreSQL via Supabase + Prisma ORM
- **Auth:** Supabase Auth
- **Maps:** Mapbox GL
- **Email:** Resend
- **Payments:** Stripe
- **Deploy:** Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Copy env vars and fill in your values
cp .env.example .env.local

# Generate Prisma client
npx prisma generate

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](.env.example) for all required variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL maps |
| `RESEND_API_KEY` | Email notifications |
| `STRIPE_SECRET_KEY` | Online deposits |

## Build Phases

- [x] Phase 1 — Foundation (Next.js setup, Tailwind, Prisma schema, Header, Footer)
- [x] Phase 2 — Homepage (Hero, Stats, Featured Listings, City Explorer, Agents, Testimonials)
- [ ] Phase 3 — Property Catalogue
- [ ] Phase 4 — Inner Pages
- [ ] Phase 5 — Auth & Dashboard
- [ ] Phase 6 — API Routes
- [ ] Phase 7 — Integrations
- [ ] Phase 8 — Testing & QA
- [ ] Phase 9 — SEO & Deploy
