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
        hero:    ['clamp(3rem, 8vw, 7rem)',     { lineHeight: '1.05' }],
        display: ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1' }],
        title:   ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
      },
      boxShadow: {
        gold:      '0 0 40px rgba(201,168,76,0.15)',
        'gold-lg': '0 0 80px rgba(201,168,76,0.25)',
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
