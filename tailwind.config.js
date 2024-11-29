/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",   
    "./public/script.js", 
  ],
  theme: {
    extend: {
        fontFamily: {
          asapCondensed: ['"Asap Condensed"', 'sans-serif'], 
          ubuntuCondensed: ['"Ubuntu Condensed"', 'sans-serif'], 
        },
      },
    },

  plugins: [],
}

