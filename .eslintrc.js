module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
  },
  rules: {},
  overrides: [
    // typescript files
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
    },

    // test files
    {
      files: ['__tests__/**/*.[jt]s', '**/*.test.[jt]s'],
      env: {
        jest: true,
      },
    },
  ],
};
