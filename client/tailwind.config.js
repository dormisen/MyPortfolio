// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#222831',
          secondary: '#393E46',
          accent: '#948979',
          light: '#DFD0B8',
        },
        // Light mode colors
        light: {
          primary: '#B6AE9F',
          secondary: '#C5C7BC',
          accent: '#DEDED1',
          background: '#FBF3D1',
        }
      },
      backgroundColor: {
        'dark-primary': '#222831',
        'dark-secondary': '#393E46',
        'dark-accent': '#948979',
        'dark-light': '#DFD0B8',
        'light-primary': '#B6AE9F',
        'light-secondary': '#C5C7BC',
        'light-accent': '#DEDED1',
        'light-background': '#FBF3D1',
      },
      textColor: {
        'dark-primary': '#222831',
        'dark-secondary': '#393E46',
        'dark-accent': '#948979',
        'dark-light': '#DFD0B8',
        'light-primary': '#B6AE9F',
        'light-secondary': '#C5C7BC',
        'light-accent': '#DEDED1',
        'light-background': '#FBF3D1',
      },
      borderColor: {
        'dark-primary': '#222831',
        'dark-secondary': '#393E46',
        'dark-accent': '#948979',
        'dark-light': '#DFD0B8',
        'light-primary': '#B6AE9F',
        'light-secondary': '#C5C7BC',
        'light-accent': '#DEDED1',
        'light-background': '#FBF3D1',
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-gradient': 'linear-gradient(135deg, #222831 0%, #393E46 50%, #948979 100%)',
        'light-gradient': 'linear-gradient(135deg, #FBF3D1 0%, #DEDED1 50%, #C5C7BC 100%)',
      }
    },
  },
  plugins: [],
}