module.exports = {
  purge: ['./src/**/*.tsx', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'popup-content': '1fr auto',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
