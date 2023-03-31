/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      gridTemplateRows: {
        'calendar-5': 'repeat(5, 1fr)',
        'calendar-6': 'repeat(6, 1fr)',
      },
      gridTemplateColumns: {
        calendar: 'repeat(7, 1fr)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
