/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            maxWidth: "none",
            a: {
              color: theme("colors.blue.600"),
              textDecoration: "none",
              backgroundImage: `linear-gradient(${theme(
                "colors.blue.200"
              )}, ${theme("colors.blue.200")})`,
              backgroundSize: "0% 2px",
              backgroundPosition: "0 100%",
              backgroundRepeat: "no-repeat",
              transition: "background-size 0.3s ease-in-out",
              "&:hover": {
                color: theme("colors.blue.700"),
                backgroundSize: "100% 2px",
              },
            },
            "h1, h2, h3, h4": {
              color: theme("colors.gray.900"),
              fontWeight: "700",
              letterSpacing: "-0.025em",
            },
            code: {
              color: theme("colors.pink.500"),
              backgroundColor: theme("colors.gray.100"),
              padding: "0.25rem 0.4rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
            },
            "code::before": {
              content: "none",
            },
            "code::after": {
              content: "none",
            },
            blockquote: {
              borderLeftColor: theme("colors.blue.500"),
              color: theme("colors.gray.900"),
              fontStyle: "italic",
              backgroundColor: theme("colors.blue.50"),
              padding: "1rem",
              borderRadius: "0.5rem",
              marginLeft: 0,
            },
            pre: {
              backgroundColor: theme("colors.gray.50"),
              color: theme("colors.gray.900"),
              borderRadius: "0.5rem",
              padding: "1rem",
              border: `1px solid ${theme("colors.gray.200")}`,
            },
          },
        },
        invert: {
          css: {
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.blue.400"),
              backgroundImage: `linear-gradient(${theme(
                "colors.blue.900"
              )}, ${theme("colors.blue.900")})`,
              "&:hover": {
                color: theme("colors.blue.300"),
              },
            },
            "h1, h2, h3, h4": {
              color: theme("colors.gray.100"),
            },
            code: {
              color: theme("colors.pink.400"),
              backgroundColor: theme("colors.gray.800"),
            },
            strong: {
              color: theme("colors.gray.100"),
            },
            blockquote: {
              borderLeftColor: theme("colors.blue.400"),
              color: theme("colors.gray.200"),
              backgroundColor: theme("colors.blue.900/20"),
            },
            pre: {
              backgroundColor: theme("colors.gray.900"),
              color: theme("colors.gray.200"),
              border: `1px solid ${theme("colors.gray.700")}`,
            },
            th: {
              color: theme("colors.gray.100"),
            },
            td: {
              borderColor: theme("colors.gray.700"),
            },
            hr: {
              borderColor: theme("colors.gray.700"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
