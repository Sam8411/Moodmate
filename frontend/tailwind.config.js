/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        softBlue: {
          DEFAULT: '#4F8EF7',
          light: '#EAF2FF',
          dark: '#2A66C7'
        },
        mintGreen: {
          DEFAULT: '#8FD9A8',
          light: '#F0FBF4',
          dark: '#58B377'
        },
        lavender: {
          DEFAULT: '#C8B6FF',
          light: '#F4F0FF',
          dark: '#8C6CFA'
        },
        wellnessBeige: '#FDFBF7',
        wellnessGray: '#F5F5F7'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        premium: '0 8px 30px rgb(0,0,0,0.06)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      }
    },
  },
  plugins: [],
};
