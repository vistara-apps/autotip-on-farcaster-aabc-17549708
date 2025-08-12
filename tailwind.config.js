/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(240 88% 55%)',
        'primary-light': 'hsl(240 88% 65%)',
        'primary-dark': 'hsl(240 88% 45%)',
        accent: 'hsl(200 85% 50%)',
        'accent-light': 'hsl(200 85% 60%)',
        success: 'hsl(142 76% 36%)',
        'success-light': 'hsl(142 76% 46%)',
        warning: 'hsl(38 92% 50%)',
        'warning-light': 'hsl(38 92% 60%)',
        error: 'hsl(0 84% 60%)',
        'error-light': 'hsl(0 84% 70%)',
        bg: 'hsl(240 10% 15%)',
        'bg-light': 'hsl(240 10% 18%)',
        surface: 'hsl(240 10% 20%)',
        'surface-light': 'hsl(240 10% 25%)',
        text: 'hsl(240 10% 95%)',
        'text-muted': 'hsl(240 10% 70%)',
        border: 'hsl(240 5% 30%)',
        'border-light': 'hsl(240 5% 40%)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 12px hsla(0, 0%, 0%, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.3, 0, 0.7, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.3, 0, 0.7, 1)',
        'bounce-gentle': 'bounceGentle 600ms cubic-bezier(0.3, 0, 0.7, 1)',
        'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontSize: {
        'display-lg': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'display': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'display-sm': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
      },
    },
  },
  plugins: [],
}
