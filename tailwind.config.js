// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: '#D1D5DB', 
        'dark-grey': '#6B7280', 
        purple: {
          DEFAULT: '#8B5CF6',
          // ... other shades
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Add this line
        gelasio: ['Gelasio', 'serif'],  // Add this line if not already present
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('daisyui'),
  ],
};
