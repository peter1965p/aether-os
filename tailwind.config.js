/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Wichtig, da deine Files im src-Ordner liegen
  ],
  theme: {
    extend: {
      colors: {
        // 1. Deine bestehenden Enterprise-Farben bleiben erhalten
        enterprise: {
          bg: "#D9D5D1",
          orange: "#ff4d00",
          dark: "#202020",
        },
        // 2. DAS IST DER ENTSCHEIDENDE TEIL FÜR DEN SWITCH:
        // Wir definieren 'accent' so, dass Tailwind die CSS-Variable liest
        // Das '<alpha-value>' sorgt dafür, dass Klassen wie bg-accent/30 funktionieren
        accent: "rgb(var(--accent-rgb) / <alpha-value>)",
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}