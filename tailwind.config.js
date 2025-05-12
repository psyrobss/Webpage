// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-profundo': '#1E3A5F',
        'azul-suave': '#4A90E2',
        'lilás-neutro': '#B3A1D9',
        'roxo-psicologia': '#6A5ACD',
      },
      fontFamily: {
        sans: ['Roboto Flex', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}