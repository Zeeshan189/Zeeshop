/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      web: "1400px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {},
  },
  plugins: [],
}

