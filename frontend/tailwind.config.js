/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background': '#F2F0EF',
        'card': '#BBBDBC',
        'navbar': '#245F73',
        'footer': '#733E24',
        'button-primary': '#245F73',
        'button-secondary': '#733E24',
        'text-primary': '#245F73',
        'text-secondary': '#733E24',
      },
    },
  },
  plugins: [],
};