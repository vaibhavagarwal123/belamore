import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        marble: {
          50: "#FDFCFA",
          100: "#FAF7F2",
          200: "#F4EEE4",
          300: "#ECE2D0",
          400: "#DFCEB2",
          500: "#CBB08A",
          600: "#B08F63",
        },
        beige: {
          50: "#FBF9F5",
          100: "#F6F1E9",
          200: "#EFE6D8",
          300: "#E4D5BE",
          400: "#D3BD9C",
        },
        blush: {
          50: "#FDF4F3",
          100: "#FAE6E4",
          200: "#F4CFCB",
          300: "#E8AFA9",
        },
        sage: {
          50: "#F3F6F1",
          100: "#E4EBDF",
          200: "#CBDAC1",
          300: "#AEC79F",
        },
        dusk: {
          50: "#F0F0F5",
          100: "#DCDCE8",
          200: "#B9B9D1",
        },
        gold: {
          50: "#FBF4E2",
          100: "#F3E1B0",
          300: "#D9B25B",
          500: "#B8862F",
          600: "#946A24",
          700: "#7A5A22",
        },
        ink: {
          400: "#8A8378",
          500: "#6B6459",
          600: "#4A443C",
          700: "#332F29",
          800: "#221F1A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "marble-veins":
          "radial-gradient(circle at 20% 20%, rgba(203,176,138,0.15), transparent 40%), radial-gradient(circle at 80% 60%, rgba(184,134,47,0.10), transparent 45%)",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(74, 68, 60, 0.18)",
        pedestal: "0 30px 60px -20px rgba(74, 68, 60, 0.35)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        doorOpenLeft: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(-105deg)" },
        },
        doorOpenRight: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(105deg)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        floatSlow: "floatSlow 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
