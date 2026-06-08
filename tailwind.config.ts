import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      
      colors: {
        garden: {
          dark: '#0a0a0a',
          charcoal: '#1a1a1a',
          parchment: '#f4e4c1',
          'parchment-aged': '#e8d5a3',
          'green-deep': '#1a2e1a',
          amber: '#c9a227',
          gold: '#f4a900',
          crimson: '#c41e3a',
          cream: '#f5f5f0',
          cosmic: '#0a0a1a',
          pearl: '#eae0c8',
        },
      },
      fontFamily: {
        display: ['var(--font-great-vibes)', 'cursive'],
        serif: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
        accent: ['var(--font-playfair-display)', 'Georgia', 'serif'],
        
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-out': 'fadeOut 1s ease-in-out',
        'iris-expand': 'irisExpand 1.2s ease-out forwards',
        'iris-expand-inner': 'irisExpandInner 1.2s ease-out forwards',
        'ink-reveal': 'inkReveal 0.8s ease-out forwards',
        'page-turn': 'pageTurn 1.5s ease-in-out forwards',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'rose-petal-fall': 'rosePetalFall 8s linear infinite',
        'shimmer': 'shimmer 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        irisExpand: {
          '0%': {
            clipPath: 'circle(0% at 50% 50%)',
          },
          '100%': {
            clipPath: 'circle(100% at 50% 50%)',
          },
        },
        irisExpandInner: {
          '0%': {
            clipPath: 'circle(0% at 50% 50%)',
            transform: 'scale(0.8)',
          },
          '100%': {
            clipPath: 'circle(100% at 50% 50%)',
            transform: 'scale(1)',
          },
        },
        inkReveal: {
          '0%': {
            opacity: '0',
            filter: 'blur(4px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0)',
          },
        },
        pageTurn: {
          '0%': {
            transform: 'rotateY(0deg)',
            transformOrigin: 'left center',
          },
          '100%': {
            transform: 'rotateY(-180deg)',
            transformOrigin: 'left center',
          },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(201, 162, 39, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(201, 162, 39, 0.8)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        rosePetalFall: {
          '0%': {
            transform: 'translateY(-10vh) rotate(0deg) translateX(0px)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(110vh) rotate(720deg) translateX(100px)',
            opacity: '0',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        grain: {
          '0%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
          '100%': { transform: 'translate(0, 0)' },
        },
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
      transitionTimingFunction: {
        'garden-in': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'garden-out': 'cubic-bezier(0.0, 0, 0.2, 1)',
        'garden-soft': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
};

export default config;