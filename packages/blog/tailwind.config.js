/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,tsx,ts}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
        lg: "4rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("tailwindcss-container-bleed")({
      currentScreenVar: "--current-screen-prowse",
    }),
  ],
};
