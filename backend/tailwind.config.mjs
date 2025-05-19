// tailwind.config.mjs

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./views/**/*.hbs",
      "./public/**/*.html",
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
}