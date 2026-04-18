# ⚡ Quick Reference — Altave Realty Group

## Brand at a Glance

```
Brand:      Altave Realty Group
Tagline:    "Elevate Your Space"
Short name: ARG
Domain:     altaverealty.com
Language:   English only
Email:      info@altaverealty.com
```

---

## Start Claude Code (Every Session)

```bash
cd ~/projects/altave-realty-group
claude
```

**Paste this as your first message:**
```
Read CLAUDE.md, then read all files in docs/ — especially
DESIGN_SYSTEM.md, ANIMATIONS.md, and AGENTS.md.
Check docs/BUILD_PLAN.md to see which phase to work on next.
Start that phase by spawning the appropriate agents.
```

---

## Agent Trigger Phrases

```
Task(FrontendAgent): [UI task]
Task(BackendAgent):  [API/DB task]
Task(DesignAgent):   [styling/config task]
Task(TestingAgent):  [test task]
Task(DevOpsAgent):   [CI/CD/deploy task]
```

---

## Phase Start Prompts (Copy-Paste)

### Phase 1 — Foundation
```
Start Phase 1 from docs/BUILD_PLAN.md.
Spawn DesignAgent for Tailwind config and globals.css.
Spawn BackendAgent for Prisma schema and Supabase setup.
Then spawn FrontendAgent for layout, Header, and Footer.
```

### Phase 2 — Homepage
```
Start Phase 2. Spawn FrontendAgent tasks in parallel:
HeroSection, StatsSection, FeaturedListings+PropertyCard,
ExploreByCity, WhyChooseUs, AgentsSection, TestimonialsSection, PartnersBar.
Also spawn BackendAgent for /api/properties and seed data.
```

### Phase 8 — Testing
```
Start Phase 8. Spawn TestingAgent for:
- Jest unit tests (80%+ coverage target)
- Playwright E2E tests (desktop + mobile 375px)
- Accessibility axe checks
Also spawn DevOpsAgent for GitHub Actions CI/CD and Lighthouse CI.
```

---

## Colours (Quick Reference)

```
Gold:           #C9A84C   →  text-gold / bg-gold
Gold light:     #E8C97A   →  text-gold-light
Background:     #0A0A0F   →  bg-bg-base
Card bg:        #111118   →  bg-bg-card
Elevated:       #1A1A24   →  bg-bg-elevated
Border:         #2A2A38   →  border-bg-border
Text secondary: #A0A0B8   →  text-text-secondary
Text muted:     #606075   →  text-text-muted
```

---

## Animation Quick Start

```tsx
// 1. Import
import { ScrollReveal } from '@/components/shared/ScrollReveal'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'

// 2. Single element
<ScrollReveal><h2>Title</h2></ScrollReveal>

// 3. Staggered list
<motion.div variants={staggerContainer} initial="hidden"
  whileInView="visible" viewport={{ once: true }}>
  {items.map(i => <motion.div key={i.id} variants={fadeUp}><Card /></motion.div>)}
</motion.div>

// 4. Hero scroll fade
const { scrollY } = useScroll()
const opacity = useTransform(scrollY, [0, 400], [1, 0])
```

---

## Common Fix Commands

```bash
# TypeScript errors?
npm run type-check

# Lint errors?
npm run lint

# DB out of sync?
npx prisma db push && npx prisma generate

# Clear Next.js cache
rm -rf .next && npm run dev

# Re-seed database
npx prisma db seed

# Run all tests
npm test

# Run E2E tests (with browser UI)
npm run test:e2e:ui

# Check bundle size
npm run build && npx @next/bundle-analyzer
```

---

## Git Commit Convention

```bash
feat:     new feature
fix:      bug fix
style:    CSS/design change (no logic change)
refactor: code restructure (no feature change)
test:     add/update tests
docs:     documentation
chore:    config, deps, tooling
perf:     performance improvement

# Examples:
git commit -m "feat: add PropertyCard with hover animations"
git commit -m "style: update gold shimmer effect on hero headline"
git commit -m "test: add E2E test for property search flow"
```

---

## VS Code Shortcuts (Useful)

```
Ctrl+` (backtick)   — open terminal
Ctrl+Shift+P        — command palette
Ctrl+P              — quick file open
Ctrl+Shift+F        — search across files
F2                  — rename symbol
Ctrl+.              — quick fix / import
Alt+Shift+F         — format document
```
