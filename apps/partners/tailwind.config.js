/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@cfce/components/dist/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        slate: {
          100: "#e2e8f0",
          200: "#cbd5e1",
          250: "#94a3b8",
          300: "#545d79",
          500: "#64748b",
          600: "#4a5070",
          700: "#272b36",
          800: "#17191f",
          900: "#030b36",
        },
        blue: {
          100: "#60688538",
          700: "#3052ff",
        },
      },
    },
  },
  plugins: [],
}
