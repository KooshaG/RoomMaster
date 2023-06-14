/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#004000",
          "secondary": "#F2F2F2",
          "accent": "#B03B3B",
          "neutral": "#F0EAD6",
          "base-100": "#F0EAD6",
          "info": "#36a6e7",
          "success": "#3bcea4",
          "warning": "#d48311",
          "error": "#ea7666",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
