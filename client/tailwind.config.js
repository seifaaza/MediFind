module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        light: "#e9f6ff",
        primary: "#0894ff",
        secondary: "#1285f8",
      },
      fontFamily: {
        main: ["Kodchasan", "sans-serif"],
      },
    },
    screens: {
      sm: "320px",
      md: "640px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1450px",
      "3xl": "1620px",
    },
  },
  plugins: [],
};
