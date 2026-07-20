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
        canvas: '#0B0B0C',
        surface: '#141414',
        card: '#1B1B1D',
        elevated: '#222326',
        subtle: '#2A2A2D',
        'subtle-hover': '#3F3F46',
        'live-red': '#C62828',
        'progress-red': '#FF3B30',
        'status-success': '#22C55E',
        'status-warning': '#F59E0B',
        'status-error': '#EF4444',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B6B6B8',
        'text-muted': '#7A7A7D',
        'text-disabled': '#555558',
      },
      borderRadius: {
        btn: '10px',
        card: '14px',
        player: '16px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        minimal: '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
