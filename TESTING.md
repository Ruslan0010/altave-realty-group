# 🧪 Testing Guide — Altave Realty Group

## Stack

- **Unit tests:** Jest + React Testing Library
- **E2E tests:** Playwright
- **Visual:** Playwright screenshots (desktop + tablet + mobile)
- **Performance:** Lighthouse CI
- **Accessibility:** axe-core via Playwright

---

## Jest Setup

**`jest.config.ts`**
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/lib/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: { lines: 80, branches: 70, functions: 80, statements: 80 },
  },
}

export default createJestConfig(config)
```

**`jest.setup.ts`**
```typescript
import '@testing-library/jest-dom'
```

---

## Unit Test Examples

### PropertyCard test
**`src/components/properties/__tests__/PropertyCard.test.tsx`**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { PropertyCard } from '../PropertyCard'

const mockProperty = {
  id: '1',
  slug: 'test-property',
  title: 'Luxury 2BR Upper East Side',
  status: 'RENT',
  price: 4500,
  address: '123 E 80th St',
  city: 'Manhattan',
  bedrooms: 2,
  bathrooms: 1,
  sqft: 1200,
  images: ['/test-image.jpg'],
  isNew: true,
  isHot: false,
  isFeatured: true,
  agent: { name: 'Jason Mercer', photo: '/agents/jason.jpg' },
}

describe('PropertyCard', () => {
  it('renders property title and price', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Luxury 2BR Upper East Side')).toBeInTheDocument()
    expect(screen.getByText('$4,500/mo')).toBeInTheDocument()
  })

  it('shows NEW badge when isNew is true', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('shows bedroom, bathroom, sqft stats', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('2 bed')).toBeInTheDocument()
    expect(screen.getByText('1 bath')).toBeInTheDocument()
    expect(screen.getByText('1,200 sqft')).toBeInTheDocument()
  })

  it('calls onFavourite when heart button clicked', () => {
    const onFavourite = jest.fn()
    render(<PropertyCard property={mockProperty} onFavourite={onFavourite} />)
    fireEvent.click(screen.getByRole('button', { name: /favourite/i }))
    expect(onFavourite).toHaveBeenCalledWith('1')
  })
})
```

### MortgageCalculator test
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MortgageCalculator } from '../MortgageCalculator'

describe('MortgageCalculator', () => {
  it('calculates monthly payment correctly', () => {
    render(<MortgageCalculator defaultPrice={500000} />)
    // $500k, 20% down, 7% rate, 30yr = ~$2,661/mo
    expect(screen.getByTestId('monthly-payment')).toHaveTextContent('$2,661')
  })

  it('updates when inputs change', () => {
    render(<MortgageCalculator defaultPrice={500000} />)
    const rateInput = screen.getByLabelText(/interest rate/i)
    fireEvent.change(rateInput, { target: { value: '6' } })
    // Lower rate → lower payment
    const payment = screen.getByTestId('monthly-payment').textContent
    expect(parseInt(payment!.replace(/[^0-9]/g, ''))).toBeLessThan(2661)
  })
})
```

### API route test (mock Prisma)
```typescript
import { GET } from '@/app/api/properties/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    property: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', title: 'Test Property', price: 3000, status: 'RENT' }
      ]),
      count: jest.fn().mockResolvedValue(1),
    }
  }
}))

describe('GET /api/properties', () => {
  it('returns properties with pagination', async () => {
    const req = new NextRequest('http://localhost/api/properties?status=RENT')
    const res = await GET(req)
    const data = await res.json()

    expect(res.status).toBe(200)
    expect(data.properties).toHaveLength(1)
    expect(data.pagination).toBeDefined()
    expect(data.pagination.total).toBe(1)
  })

  it('handles database errors gracefully', async () => {
    const { prisma } = require('@/lib/prisma')
    prisma.property.findMany.mockRejectedValueOnce(new Error('DB error'))

    const req = new NextRequest('http://localhost/api/properties')
    const res = await GET(req)
    expect(res.status).toBe(500)
  })
})
```

---

## Playwright E2E Setup

**`playwright.config.ts`**
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Desktop Firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'Desktop Safari', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile iOS', use: { ...devices['iPhone 14'] } },
    { name: 'Mobile Android', use: { ...devices['Pixel 7'] } },
    { name: 'Tablet', use: { ...devices['iPad (gen 7)'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

---

## E2E Test Examples

### Homepage test
**`tests/e2e/homepage.spec.ts`**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('hero section loads and is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /elevate your space/i })).toBeVisible()
    await expect(page.getByPlaceholder(/search properties/i)).toBeVisible()
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Properties' }).click()
    await expect(page).toHaveURL('/properties')
  })

  test('featured listings carousel shows cards', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('[data-testid="property-card"]')
    await expect(cards.first()).toBeVisible()
  })

  test('stats counter animates on scroll', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollBy(0, 800))
    await expect(page.getByTestId('stat-properties')).toContainText('2,500')
  })
})
```

