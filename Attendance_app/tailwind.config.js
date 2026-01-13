/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements-react/dist/js/**/*.js"
],
  theme: {
    fontSize: {
      sm: '0.8rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.8rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
    },

    screens: {
      'msm': '576px',
      // => @media (min-width: 576px) { ... }

      'mmd': '960px',
      // => @media (min-width: 960px) { ... }

      'mlg': '1440px',
      // => @media (min-width: 1440px) { ... }
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
      'xsm':{'max':'500'}
    },
    extend: {
      colors: {
        'ista-blue': '#4593e1',
        'ista-green':"#13c296",
        teal: {
          100: "#d0f3ea",
          200: "#a1e7d5",
          300: "#71dac0",
          400: "#42ceab",
          500: "#13c296",
          600: "#0f9b78",
          700: "#0b745a",
          800: "#084e3c",
          900: "#04271e",
        },
        indigo: {
          100: "#d6ddf6",
          200: "#acbbed",
          300: "#839ae5",
          400: "#5978dc",
          500: "#3056d3",
          600: "#2645a9",
          700: "#1d347f",
          800: "#132254",
          900: "#0a112a",
        },

        black: {
          100: "#d0d0d0",
          200: "#a1a1a1",
          300: "#717373",
          400: "#424444",
          500: "#131515",
          600: "#0f1111",
          700: "#0b0d0d",
          800: "#080808",
          900: "#040404",
        },
      },
      
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }  
    },
    
  },

darkMode: "class",
plugins: [require("tw-elements-react")]
  
}
// #4C57A4
