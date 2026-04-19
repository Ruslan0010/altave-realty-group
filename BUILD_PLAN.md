# 📋 Build Plan — Altave Realty Group

## Phases Overview

| Phase | Name | Agents | Priority |
|-------|------|--------|----------|
| 1 | Foundation | DesignAgent + BackendAgent | 🔴 Critical |
| 2 | Homepage | FrontendAgent + BackendAgent | 🔴 Critical |
| 3 | Property Catalogue | FrontendAgent + BackendAgent | 🔴 Critical |
| 4 | Inner Pages | FrontendAgent | 🟡 High |
| 5 | Auth & Dashboard | FrontendAgent + BackendAgent | 🟡 High |
| 6 | API Routes | BackendAgent | 🟡 High |
| 7 | Integrations | BackendAgent + DevOpsAgent | 🟠 Medium |
| 8 | Testing & QA | TestingAgent + DevOpsAgent | 🔴 Critical |
| 9 | SEO & Deploy | DevOpsAgent | 🟠 Medium |

---

## Phase 1 — Foundation

**Orchestrator prompt:**
```
Start Phase 1. Spawn agents:
Task(DesignAgent): Set up tailwind.config.ts and src/styles/globals.css per docs/DESIGN_SYSTEM.md and docs/SETUP.md
Task(BackendAgent): Run prisma init and create full schema per docs/DATABASE.md. Set up src/lib/prisma.ts and Supabase client files
Wait for both, then:
Task(FrontendAgent): Create src/app/layout.tsx with fonts (Cormorant Garamond, Montserrat, Inter via next/font), dark theme, PageTransition wrapper, and metadata for Altave Realty Group
Task(FrontendAgent): Create Header.tsx with full navigation — Properties dropdown (Rentals/Sales/Commercial), Our Company dropdown (About/Team/Property Management/List With Us/Refer a Friend/Join Our Team), Landlords, Resources dropdown (Forms/Guides), Contact. Include Login button, Favorites counter, glassmorphism on scroll, mobile hamburger menu with animation
Task(FrontendAgent): Create Footer.tsx with logo, company description, 4-column link grid, social icons, contact info, copyright
```

---

## Phase 2 — Homepage

**Orchestrator prompt:**
```
Phase 1 complete. Start Phase 2. Spawn in parallel:

Task(FrontendAgent): Create HeroSection.tsx per docs/ANIMATIONS.md — video bg parallax, grain overlay, animated headline "Elevate Your Space", glassmorphism SearchBar with tabs (Rent/Buy/Commercial), city dropdown, area dropdown, bedrooms, max price, Search button. Scroll indicator.

Task(FrontendAgent): Create StatsSection.tsx — 4 animated counters: 2500+ Properties, 30+ Years, 150+ Agents, 98% Satisfaction. AnimatedNumber component. ScrollReveal stagger.

Task(FrontendAgent): Create PropertyCard.tsx + FeaturedListings.tsx — PropertyCard: image with zoom hover, status badge, New/Hot/Reduced badges, favourite button, price, title, address, beds/baths/sqft stats, agent avatar. FeaturedListings: tabs (All/Rentals/Sales/Commercial), Swiper carousel, View All button.

Task(FrontendAgent): Create ExploreByCity.tsx — 6 city cards (Manhattan, Brooklyn, Queens, The Bronx, Staten Island, Hoboken), photo bg, hover scale + gold overlay, property count badge.

Task(FrontendAgent): Create WhyChooseUs.tsx — 6 service cards: Property Management, Financial Reporting, Capital Improvements, Business Development, Finance Real Estate, Asset Recovery. Gold icon, title, description, gold border glow on hover.

Task(FrontendAgent): Create AgentsSection.tsx + AgentCard.tsx — 4 featured agents, photo, name, title, specialties, rating stars. Hover: overlay with View Profile + social links.

Task(FrontendAgent): Create TestimonialsSection.tsx — large quote marks, Swiper autoplay carousel, star rating, avatar, name, role.

Task(FrontendAgent): Create PartnersBar.tsx — infinite marquee of partner logos.

Task(BackendAgent): Create GET /api/properties route with filters. Create GET /api/agents route. Add seed data per docs/DATABASE.md.
```

