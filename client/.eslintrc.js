module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  'extends': [
    'plugin:react/recommended',
    'google',
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
  ],
  'rules': {
    'linebreak-style': 0,
    'no-unused-vars': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
  },
  'ignorePatterns': ['*/!.test.ts', '*/!.json', 'README.md'],
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
};
