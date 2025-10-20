/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      // Add custom fonts (example)
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Default sans-serif font
        serif: ['Georgia', 'serif'], // Custom serif font
        mono: ['Courier New', 'monospace'], // Custom monospace font
      },
      fontSize: {
        'xs': '0.75rem', // Small size
        'sm': '0.875rem', // Small size
        'base': '1rem', // Base size (default)
        'lg': '1.125rem', // Large size
        'xl': '1.25rem', // Extra large size
        '2xl': '1.5rem', // 2x Extra large
        '3xl': '1.875rem', // 3x Extra large
        '4xl': '2.25rem', // 4x Extra large
        '5xl': '3rem', // 5x Extra large
      },
      fontWeight: {
        thin: 100, // Extra light weight
        extralight: 200, // Extra light weight
        light: 300, // Light weight
        normal: 400, // Normal weight (default)
        medium: 500, // Medium weight
        semibold: 600, // Semi-bold weight
        bold: 700, // Bold weight
        extrabold: 800, // Extra bold weight
        black: 900, // Black weight
      },
      lineHeight: {
        tight: '1.25', // Tight line height
        normal: '1.5', // Normal line height (default)
        loose: '2', // Loose line height
      },
      
    },
  },
  plugins: [require('flowbite/plugin'), require('tailwind-scrollbar')],
};