---

## Phase 3 — Property Catalogue

**Orchestrator prompt:**
```
Start Phase 3. Spawn in parallel:

Task(FrontendAgent): Create /properties/page.tsx — sidebar PropertyFilters (type, city, area multi-select, bedrooms buttons, price range slider, sqft range, amenities checkboxes, pet friendly toggle, Apply/Reset). Main area: sort dropdown, grid/map/list toggle, result count, PropertyGrid with PropertyCard, Load More button.

Task(FrontendAgent): Create PropertyMap.tsx with Mapbox GL — dark map style (mapbox://styles/mapbox/dark-v11), custom markers showing price, cluster markers, popup on click (photo, title, price, link). Sync with filters. Mobile-friendly.

Task(FrontendAgent): Create /properties/[slug]/page.tsx — PropertyGallery (lightbox), price/status panel with Favourite+Share, full characteristics grid, description expand/collapse, amenities with icons. Tabs: Overview | Map | Virtual Tour | Floor Plan. Mapbox location map. InquiryForm sidebar. MortgageCalculator. Agent info card. Similar properties section. Breadcrumbs.

Task(FrontendAgent): Create MortgageCalculator.tsx — inputs: home price, down payment %, interest rate, loan term. Output: monthly payment, total payment, total interest. Chart (recharts).

Task(BackendAgent): Create GET /api/properties/[slug], POST /api/favorites (toggle), GET /api/favorites?userId=.
```

---

## Phase 4 — Inner Pages

**Orchestrator prompt:**
```
Start Phase 4. Spawn in parallel:

Task(FrontendAgent): /about/page.tsx — PageHero, company history timeline, mission + values cards, team managers grid, stats, certifications, CTA.

Task(FrontendAgent): /team/page.tsx — all agents grid, search by name input, filter by specialty. Each AgentCard links to /team/[slug].

Task(FrontendAgent): /team/[slug]/page.tsx — agent profile: hero photo, bio, stats (properties sold, years, rating), specialties, languages, listings grid.

Task(FrontendAgent): /property-management/page.tsx — PageHero, 6 service cards (tenant screening, rent collection, maintenance, financial reporting, legal support, vacancy marketing), numbered steps, 3 pricing packages, FAQ accordion, contact form.

Task(FrontendAgent): /list-with-us/page.tsx and /landlords/page.tsx — benefits, step-by-step process, testimonials from landlords, contact form.

Task(FrontendAgent): /resources/renters-guide, /buyers-guide, /sellers-guide pages — structured guide content, accordion sections, PDF download button, sidebar quick links.

Task(FrontendAgent): /resources/forms/page.tsx — downloadable PDF forms grid (rental application, lease agreement, maintenance request, etc.).

Task(FrontendAgent): /refer-a-friend/page.tsx — reward description, referral form (your name, email, friend name, friend email), T&Cs.

Task(FrontendAgent): /join-our-team/page.tsx — benefits of joining, open positions accordion, application form with resume upload.

Task(FrontendAgent): /blog/page.tsx and /blog/[slug]/page.tsx — article grid with category filter and search, full article page with author, tags, related posts.

Task(FrontendAgent): /contact/page.tsx — Mapbox office map, contact info cards (address, phone, email, hours), inquiry form with type selector.
```

---

## Phase 5 — Auth & Dashboard

**Orchestrator prompt:**
```
Start Phase 5. Spawn:

Task(BackendAgent): Set up Supabase Auth. Create src/lib/supabase/client.ts and server.ts. Create middleware.ts to protect /dashboard routes. Create POST /api/auth/sync to sync Supabase user to Prisma User table.

Task(FrontendAgent): /login/page.tsx — email+password form, Google OAuth button, forgot password link. Clean dark luxury design.

Task(FrontendAgent): /register/page.tsx — first name, last name, email, password, phone (optional). Same design.

Task(FrontendAgent): /dashboard/page.tsx — sidebar nav (Overview, Favourites, Applications, Saved Searches, Alerts, Profile). Overview: stats cards + recent applications table. Favourites: PropertyCard grid with remove button. Applications: status table (Pending/Reviewing/Approved/Rejected) with detail expand. Saved Searches: list with filters summary + delete + toggle alert. Profile: edit form.
```

