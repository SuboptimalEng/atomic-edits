module.exports = {
  purge: { content: ['./public/**/*.html', './src/**/*.vue'] },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      black: 'var(--black)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      'primary-hover': 'var(--primary-hover)',
      'ws-wave-color': 'var(--ws-wave-color)',
      'ws-progress-color': 'var(--ws-progress-color)',
      'ws-silent-color': 'var(--ws-silent-color)',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
