module.exports = {
  'env': {
    'browser': true,
    'es2020': true,
    'node': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
  ],
  'rules': {
    'linebreak-style': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
  },
  'ignorePatterns': ['*/!.test.ts', '*/!.json', '!.md'],
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};
