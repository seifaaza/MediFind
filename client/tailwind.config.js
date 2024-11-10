module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#089cff",
        primaryLight: "#ecffff",
        primarySoft: "#d4fbff",
        secondary: "#f1ffdb",
        secondaryLight: "#f4ffec",
        secondarySoft: "#b6e11d",
      },
      fontFamily: {
        title: ["Raleway", "sans-serif"],
        main: ["Raleway", "sans-serif"],
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
