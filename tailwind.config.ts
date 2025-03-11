import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        // 主色调
        primary: {
          DEFAULT: '#557571', // 青瓷绿
          light: '#7A9B97',
          dark: '#3C524F',
        },
        // 次要色调
        secondary: {
          DEFAULT: '#d4b187', // 赤金色
          light: '#E2C7A7',
          dark: '#B69268',
        },
        // 背景色
        background: {
          DEFAULT: '#f7f4ed', // 米白色
          dark: '#E8E2D6',
        },
        // 文字色
        text: {
          DEFAULT: '#2C3539', // 墨色
          light: '#5A6A70',
          dark: '#1A2124',    // 深墨色
          darker: '#0F1416',  // 玄墨色
        },

        // 点缀色
        accent: {
          DEFAULT: '#BC4749', // 绛红色
          light: '#D47274',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
