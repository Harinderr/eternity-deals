import type { Config } from "tailwindcss";
import {fontFamily} from  'tailwindcss/defaultTheme'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container : {
        center : true,
        padding : '1.2rem',
        screens : {
          sm : '100%' , md : '100%' , lg : "100%", xl : '1200px'
        }
      },
      fontFamily : {
        mono : ['var(--font-geist-mono)', ...fontFamily.mono],
        sans : ['var(--font-geist-sans)', ...fontFamily.sans]
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
