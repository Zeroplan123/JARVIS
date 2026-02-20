/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'jarvis-blue': '#06b6d4',
        'jarvis-dark': '#0a0a0a',
        'jarvis-darker': '#050505',
        'jarvis-light': '#1a1a1a',
        'jarvis-accent': '#3b82f6',
        'jarvis-purple': '#8b5cf6',
        'jarvis-green': '#10b981',
        'jarvis-red': '#ef4444',
        'neon-cyan': '#67e8f9',
        'neon-blue': '#60a5fa',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'matrix-rain': 'matrix-rain 10s linear infinite',
        'neon-flicker': 'neon-flicker 1.5s infinite alternate',
        'tech-scan': 'tech-scan 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(6, 182, 212, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)', opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'tech-scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        'neon-gradient': 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
      }
    },
  },
  plugins: [],
}
