/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { poppins: ["Poppins", "sans-serif"], },
      colors: {
        vert: "#D3F26A",
        blanc: "#FFFFFF",
        fond: "#F9F9F9",
        noir: "#050517",
        violet: "#9F8BE9",
        orange: "#FF4F01",
        beige: "#F5F5EA",
        beige1: "#CAC9B7",
        beige2: "#A3A28C",
        beige3: "#5E5F4A",
      },
    },
  },
  plugins: [],
};
