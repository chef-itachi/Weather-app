/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0D1B24',
        panel: '#142B36',
        panel2: '#193440',
        parchment: '#F5EFE3',
        brass: '#D99A56',
        brassdim: '#8A6A42',
        verdigris: '#5FB3AE',
        signal: '#E2574C',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
