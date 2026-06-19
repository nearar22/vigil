/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        abyss: {
          DEFAULT: '#03070f',
          deep: '#01040a',
          raised: '#081320',
          line: '#10283b',
        },
        cyan: {
          DEFAULT: '#37f0c8',
          soft: '#7df7df',
          deep: '#149e84',
        },
        violet: {
          DEFAULT: '#6a5cff',
          soft: '#9c92ff',
          deep: '#3a31a8',
        },
        rose: {
          DEFAULT: '#ff7aa6',
          soft: '#ffa9c4',
        },
        glowtext: {
          DEFAULT: '#e8f6f2',
          dim: '#9db8b3',
          faint: '#5f7a78',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Spline Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        bio: '0 0 60px -10px rgba(55, 240, 200, 0.5)',
        'bio-violet': '0 0 60px -10px rgba(106, 92, 255, 0.45)',
        'bio-rose': '0 0 60px -10px rgba(255, 122, 166, 0.45)',
        drawer: '-24px 0 60px -20px rgba(0, 0, 0, 0.8)',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'drift-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        breathe: 'breathe 5s ease-in-out infinite',
        'drift-in': 'drift-in 0.5s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        'spin-slow': 'spin-slow 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
