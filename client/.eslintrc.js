module.exports = {
  extends: ['airbnb-base', 'prettier'],
  overrides: [
    {
      files: ['*.jsx', '*.js'],
    },
  ],
  plugins: ['react', 'jsx-a11y', 'import'],
  parser: 'babel-eslint',
  rules: {
    'linebreak-style': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
  },
  ignorePatterns: ['test/*', '!.test.js',  '*.json'],
}