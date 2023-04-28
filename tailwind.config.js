/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {},
    backgroundImage: {
      bgimage: "url('bridge.jpg')",
    },
    container: {
      center: true,
    },
  },
};
