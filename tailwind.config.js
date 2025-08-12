
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
        accent: 'hsl(200 85% 50%)',
        bg: 'hsl(240 10% 15%)',
        surface: 'hsl(240 10% 20%)',
        text: 'hsl(240 10% 95%)',
        border: 'hsl(240 5% 30%)',
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
      },
    },
  },
  plugins: [],
}