### Property search E2E
**`tests/e2e/property-search.spec.ts`**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Property Search', () => {
  test('filter by city updates results', async ({ page }) => {
    await page.goto('/properties')
    await page.selectOption('[data-testid="filter-city"]', 'Manhattan')
    await page.getByRole('button', { name: 'Apply Filters' }).click()
    await expect(page.getByTestId('results-count')).toContainText('Manhattan')
  })

  test('toggle between grid and map view', async ({ page }) => {
    await page.goto('/properties')
    await expect(page.getByTestId('property-grid')).toBeVisible()
    await page.getByRole('button', { name: /map view/i }).click()
    await expect(page.getByTestId('property-map')).toBeVisible()
  })

  test('click property card goes to detail page', async ({ page }) => {
    await page.goto('/properties')
    await page.locator('[data-testid="property-card"]').first().click()
    await expect(page.url()).toContain('/properties/')
    await expect(page.getByTestId('property-title')).toBeVisible()
  })
})
```

### Mobile-specific test
**`tests/e2e/mobile.spec.ts`**

```typescript
import { test, expect, devices } from '@playwright/test'

test.use({ ...devices['iPhone 14'] })

test.describe('Mobile Experience', () => {
  test('hamburger menu opens on mobile', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /menu/i }).click()
    await expect(page.getByRole('navigation')).toBeVisible()
  })

  test('search bar is usable on mobile', async ({ page }) => {
    await page.goto('/')
    const searchBar = page.getByTestId('hero-search')
    await expect(searchBar).toBeVisible()
    await searchBar.tap()
    await expect(page.getByRole('combobox', { name: /city/i })).toBeVisible()
  })

  test('property grid shows single column on mobile', async ({ page }) => {
    await page.goto('/properties')
    const grid = page.getByTestId('property-grid')
    const gridStyle = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns)
    // Should be single column on 390px
    expect(gridStyle.split(' ').length).toBe(1)
  })
})
```

### Accessibility test
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  const pages = ['/', '/properties', '/contact', '/about']

  for (const path of pages) {
    test(`${path} has no critical accessibility violations`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze()
      expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0)
    })
  }
})
```

---

## Lighthouse CI Config

**`.lighthouserc.json`**
```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/properties",
        "http://localhost:3000/contact"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance":     ["error", { "minScore": 0.90 }],
        "categories:accessibility":   ["error", { "minScore": 0.95 }],
        "categories:best-practices":  ["error", { "minScore": 0.95 }],
        "categories:seo":             ["error", { "minScore": 1.00 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## QA Checklist — Before Each PR

### Visual
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile 375px — no overflow, all buttons reachable
- [ ] Tablet 768px — layout correct
- [ ] Desktop 1280px — looks premium, all animations work
- [ ] Dark theme consistent everywhere

### Functional
- [ ] All forms submit correctly + show success/error
- [ ] Loading states shown during data fetch
- [ ] Error states handled gracefully (no blank screens)
- [ ] Favourite toggle works (auth + non-auth)
- [ ] Navigation dropdowns open/close correctly

### Performance
- [ ] Images use `next/image` (no raw `<img>`)
- [ ] No layout shift on load (CLS < 0.1)
- [ ] First Contentful Paint < 2s

### Accessibility
- [ ] All images have `alt` text
- [ ] All form fields have labels
- [ ] Tab navigation works logically
- [ ] Colour contrast passes WCAG AA