---

## Phase 6 — API Routes

**Orchestrator prompt:**
```
Task(BackendAgent): Create all remaining API routes per docs/API_CONVENTIONS.md:
- POST /api/inquiries — validate with Zod, save to DB, send email via Resend to agent
- POST /api/applications — validate, save, send confirmation email to applicant
- GET/POST /api/saved-searches — CRUD for user saved searches
- POST /api/contact — contact form, email to info@altaverealty.com
- GET /api/blog — paginated blog posts with category filter
- GET /api/blog/[slug] — single post
- GET /api/agents/[slug] — agent profile + their properties
All routes: Zod validation, try/catch, consistent JSON response format.
```

---

## Phase 7 — Integrations

**Orchestrator prompt:**
```
Task(BackendAgent): 
- Resend email templates: inquiry confirmation, application received, saved search alert, welcome email
- Stripe: POST /api/stripe/checkout for security deposits, POST /api/stripe/webhook

Task(DevOpsAgent):
- Create .env.example with all required variables
- Create vercel.json
- Create .github/workflows/ci.yml (lint + type-check + unit tests on PR)
- Create .github/workflows/deploy.yml (deploy to Vercel on merge to main)
```

---

## Phase 8 — Testing & QA ⭐ CRITICAL

**Orchestrator prompt:**
```
Start Phase 8 (Testing). Spawn in parallel:

Task(TestingAgent): Write Jest unit tests for:
- PropertyCard renders correctly with all props
- SearchBar filter state management
- MortgageCalculator output accuracy
- useFavorites hook (add, remove, toggle)
- Zod schemas validation (valid + invalid inputs)
- API route handlers (mock Prisma)
Target: 80%+ coverage

Task(TestingAgent): Write Playwright E2E tests:
1. Homepage loads — hero visible, search bar works, featured listings show
2. Property search — filter by city + bedrooms, results update, map markers show
3. Property detail — gallery opens lightbox, inquiry form submits successfully
4. Contact form — fills out, validates, submits, success message shows
5. Auth flow — register new user, login, view dashboard, add favourite
6. Mobile flows — repeat tests 1-3 on mobile viewport (375px)
7. Accessibility — axe checks on homepage, properties, contact pages

Task(TestingAgent): Cross-browser check scripts:
- Chrome, Firefox, Safari (via Playwright)
- iOS Safari simulation (375px)
- Android Chrome simulation (390px)

Task(DevOpsAgent): Set up Lighthouse CI config (.lighthouserc.json):
- Performance ≥ 90
- Accessibility ≥ 95  
- Best Practices ≥ 95
- SEO = 100
Run against: /, /properties, /contact
```

---

## Phase 9 — SEO & Deploy

**Orchestrator prompt:**
```
Task(FrontendAgent): Add metadata to every page — title, description, openGraph, twitter cards. Dynamic metadata for /properties/[slug] using property data. JSON-LD structured data for PropertyListing schema.

Task(DevOpsAgent): 
- src/app/sitemap.ts — dynamic sitemap including all property slugs
- src/app/robots.ts
- Final Vercel deployment
- Set all env variables in Vercel dashboard
- Run Lighthouse CI and confirm all scores pass
```

---

## Progress Tracker

Update this as phases complete:

- [x] Phase 1 — Foundation
- [x] Phase 2 — Homepage
- [x] Phase 3 — Property Catalogue
- [ ] Phase 4 — Inner Pages
- [ ] Phase 5 — Auth & Dashboard
- [ ] Phase 6 — API Routes
- [ ] Phase 7 — Integrations
- [ ] Phase 8 — Testing & QA
- [ ] Phase 9 — SEO & Deploy
