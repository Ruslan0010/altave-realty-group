# 🏢 Altave Realty Group — Claude Code Master Instructions

> This file is automatically read by Claude Code on every startup.
> Follow ALL instructions here for every task in this project.
> Abbreviation: ARG | Domain: altaverealty.com | Language: English only

---

## 📌 Project Overview

**Brand:** Altave Realty Group (ARG)
**Type:** Premium full-service real estate website — rentals, sales, commercial
**Inspiration:** urgny.com — but significantly superior in design and features
**Language:** English (all content, UI, emails, guides)
**Stack:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Supabase, Prisma, Mapbox
**Environment:** Ubuntu Linux, VS Code + Claude Code extension

---

## 🤖 MULTI-AGENT SYSTEM — READ FIRST

This project uses a **multi-agent architecture**. When Claude Code runs as
the Orchestrator, it should spawn specialised sub-agents for parallel work.

### Agent Roles

| Agent | Responsibility | Trigger phrase |
|-------|---------------|----------------|
| **Orchestrator** | Reads all docs, plans tasks, delegates | (default) |
| **FrontendAgent** | UI components, animations, pages | `Task(FrontendAgent):` |
| **BackendAgent** | API routes, Prisma schema, server logic | `Task(BackendAgent):` |
| **DesignAgent** | Design tokens, CSS, Tailwind config | `Task(DesignAgent):` |
| **TestingAgent** | Jest unit tests, Playwright E2E tests | `Task(TestingAgent):` |
| **DevOpsAgent** | CI/CD, Vercel config, env setup | `Task(DevOpsAgent):` |

### How Orchestrator Should Delegate

When starting a new phase, the Orchestrator MUST:

1. Read `docs/BUILD_PLAN.md` for the current phase
2. Break it into parallel sub-tasks
3. Spawn agents using the Task tool
4. Wait for results before moving to the next phase

**Example orchestration prompt you can give:**
```
You are the Orchestrator for Altave Realty Group.
Read CLAUDE.md and all docs/ files.
Start Phase 2 (Homepage). Spawn FrontendAgent for components,
BackendAgent for API routes, DesignAgent for tokens.
Run them in parallel where possible.
```

### Agent Behaviour Rules
- Every agent reads `docs/DESIGN_SYSTEM.md` before touching UI
- Every agent reads `docs/ANIMATIONS.md` before any component
- Agents NEVER skip loading states, error states, or mobile breakpoints
- Agents commit with conventional commits: `feat:`, `fix:`, `style:`, `test:`

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── (main)/                     # Public pages
│   │   ├── page.tsx                # Homepage
│   │   ├── properties/
│   │   │   ├── page.tsx            # All listings
│   │   │   ├── rentals/page.tsx
│   │   │   ├── sales/page.tsx
│   │   │   ├── commercial/page.tsx
│   │   │   └── [slug]/page.tsx     # Property detail
│   │   ├── about/page.tsx
│   │   ├── team/page.tsx
│   │   ├── property-management/page.tsx
│   │   ├── list-with-us/page.tsx
│   │   ├── refer-a-friend/page.tsx
│   │   ├── join-our-team/page.tsx
│   │   ├── landlords/page.tsx
│   │   ├── resources/
│   │   │   ├── forms/page.tsx
│   │   │   ├── renters-guide/page.tsx
│   │   │   ├── buyers-guide/page.tsx
│   │   │   └── sellers-guide/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── contact/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── favorites/page.tsx
│   │       ├── applications/page.tsx
│   │       └── profile/page.tsx
│   └── api/
│       ├── properties/route.ts
│       ├── favorites/route.ts
│       ├── applications/route.ts
│       ├── inquiries/route.ts
│       └── contact/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileMenu.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FeaturedListings.tsx
│   │   ├── StatsSection.tsx
│   │   ├── ExploreByCity.tsx
│   │   ├── WhyChooseUs.tsx
│   │   ├── AgentsSection.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── PartnersBar.tsx
│   ├── properties/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyMap.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── PropertyGallery.tsx
│   │   ├── VirtualTour.tsx
│   │   └── MortgageCalculator.tsx
│   └── shared/
│       ├── ScrollReveal.tsx
│       ├── PageHero.tsx
│       ├── SectionTitle.tsx
│       ├── InquiryForm.tsx
│       └── MagneticButton.tsx
├── lib/
│   ├── prisma.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── animations.ts
│   └── utils.ts
├── hooks/
│   ├── useScrollAnimation.ts
│   ├── useFavorites.ts
│   └── useProperties.ts
└── types/index.ts
```

---

## 🎨 Design Identity

**Concept:** Luxury Dark Real Estate — prestigious, trustworthy, modern
**Feel:** Like a Rolls-Royce website meets NYC premium real estate
**Theme:** Dark backgrounds, gold accents, generous whitespace

Full details → `docs/DESIGN_SYSTEM.md`

---

## ✨ Animation Philosophy

Every section MUST have scroll-triggered animations.
No static pages allowed.

Full details → `docs/ANIMATIONS.md`

---

## 🔌 Integrations

| Service | Purpose | Env Key |
|---------|---------|---------|
| Supabase | Auth + Storage | `NEXT_PUBLIC_SUPABASE_URL` |
| Prisma + PostgreSQL | Database | `DATABASE_URL` |
| Mapbox GL | Interactive maps | `NEXT_PUBLIC_MAPBOX_TOKEN` |
| Cloudinary | Image optimisation | `CLOUDINARY_API_KEY` |
| Resend | Email notifications | `RESEND_API_KEY` |
| Stripe | Online deposits | `STRIPE_SECRET_KEY` |

---

## 📋 Coding Rules

### TypeScript
- `strict: true` in tsconfig — no exceptions
- All component props must have TypeScript interfaces
- Never use `any` — use `unknown` if type is truly unknown

### Components
- `'use client'` only when interactivity is required
- Server Components by default (better SEO + performance)
- PascalCase for components, camelCase for functions/hooks

### Styling
- Tailwind utility-first, no inline styles
- Mobile-first breakpoints: `sm:` `md:` `lg:` `xl:`
- CSS variables for all design tokens

### Performance
- `next/image` for ALL images — no exceptions
- `next/font` for ALL fonts
- Dynamic imports for heavy components (map, virtual tour)
- `loading.tsx` for every route that fetches data

### Accessibility
- Semantic HTML: `<section>`, `<article>`, `<nav>`, `<main>`
- All images have descriptive `alt` text
- Focus states on all interactive elements
- ARIA labels where needed

---

## 🧪 Testing Requirements

Every feature needs tests. See `docs/TESTING.md` for full guide.

- Unit tests (Jest): components, hooks, utils
- E2E tests (Playwright): critical user flows
- Visual tests: desktop 1280px, tablet 768px, mobile 375px
- Lighthouse CI: Performance ≥ 90, Accessibility ≥ 95, SEO = 100

---

## ⚠️ Absolute Rules

1. **NEVER** commit `.env.local` — only `.env.example`
2. **ALWAYS** add loading + error states to every data-fetching component
3. **ALWAYS** add scroll animations to every new section
4. **ALWAYS** test on 375px mobile before marking a task done
5. **ALWAYS** use English — no other language anywhere on the site
6. When creating a new page → follow `docs/PAGE_TEMPLATE.md`
7. When creating an API route → follow `docs/API_CONVENTIONS.md`
8. When touching design → follow `docs/DESIGN_SYSTEM.md`
9. When adding animations → follow `docs/ANIMATIONS.md`
