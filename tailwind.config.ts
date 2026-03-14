// tailwind.config.ts
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#E8E4DD",
        "signal-red": "#E63B2E",
        "off-white": "#F5F3EE",
        black: "#111111",
      },
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono: ["Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
