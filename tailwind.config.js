module.exports = {
  purge: ['./src/**/*.tsx', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'popup-content': '1fr auto',
      },
      gridTemplateRows: {
        'with-header': 'auto 1fr',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
