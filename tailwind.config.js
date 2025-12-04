/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },

    },
    extend: {
      colors: {
        primary: {
          50: '#edffe8',
          100: '#d8ffd0',
          500: '#4c956c',
          600: '#2c6e49',
          700: '#1e4f34',
        },
        // Add to shadcn color scheme
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... other shadcn colors
      },
      backgroundColor: {
        'primary-light': '#edffe8',
      },
       borderColor: {
        'border': 'hsl(var(--border))',
      },
      
    },
  },
  plugins: [
  require("tailwindcss-animate")
]

}

