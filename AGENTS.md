# 🤖 Agent System — Altave Realty Group

## Overview

Claude Code (Opus 4) acts as the **Orchestrator**.
It delegates specialised tasks to sub-agents using the `Task` tool.
Agents work in parallel where possible, speeding up development significantly.

---

## Agent Definitions

### 🎯 Orchestrator (Main Agent)
**You — Claude Code running in the terminal**

Responsibilities:
- Read all docs before starting any phase
- Break phases into parallel sub-tasks
- Spawn FrontendAgent, BackendAgent, etc.
- Review agent output and integrate
- Decide what to build next

Start every session with:
```
1. Read CLAUDE.md
2. Read docs/BUILD_PLAN.md — identify current phase
3. Read docs/DESIGN_SYSTEM.md + docs/ANIMATIONS.md
4. Spawn appropriate agents for the phase
```

---

### 🖼️ FrontendAgent

**Trigger:** `Task(FrontendAgent): [task description]`

Responsibilities:
- React/Next.js components
- Pages and layouts
- Scroll animations (Framer Motion)
- Responsive design (mobile-first)
- Tailwind styling

Rules for FrontendAgent:
- Always read `docs/DESIGN_SYSTEM.md` before writing any component
- Always read `docs/ANIMATIONS.md` before adding motion
- Every component must work at 375px, 768px, 1280px
- Every interactive element needs hover + focus states
- Use `ScrollReveal` wrapper for all section content

Example task:
```
Task(FrontendAgent): Create HeroSection component.
Read docs/DESIGN_SYSTEM.md and docs/ANIMATIONS.md first.
Include: video background with parallax, glassmorphism SearchBar,
animated headline, scroll indicator.
File: src/components/home/HeroSection.tsx
```

---

### ⚙️ BackendAgent

**Trigger:** `Task(BackendAgent): [task description]`

Responsibilities:
- Next.js API routes
- Prisma schema and migrations
- Supabase Auth integration
- Server-side data fetching
- Email with Resend
- Stripe payment routes

Rules for BackendAgent:
- Always read `docs/API_CONVENTIONS.md` before any route
- Always read `docs/DATABASE.md` for schema reference
- Zod validation on all inputs
- try/catch on all async operations
- Return consistent JSON format

Example task:
```
Task(BackendAgent): Create GET /api/properties route.
Read docs/API_CONVENTIONS.md first.
Support filters: status, city, area, bedrooms, maxPrice, page, limit.
Include pagination in response.
File: src/app/api/properties/route.ts
```

---

### 🎨 DesignAgent

**Trigger:** `Task(DesignAgent): [task description]`

Responsibilities:
- Tailwind config setup
- CSS variables and globals.css
- Design tokens
- Font setup (next/font)
- Animation keyframes

Rules for DesignAgent:
- Always read `docs/DESIGN_SYSTEM.md` — it is the single source of truth
- Never deviate from the gold/dark colour palette
- Font choices: Cormorant Garamond + Montserrat + Inter

Example task:
```
Task(DesignAgent): Set up tailwind.config.ts and globals.css.
Read docs/DESIGN_SYSTEM.md and docs/SETUP.md.
Include all custom colours, fonts, keyframes, shadows.
Files: tailwind.config.ts, src/styles/globals.css
```

---

### 🧪 TestingAgent

**Trigger:** `Task(TestingAgent): [task description]`

Responsibilities:
- Jest + React Testing Library unit tests
- Playwright E2E tests
- Lighthouse CI config
- Cross-browser test scripts

Rules for TestingAgent:
- Always read `docs/TESTING.md` for test patterns
- Cover happy path AND error states
- Mobile viewport (375px) must be included in E2E tests
- Accessibility checks in every E2E test

Example task:
```
Task(TestingAgent): Write E2E test for property search flow.
Read docs/TESTING.md first.
Test: user opens /properties, applies filters, sees results,
clicks a card, views detail page. Test on desktop + mobile.
File: tests/e2e/property-search.spec.ts
```

---

### 🚀 DevOpsAgent

**Trigger:** `Task(DevOpsAgent): [task description]`

Responsibilities:
- `.env.example` setup
- `vercel.json` config
- GitHub Actions CI/CD workflows
- Prisma migration scripts
- Docker setup (if needed)

Example task:
```
Task(DevOpsAgent): Set up GitHub Actions CI/CD pipeline.
On PR: run lint, type-check, unit tests, Lighthouse CI.
On merge to main: deploy to Vercel production.
Files: .github/workflows/ci.yml, .github/workflows/deploy.yml
```

---

## Parallel Work Strategy

### Phase 1 (Foundation) — Sequential
```
Orchestrator → DesignAgent: tailwind + globals
              ↓ (wait)
Orchestrator → FrontendAgent: layout + Header + Footer
              ↓ (wait)
Orchestrator → BackendAgent: Prisma schema + Supabase setup
```

### Phase 2 (Homepage) — Parallel
```
Orchestrator spawns simultaneously:
├── FrontendAgent: HeroSection + SearchBar
├── FrontendAgent: FeaturedListings + PropertyCard
├── FrontendAgent: StatsSection + WhyChooseUs
└── BackendAgent: /api/properties route + seed data
```

### Phase 3 (Properties) — Parallel
```
Orchestrator spawns simultaneously:
├── FrontendAgent: PropertyGrid + PropertyFilters
├── FrontendAgent: PropertyMap (Mapbox)
├── FrontendAgent: PropertyDetail page
└── BackendAgent: filtering API + favorites API
```

### Phase 5 (Testing) — Parallel
```
Orchestrator spawns simultaneously:
├── TestingAgent: Unit tests for all components
├── TestingAgent: E2E tests for critical flows
└── DevOpsAgent: Lighthouse CI + GitHub Actions
```

---

## Orchestrator Prompt Templates

Copy-paste these into Claude Code terminal to start each phase:

### Start Phase 1
```
You are the Orchestrator for Altave Realty Group (altaverealty.com).
Read CLAUDE.md, then all files in docs/.
Start Phase 1 from docs/BUILD_PLAN.md.
First spawn DesignAgent to set up Tailwind and globals.css.
Then spawn FrontendAgent to create the layout, Header, and Footer.
Then spawn BackendAgent to initialise Prisma schema.
Report progress after each agent completes.
```

### Start Phase 2
```
Phase 1 is complete. Now start Phase 2 (Homepage) from docs/BUILD_PLAN.md.
Spawn FrontendAgent tasks in parallel:
- HeroSection with video parallax
- FeaturedListings carousel with PropertyCard
- StatsSection with animated counters
- WhyChooseUs section
- AgentsSection
- TestimonialsSection
Also spawn BackendAgent for /api/properties and seed data.
```

### Start Testing Phase
```
All pages are built. Now start Phase 8 (Testing) from docs/BUILD_PLAN.md.
Spawn TestingAgent for:
- Unit tests for all components in src/components/
- E2E tests for: homepage, property search, contact form, auth
- Accessibility audit (WCAG 2.1 AA)
Also spawn DevOpsAgent to set up GitHub Actions CI/CD.
```

---

## Agent Output Format

Each agent should end its work with a summary:

```
✅ AGENT COMPLETE: [AgentName]
Files created:
  - src/components/home/HeroSection.tsx
  - src/components/home/SearchBar.tsx
Tests: N/A (FrontendAgent) | Passed: 12/12 (TestingAgent)
Next recommended task: [suggestion]
```
