/** @type {import('tailwindcss').Config} */
module.exports = {
  content:[
    "./public/index.html",
    "./public/script.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        charm: ['"Charm"', 'cursive'],
        oregano: ['"Oregano"', 'cursive'],
      },
    },
  },
  plugins: [],
};
