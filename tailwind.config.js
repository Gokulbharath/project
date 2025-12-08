/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        night: '#0B0B1A',
        surface: '#121229',
        surfaceAlt: '#0E0E20',
        neon: '#8A5CFF',
        cyan: '#4DD4FF',
        blue: '#2EB1FF',
        pink: '#FF4D8D',
        green: '#20E3B2',
        yellow: '#FFC857',
        red: '#FF5C7C',
        textHigh: '#E7E7F4',
        textDim: '#A3A3B2',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        // Design tokens
        night: '#0B0B1A',
        surface: '#121229',
        'surface-alt': '#0E0E20',
        'text-high': '#E7E7F4',
        'text-dim': '#A3A3B2',
        neon: '#8A5CFF',
        cyan: '#4DD4FF',
        blue: '#2EB1FF',
        pink: '#FF4D8D',
        green: '#20E3B2',
        yellow: '#FFC857',
        red: '#FF5C7C',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        glow: 'glow 2s ease-in-out infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      boxShadow: {
        'card': '0 1px 0 rgba(255,255,255,.04) inset, 0 12px 32px rgba(0,0,0,.35)',
        'glow': '0 0 0 1px rgba(138,92,255,.35), 0 10px 30px rgba(138,92,255,.20)',
        'neon-sm': '0 0 10px rgba(74, 108, 255, 0.3)',
        'neon-md': '0 0 20px rgba(74, 108, 255, 0.4)',
        'neon-lg': '0 0 30px rgba(74, 108, 255, 0.5)',
        'accent-sm': '0 0 10px rgba(165, 108, 255, 0.3)',
        'accent-md': '0 0 20px rgba(165, 108, 255, 0.4)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
