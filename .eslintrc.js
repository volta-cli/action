module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  env: {
    node: true,
  },
  rules: {},
  overrides: [
    // test files
    {
      files: ['__tests__/**/*.[jt]s', '**/*.test.[jt]s'],
      env: {
        jest: true,
      },
    },
  ],
};
