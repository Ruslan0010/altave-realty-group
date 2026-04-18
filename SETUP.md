# 🛠️ Setup Guide — Ubuntu + VS Code + Claude Code

## Prerequisites (Ubuntu)

```bash
# Node.js 20+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 && nvm use 20
node --version   # should show v20.x.x

# Git
sudo apt install git -y
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

---

## Create the Project

```bash
# 1. Create project folder
mkdir ~/projects/altave-realty-group
cd ~/projects/altave-realty-group

# 2. Put CLAUDE.md and docs/ folder here first
# (copy from the instruction files you downloaded)

# 3. Open in VS Code
code .

# 4. Launch Claude Code in the VS Code terminal
claude
```

---

## Claude Code First Command

Paste this exactly into the Claude Code terminal:

```
Read CLAUDE.md carefully, then read every file in docs/.
You now understand the full Altave Realty Group project.
Start by running the setup from docs/SETUP.md:
initialise a Next.js 14 project with TypeScript, Tailwind CSS,
ESLint, App Router, and src/ directory.
Then spawn DesignAgent to configure Tailwind and globals.css per docs/DESIGN_SYSTEM.md.
Then spawn BackendAgent to initialise Prisma per docs/DATABASE.md.
```

---

## Next.js Initialisation

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

---

## Install All Dependencies

```bash
npm install \
  framer-motion \
  @prisma/client prisma \
  @supabase/supabase-js @supabase/ssr \
  mapbox-gl @types/mapbox-gl react-map-gl \
  lucide-react \
  clsx tailwind-merge \
  date-fns \
  react-hook-form @hookform/resolvers zod \
  react-hot-toast \
  swiper \
  @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-slider \
  @radix-ui/react-tabs \
  @radix-ui/react-accordion \
  resend \
  stripe @stripe/stripe-js

npm install -D \
  prettier prettier-plugin-tailwindcss \
  husky lint-staged \
  jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom \
  @playwright/test \
  @types/jest

# shadcn/ui
npx shadcn@latest init
# Choose: Default style, Zinc base, Yes to CSS variables

# Prisma
npx prisma init

# Playwright browsers
npx playwright install
```

---

## tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#A8882E',
        },
        bg: {
          base:     '#0A0A0F',
          card:     '#111118',
          elevated: '#1A1A24',
          border:   '#2A2A38',
        },
        text: {
          primary:   '#FFFFFF',
          secondary: '#A0A0B8',
          muted:     '#606075',
        },
        status: {
          rent:       '#4ADE80',
          sale:       '#60A5FA',
          commercial: '#F59E0B',
          hot:        '#EF4444',
          reduced:    '#A78BFA',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'serif'],
        heading: ['var(--font-montserrat)', 'sans-serif'],
        body:    ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        hero:    ['clamp(3rem, 8vw, 7rem)',   { lineHeight: '1.05' }],
        display: ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1' }],
        title:   ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
      },
      boxShadow: {
        gold:    '0 0 40px rgba(201,168,76,0.15)',
        'gold-lg':'0 0 80px rgba(201,168,76,0.25)',
      },
      animation: {
        shimmer: 'shimmer 3s linear infinite',
        grain:   'grain 8s steps(10) infinite',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        shimmer: {
          to: { backgroundPosition: '200% center' },
        },
        grain: {
          '0%,100%': { transform: 'translate(0,0)' },
          '10%':     { transform: 'translate(-5%,-10%)' },
          '30%':     { transform: 'translate(7%,-25%)' },
          '50%':     { transform: 'translate(-15%,10%)' },
          '70%':     { transform: 'translate(0%,15%)' },
          '90%':     { transform: 'translate(-10%,10%)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
```

---

## globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-bg-base text-text-primary font-body antialiased;
    -webkit-tap-highlight-color: transparent;
  }

  /* Scrollbar */
  ::-webkit-scrollbar       { width: 6px; }
  ::-webkit-scrollbar-track { @apply bg-bg-base; }
  ::-webkit-scrollbar-thumb { @apply bg-bg-border rounded-full; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(201,168,76,0.4); }

  /* Selection */
  ::selection { background: rgba(201,168,76,0.2); color: #fff; }
}

@layer utilities {
  .container-custom { @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8; }

  .gold-text {
    background: linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #A8882E 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gold-shimmer {
    background: linear-gradient(90deg, #C9A84C 0%, #E8C97A 30%, #C9A84C 60%, #A8882E 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .glass {
    background: rgba(10,10,15,0.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(201,168,76,0.2);
  }
}
```

---

## .env.example

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk.eyJ..."

# Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""

# Resend (email)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@altaverealty.com"

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Altave Realty Group"
```

---

## VS Code Settings

**`.vscode/extensions.json`**
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "christian-kohler.path-intellisense",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-typescript-next",
    "anthropic.claude-code"
  ]
}
```

**`.vscode/settings.json`**
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "'([^']*)'"],
    ["cn\\(([^)]*)\\)", "'([^']*)'"]
  ]
}
```

---

## package.json Scripts

```json
{
  "scripts": {
    "dev":          "next dev",
    "build":        "next build",
    "start":        "next start",
    "lint":         "next lint",
    "type-check":   "tsc --noEmit",
    "format":       "prettier --write .",
    "test":         "jest",
    "test:watch":   "jest --watch",
    "test:e2e":     "playwright test",
    "test:e2e:ui":  "playwright test --ui",
    "db:push":      "prisma db push",
    "db:studio":    "prisma studio",
    "db:seed":      "ts-node prisma/seed.ts",
    "db:generate":  "prisma generate"
  }
}
```
