/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {},
    backgroundImage: {
      bgimage:
        "url('https://images.pexels.com/photos/51363/london-tower-bridge-bridge-monument-51363.jpeg')",
    },
    container: {
      center: true,
    },
  },
};
